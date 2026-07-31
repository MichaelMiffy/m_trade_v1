import React from 'react';
import { observer } from 'mobx-react-lite';
import StrategyDescription from '../descriptions/strategy-description';
import { TDescription, TDescriptionItem } from '../types';

type TAccordionStrategyGroupProps = {
    tutorial_selected_strategy?: string;
    grouped_objects_by_title: TDescription;
    expanded_subtitles_storage: { [key: string]: boolean };
    setExpandedSubtitlesStorage: (value: { [key: string]: boolean }) => void;
};

type TDescriptionContent = {
    item: TDescriptionItem[] | string;
    font_size: string;
};

export const DescriptionContent = ({ item, font_size }: TDescriptionContent) => {
    const content_data: TDescriptionItem[] | string = Array.isArray(item) ? item : item.slice(1);
    return (
        <>
            {Array.isArray(content_data) &&
                content_data?.map(item => (
                    <React.Fragment key={item.id}>
                        <StrategyDescription item={item} font_size={font_size} />
                    </React.Fragment>
                ))}
        </>
    );
};

const AccordionStrategyGroup = observer((props: TAccordionStrategyGroupProps) => {
    void props; // props retained for parent API compatibility while accordion UI is stubbed
    return null;
});

export default AccordionStrategyGroup;
