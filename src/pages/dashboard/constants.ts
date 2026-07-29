import { localize } from '@deriv-com/translations';

export type TSidebarItem = {
    label: string;
    content: { data: string; faq_id?: string }[];
    link: boolean;
};

export const SIDEBAR_INTRO = (): TSidebarItem[] => [
    {
        label: localize('Welcome to M - TRADE Bot!'),
        content: [
            {
                data: localize(
                    'Ready to automate your trading strategy without writing any code? You have come to the right place.'
                ),
            },
            { data: localize('Feel free to look around') },
        ],
        link: false,
    },
    {
        label: localize('Guide'),
        content: [{ data: localize('M - TRADE Bot - your automated trading partner. Feel free to look around') }],
        link: false,
    },
];
