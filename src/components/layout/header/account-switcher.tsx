import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { addComma, getCurrencyDisplayCode, getDecimalPlaces } from '@/components/shared';
import Text from '@/components/shared_ui/text';
import { api_base } from '@/external/bot-skeleton/services/api/api-base';
import { useApiBase } from '@/hooks/useApiBase';
import { useLogout } from '@/hooks/useLogout';
import { useStore } from '@/hooks/useStore';
import { isDemoAccount } from '@/utils/account-helpers';
import { Localize, localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { TAccountSwitcher } from './common/types';
import AccountInfoWrapper from './account-info-wrapper';
import './account-switcher.scss';

const formatBalance = (balance: number | string | undefined, currency: string) =>
    addComma(Number(balance ?? 0).toFixed(getDecimalPlaces(currency)));

const AccountSwitcher = observer(({ activeAccount }: TAccountSwitcher) => {
    const [isOpen, setIsOpen] = useState(false);
    const [optimisticLoginid, setOptimisticLoginid] = useState<string | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const { accountList, activeLoginid } = useApiBase();
    const { client, run_panel } = useStore() ?? {};
    const { isDesktop } = useDevice();
    const handleLogout = useLogout();

    const is_bot_running = run_panel?.is_running || api_base.is_running;
    const effectiveLoginid = optimisticLoginid || activeLoginid || activeAccount?.loginid || '';

    useEffect(() => {
        if (optimisticLoginid && activeLoginid === optimisticLoginid) {
            setOptimisticLoginid(null);
        }
    }, [activeLoginid, optimisticLoginid]);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            const clicked_trigger = wrapperRef.current?.contains(target);
            const clicked_panel = panelRef.current?.contains(target);
            if (!clicked_trigger && !clicked_panel) {
                setIsOpen(false);
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || isDesktop) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = original;
        };
    }, [isOpen, isDesktop]);

    const toggleDropdown = useCallback(() => {
        if (is_bot_running) return;
        setIsOpen(prev => !prev);
    }, [is_bot_running]);

    const handleAccountSelect = useCallback(
        (loginid: string) => {
            if (loginid === effectiveLoginid) {
                setIsOpen(false);
                return;
            }
            setOptimisticLoginid(loginid);
            localStorage.setItem('active_loginid', loginid);
            client?.checkAndRegenerateWebSocket();
            setIsOpen(false);
        },
        [client, effectiveLoginid]
    );

    const onLogout = useCallback(async () => {
        setIsOpen(false);
        await handleLogout();
    }, [handleLogout]);

    const formattedAccounts = useMemo(() => {
        if (!accountList) return [];
        return accountList
            .map(account => {
                const isActive = account.loginid === effectiveLoginid;
                const balanceValue =
                    isActive && client?.loginid === account.loginid && client?.balance != null
                        ? client.balance
                        : account.balance;

                return {
                    loginid: account.loginid,
                    currency: account.currency,
                    balance: formatBalance(balanceValue, account.currency),
                    isVirtual: isDemoAccount(account.loginid),
                    isActive,
                };
            })
            .sort((a, b) => (a.isActive ? -1 : b.isActive ? 1 : 0));
    }, [accountList, effectiveLoginid, client?.balance, client?.loginid]);

    if (!activeAccount) return null;

    const displayAccount =
        formattedAccounts.find(account => account.isActive) ||
        formattedAccounts.find(account => account.loginid === activeAccount.loginid);

    const isVirtual = displayAccount?.isVirtual ?? activeAccount.isVirtual;
    const currency = displayAccount?.currency ?? activeAccount.currency;
    const balance =
        displayAccount?.balance ??
        (client?.balance != null
            ? formatBalance(client.balance, currency)
            : activeAccount.balance);
    const showChevron = !is_bot_running;

    const accountsPanel = (
        <div
            ref={panelRef}
            className={classNames('acc-dropdown', {
                'acc-dropdown--modal': !isDesktop,
            })}
            role='listbox'
            aria-label={localize('Accounts')}
            onClick={e => e.stopPropagation()}
        >
            <div className='acc-dropdown__list'>
                {formattedAccounts.map(account => (
                    <div
                        key={account.loginid}
                        role='option'
                        aria-selected={account.isActive}
                        tabIndex={0}
                        className={classNames('acc-dropdown__account', {
                            'acc-dropdown__account--selected': account.isActive,
                            'acc-dropdown__account--virtual': account.isVirtual,
                        })}
                        onClick={() => !account.isActive && handleAccountSelect(account.loginid)}
                        onKeyDown={e => {
                            if (!account.isActive && (e.key === 'Enter' || e.key === ' ')) {
                                e.preventDefault();
                                handleAccountSelect(account.loginid);
                            }
                        }}
                    >
                        <Text
                            size='xxxs'
                            className={classNames('acc-dropdown__account-type', {
                                'acc-dropdown__account-type--virtual': account.isVirtual,
                            })}
                        >
                            {account.isVirtual ? (
                                <Localize i18n_default_text='Demo' />
                            ) : (
                                <Localize i18n_default_text='Real' />
                            )}
                        </Text>
                        <Text size='xxxs' className='acc-dropdown__loginid'>
                            {account.loginid}
                        </Text>
                        <Text size='xs' weight='bold' className='acc-dropdown__balance'>
                            {account.currency ? (
                                `${account.balance} ${getCurrencyDisplayCode(account.currency)}`
                            ) : (
                                <Localize i18n_default_text='No currency assigned' />
                            )}
                        </Text>
                    </div>
                ))}
            </div>
            <button type='button' className='acc-dropdown__logout' onClick={onLogout}>
                <Localize i18n_default_text='Log out' />
            </button>
        </div>
    );

    return (
        <div className='acc-info__wrapper' ref={wrapperRef}>
            <AccountInfoWrapper>
                <div
                    data-testid='dt_acc_info'
                    id='dt_core_account-info_acc-info'
                    role={showChevron ? 'button' : undefined}
                    tabIndex={showChevron ? 0 : -1}
                    aria-expanded={showChevron ? isOpen : undefined}
                    aria-haspopup={showChevron ? 'listbox' : undefined}
                    className={classNames('acc-info', {
                        'acc-info--is-virtual': isVirtual,
                        'acc-info--interactive': showChevron,
                    })}
                    onClick={toggleDropdown}
                    onKeyDown={e => {
                        if (showChevron && (e.key === 'Enter' || e.key === ' ')) {
                            e.preventDefault();
                            toggleDropdown();
                        }
                    }}
                >
                    <span className='acc-info__id' aria-hidden='true'></span>
                    <div className='acc-info__content'>
                        <div className='acc-info__account-type-header'>
                            <Text as='p' size='xs' className='acc-info__account-type'>
                                {isVirtual ? (
                                    <Localize i18n_default_text='Demo' />
                                ) : (
                                    <Localize i18n_default_text='Real' />
                                )}
                            </Text>
                            {showChevron && (
                                <span
                                    className={classNames('acc-info__select-arrow', {
                                        'acc-info__select-arrow--invert': isOpen,
                                    })}
                                >
                                    <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
                                        <path
                                            d='M2 4L6 8L10 4'
                                            stroke='currentColor'
                                            strokeWidth='1.5'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                        />
                                    </svg>
                                </span>
                            )}
                        </div>
                        {(typeof balance !== 'undefined' || !currency) && (
                            <div className='acc-info__balance-section'>
                                <p
                                    data-testid='dt_balance'
                                    className={classNames('acc-info__balance', {
                                        'acc-info__balance--no-currency': !currency && !isVirtual,
                                    })}
                                >
                                    {!currency ? (
                                        <Localize i18n_default_text='No currency assigned' />
                                    ) : (
                                        `${balance} ${getCurrencyDisplayCode(currency)}`
                                    )}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </AccountInfoWrapper>
            {isOpen &&
                (isDesktop
                    ? accountsPanel
                    : ReactDOM.createPortal(
                          <div
                              className='acc-dropdown__overlay'
                              data-testid='dt_acc_switcher_overlay'
                              onClick={() => setIsOpen(false)}
                          >
                              {accountsPanel}
                          </div>,
                          document.getElementById('modal_root') || document.body
                      ))}
        </div>
    );
});

export default AccountSwitcher;
