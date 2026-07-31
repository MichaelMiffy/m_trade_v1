import { TPresetBot } from '@/constants/preset-bots';

export const loadPresetBot = async (bot: TPresetBot, load_modal: any, setActiveTab: (tab: number) => void) => {
    const response = await fetch(bot.file);
    const xml_text = await response.text();

    await load_modal.loadStrategyToBuilder({
        id: bot.id,
        xml: xml_text,
        name: bot.name,
        save_type: 'local',
    });

    setActiveTab(1); // BOT_BUILDER index
};
