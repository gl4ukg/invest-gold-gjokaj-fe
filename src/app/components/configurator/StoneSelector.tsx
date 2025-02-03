import React from 'react';
import { StoneSettings, StoneSettingType, StoneType, StoneSize, StoneQuality, StoneSpacing, StonePosition } from '@/app/types/configurator';

interface StoneSelectorProps {
    stoneSettings: StoneSettings;
    onUpdateStoneSettings: (settings: StoneSettings) => void;
}

const stoneSettingTypes: StoneSettingType[] = [
    'No stone',
    'American',
    'Pave',
    'Channel',
    'Cross American',
    'Cross pave',
    'Cross channel',
    'Open channel',
    'Side American',
    'Side pave',
    'Free Stone Spreading',
    'Tensionring',
    'Tensionring (diagonal)',
    'Eye (vertical)',
    'Eye (horizontal)',
    'Eye (diagonal)',
];

const stoneTypes: StoneType[] = ['Brillant', 'Princess', 'Baguette', 'Emerald'];
const stoneSizes: StoneSize[] = ['0.01 ct.', '0.02 ct.', '0.03 ct.', '0.05 ct.', '0.10 ct.'];
const stoneQualities: StoneQuality[] = ['G-H/VS-SI', 'F-G/VVS', 'D-E/IF-VVS1'];
const stoneSpacings: StoneSpacing[] = ['Together', 'Small Gap', 'Medium Gap', 'Large Gap'];
const stonePositions: StonePosition[] = ['Left', 'Center', 'Right'];

export const StoneSelector: React.FC<StoneSelectorProps> = ({
    stoneSettings,
    onUpdateStoneSettings,
}) => {
    const handleChange = <T extends keyof StoneSettings>(field: T, value: StoneSettings[T]) => {
        onUpdateStoneSettings({
            ...stoneSettings,
            [field]: value,
        });
    };

    return (
        <div className="space-y-8">
            {/* Stone Setting Type Selection */}
            <div>
                <h3 className="text-darkGray text-lg font-medium mb-4">Stone Setting Type</h3>
                <div className="grid grid-cols-4 gap-4">
                    {stoneSettingTypes?.map((type) => (
                        <button
                            key={type}
                            onClick={() => handleChange('settingType', type)}
                            className={`p-4 border rounded-lg ${
                                stoneSettings.settingType === type
                                    ? 'border-primary bg-primary/10'
                                    : 'border-darkGray'
                            }`}
                        >
                            <div className="aspect-square bg-gray-100 rounded-lg mb-2">
                                {/* Replace with actual image */}
                                <div className="w-full h-full flex items-center justify-center text-darkGray">
                                    {type}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {stoneSettings.settingType !== 'No stone' && (
                <>
                    {/* Stone Type */}
                    <div>
                        <label className="block text-darkGray text-sm font-medium mb-2">Stone Type</label>
                        <select
                            value={stoneSettings.stoneType}
                            onChange={(e) => handleChange('stoneType', e.target.value as StoneType)}
                            className="w-full p-2 border border-darkGray text-darkGray rounded-lg"
                        >
                            {stoneTypes?.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Stone Size */}
                    <div>
                        <label className="block text-darkGray text-sm font-medium mb-2">Stone Size</label>
                        <select
                            value={stoneSettings.stoneSize}
                            onChange={(e) => handleChange('stoneSize', e.target.value as StoneSize)}
                            className="w-full p-2 border border-darkGray text-darkGray rounded-lg"
                        >
                            {stoneSizes?.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Stone Quality */}
                    <div>
                        <label className="block text-darkGray text-sm font-medium mb-2">Stone Quality</label>
                        <select
                            value={stoneSettings.stoneQuality}
                            onChange={(e) => handleChange('stoneQuality', e.target.value as StoneQuality)}
                            className="w-full p-2 border border-darkGray text-darkGray rounded-lg"
                        >
                            {stoneQualities?.map((quality) => (
                                <option key={quality} value={quality}>
                                    {quality}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Number of Stones */}
                    <div>
                        <label className="block text-darkGray text-sm font-medium mb-2">Number of Stones</label>
                        <select
                            value={stoneSettings.numberOfStones}
                            onChange={(e) => handleChange('numberOfStones', Number(e.target.value))}
                            className="w-full p-2 border border-darkGray text-darkGray rounded-lg"
                        >
                            {[1, 3, 5, 7, 15, 30]?.map((num) => (
                                <option key={num} value={num}>
                                    {num === 30 ? 'Full Eternity Ring (30)' : num}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Stone Spacing */}
                    <div>
                        <label className="block text-darkGray text-sm font-medium mb-2">Stone Spacing</label>
                        <select
                            value={stoneSettings.spacing}
                            onChange={(e) => handleChange('spacing', e.target.value as StoneSpacing)}
                            className="w-full p-2 border border-darkGray text-darkGray rounded-lg"
                        >
                            {stoneSpacings?.map((spacing) => (
                                <option key={spacing} value={spacing}>
                                    {spacing}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Stone Position */}
                    <div>
                        <label className="block text-darkGray text-sm font-medium mb-2">Stone Position</label>
                        <select
                            value={stoneSettings.position}
                            onChange={(e) => handleChange('position', e.target.value as StonePosition)}
                            className="w-full p-2 border border-darkGray text-darkGray rounded-lg"
                        >
                            {stonePositions?.map((position) => (
                                <option key={position} value={position}>
                                    {position}
                                </option>
                            ))}
                        </select>
                    </div>
                </>
            )}
        </div>
    );
};
