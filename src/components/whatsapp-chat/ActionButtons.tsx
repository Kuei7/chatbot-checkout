
'use client';
import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import type { ScriptItem } from '@/lib/conversation';

interface ActionButtonsProps {
    buttons: ScriptItem['buttons'];
    onButtonClick: (button: NonNullable<ScriptItem['buttons']>[0]) => void;
}

const ActionButtons: FC<ActionButtonsProps> = ({ buttons = [], onButtonClick }) => {
    if (buttons.length === 0) {
        return null;
    }

    return (
        <div className="action-buttons-container">
            {buttons.map((button, index) => (
                <Button
                    key={index}
                    onClick={() => onButtonClick(button)}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-3 px-6 rounded-full shadow-lg w-full max-w-sm transition-transform transform hover:scale-105"
                >
                    {button.text}
                </Button>
            ))}
        </div>
    );
};

export default ActionButtons;
