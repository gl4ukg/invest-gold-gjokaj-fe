import React, { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Nanum_Brush_Script } from 'next/font/google';

const nanumBrush = Nanum_Brush_Script({
    weight: '400',
    subsets: ['latin'],
});
import { EngravingSettings, FontFamily, engravingSymbols } from '@/app/types/configurator';

interface EngravingSelectorProps {
    engraving: EngravingSettings;
    onUpdateEngraving: (settings: EngravingSettings) => void;
}

export const fontFamilies: { id: FontFamily; name: string; className?: string }[] = [
    { id: 'Arial', name: 'Arial' },
    { id: 'Corsiva', name: 'Monotype Corsiva' },
    { id: 'Lucida', name: 'Lucida Handwriting' },
    { id: 'Times New Roman', name: 'Times New Roman' },
    { id: 'Nanum Brush', name: 'Nanum Brush Script', className: nanumBrush.className }
];

export const EngravingSelector: React.FC<EngravingSelectorProps> = ({
    engraving,
    onUpdateEngraving,
}) => {
    const t = useTranslations();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleInsertSymbol = (symbol: string) => {
        if (inputRef.current) {
            const start = inputRef.current.selectionStart || 0;
            const end = inputRef.current.selectionEnd || 0;
            const text = engraving.text;
            const newText = text.substring(0, start) + symbol + text.substring(end);
            
            onUpdateEngraving({
                ...engraving,
                text: newText,
            });

            // Set cursor position after the inserted symbol
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                    inputRef.current.setSelectionRange(start + symbol.length, start + symbol.length);
                }
            }, 0);
        }
    };

    return (
        <div className="space-y-8">
            <h3 className="text-darkGray text-xl font-medium">{t('configurator.engraving.engravingText')}</h3>

            {/* Text Input */}
            <div className="space-y-4">
                <input
                    ref={inputRef}
                    type="text"
                    value={engraving.text}
                    onChange={(e) => onUpdateEngraving({ ...engraving, text: e.target.value, isTyping: true })}
                    onBlur={() => onUpdateEngraving({ ...engraving, isTyping: false })}
                    className={`w-full p-4 border border-darkGray text-darkGray rounded-lg text-2xl ${fontFamilies.find(f => f.id === engraving.fontFamily)?.className || ''}`}
                    style={{ fontFamily: fontFamilies.find(f => f.id === engraving.fontFamily)?.className ? undefined : fontFamilies.find(f => f.id === engraving.fontFamily)?.name }}
                    placeholder={t('configurator.engraving.inputPlaceholder')}
                />

                {/* Character Preview */}
                <div className="text-right text-sm text-darkGray">
                    {t('configurator.engraving.charactersCount', { count: engraving.text.length })}
                </div>
            </div>

            {/* Symbols */}
            <div className="space-y-4">
                <h4 className="text-darkGray text-lg font-medium">{t('configurator.engraving.symbols')}</h4>
                <div className="flex flex-wrap gap-4">
                    {engravingSymbols?.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleInsertSymbol(item.symbol)}
                            className="w-12 h-12 flex items-center justify-center border border-darkGray rounded-lg hover:bg-primary/10 transition-colors"
                        >
                            <span className="text-2xl text-darkGray">{item.symbol}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Font Selection */}
            <div className="space-y-4">
                <h4 className="text-darkGray text-lg font-medium">{t('configurator.engraving.fontStyle')}</h4>
                <div className="space-y-2">
                    {fontFamilies?.map((font) => (
                        <button
                            key={font.id}
                            onClick={() => onUpdateEngraving({ ...engraving, fontFamily: font.id })}
                            className={`w-full p-4 text-left border rounded-lg transition-colors ${
                                engraving.fontFamily === font.id
                                    ? 'border-primary bg-primary/10'
                                    : 'border-darkGray hover:bg-gray-50'
                            }`}
                        >
                            <span className={`text-darkGray ${font.className || ''}`} style={{ fontFamily: font.className ? undefined : font.name }}>
                                {font.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Preview */}
            <div className="space-y-4">
                <h4 className="text-darkGray text-lg font-medium">{t('configurator.engraving.preview')}</h4>
                <div className="p-6 border border-darkGray rounded-lg">
                    <p
                        className={`text-2xl text-darkGray text-center break-words ${fontFamilies.find(f => f.id === engraving.fontFamily)?.className || ''}`}
                        style={{ fontFamily: fontFamilies.find(f => f.id === engraving.fontFamily)?.className ? undefined : fontFamilies.find(f => f.id === engraving.fontFamily)?.name }}
                    >
                        {engraving.text || t('configurator.engraving.placeholder')}
                    </p>
                </div>
            </div>
        </div>
    );
};
