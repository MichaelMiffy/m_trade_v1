export type TPresetBot = {
    id: string;
    name: string;
    description: string;
    file: string;
};

export const PRESET_BOTS: TPresetBot[] = [
    {
        id: 'preset-ov-un',
        name: 'M-OVER/UNDER',
        description: 'A simple Over/Under strategy bot',
        file: '/bots/Gen_V1.xml',
    },
    {
        id: 'preset-even-odd',
        name: 'M-EVEN/ODD',
        description: 'A simple Even/Odd strategy bot',
        file: '/bots/EVOD.xml',
    },
    // add more entries here as you add more bot files
];
