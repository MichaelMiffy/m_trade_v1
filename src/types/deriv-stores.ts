import type { ProposalOpenContract } from '@deriv/api-types';
import type { Moment } from 'moment';

/**
 * Local stand-in for `@deriv/stores/types` (Deriv monorepo package not shipped here).
 * `core` on RootStore is the ClientStore / UiStore / CommonStore bundle.
 */
export type TNotificationMessage = {
    key: string;
    header?: string;
    message?: string | React.ReactNode;
    type?: string;
    action?: {
        text: string;
        onClick: () => void;
    };
    platform?: string;
    is_disposable?: boolean;
    is_persistent?: boolean;
};

export type TPortfolioPosition = {
    id?: number;
    contract_info: ProposalOpenContract;
    [key: string]: unknown;
};

export type TStores = {
    client: {
        loginid: string;
        currency: string;
        is_virtual: boolean | number;
        [key: string]: unknown;
    };
    ui: {
        is_mobile: boolean;
        is_desktop: boolean;
        is_dark_mode_on: boolean;
        is_chart_layout_default: boolean;
        [key: string]: unknown;
    };
    common: {
        server_time: Moment;
        current_language: string;
        is_socket_opened: boolean;
        [key: string]: unknown;
    };
    portfolio?: {
        positions: TPortfolioPosition[];
    };
    notifications?: {
        addNotificationMessage: (message: TNotificationMessage) => void;
    };
};
