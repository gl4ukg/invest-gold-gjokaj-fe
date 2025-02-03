import React, { useRef } from 'react';
import { EngravingSettings, FontFamily, engravingSymbols } from '@/app/types/configurator';

interface EngravingSelectorProps {
    engraving: EngravingSettings;
    onUpdateEngraving: (settings: EngravingSettings) => void;
}

const fontFamilies: FontFamily[] = ['Arial', 'Corsiva', 'Lucida', 'Times New Roman', 'Nanum Brush'];

export const EngravingSelector: React.FC<EngravingSelectorProps> = ({
    engraving,
    onUpdateEngraving,
}) => {
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
            <h3 className="text-darkGray text-xl font-medium">Engraving Text</h3>

            {/* Text Input */}
            <div className="space-y-4">
                <input
                    ref={inputRef}
                    type="text"
                    value={engraving.text}
                    onChange={(e) => onUpdateEngraving({ ...engraving, text: e.target.value })}
                    className="w-full p-4 border border-darkGray text-darkGray rounded-lg text-2xl"
                    style={{ fontFamily: engraving.fontFamily }}
                    placeholder="Enter your engraving text..."
                />

                {/* Character Preview */}
                <div className="text-right text-sm text-darkGray">
                    {engraving.text.length} / 25 characters
                </div>
            </div>

            {/* Symbols */}
            <div className="space-y-4">
                <h4 className="text-darkGray text-lg font-medium">Symbols</h4>
                <div className="grid grid-cols-8 gap-2">
                    {engravingSymbols.map((item) => (
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
                <h4 className="text-darkGray text-lg font-medium">Font Style</h4>
                <div className="space-y-2">
                    {fontFamilies.map((font) => (
                        <button
                            key={font}
                            onClick={() => onUpdateEngraving({ ...engraving, fontFamily: font })}
                            className={`w-full p-4 text-left border rounded-lg transition-colors ${
                                engraving.fontFamily === font
                                    ? 'border-primary bg-primary/10'
                                    : 'border-darkGray hover:bg-gray-50'
                            }`}
                        >
                            <span className="text-darkGray" style={{ fontFamily: font }}>
                                {font}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Preview */}
            <div className="space-y-4">
                <h4 className="text-darkGray text-lg font-medium">Preview</h4>
                <div className="p-6 border border-darkGray rounded-lg">
                    <p
                        className="text-2xl text-darkGray text-center break-words"
                        style={{ fontFamily: engraving.fontFamily }}
                    >
                        {engraving.text || 'Your text will appear here'}
                    </p>
                </div>
            </div>
        </div>
    );
};
