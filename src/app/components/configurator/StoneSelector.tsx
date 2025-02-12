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
const stonePositions: StonePosition[] = ['Left', 'Center', 'Right', 'Free'];

export const StoneSelector: React.FC<StoneSelectorProps> = ({
    stoneSettings,
    onUpdateStoneSettings,
}) => {
    const handleChange = <T extends keyof StoneSettings>(field: T, value: StoneSettings[T]) => {
        const newSettings = {
            ...stoneSettings,
            [field]: value,
        };

        // If changing to Free position, ensure offset is set
        if (field === 'position' && value === 'Free') {
            newSettings.offset = 0;
        }
        // If changing to a non-Free position, remove offset
        if (field === 'position' && value !== 'Free') {
            delete newSettings.offset;
        }

        onUpdateStoneSettings(newSettings);
    };

    return (
        <div className="space-y-8">
            {/* Stone Setting Type Selection */}
            <div>
                <h3 className="text-darkGray text-lg font-medium mb-4">Stone Setting Type</h3>
                <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-2 gap-4">
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
                            <div className="space-y-2">
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                    <img
                                        src={`/images/stones/${type.toLowerCase().replace(/ /g, '-').replace(/\(|\)/g, '')}.png`}
                                        alt={type}
                                        className="w-full h-full object-contain p-2"
                                    />
                                </div>
                                <p className="text-sm text-center text-darkGray font-medium line-clamp-2">{type}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {stoneSettings.settingType !== 'No stone' && (
                <>
                    <div className="grid grid-cols-2 gap-4">
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

                    </div>
                    {/* Stone Position */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-darkGray text-lg font-medium mb-4">Stone Position</h3>
                            <div className="grid grid-cols-4 gap-4">
                                {stonePositions.map((position) => (
                                    <label
                                        key={position}
                                        className={`relative flex flex-col items-center cursor-pointer p-4 border rounded-lg transition-all ${
                                            stoneSettings.position === position
                                                ? 'border-primary bg-primary/10'
                                                : 'border-darkGray hover:border-primary/50'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="stonePosition"
                                            value={position}
                                            checked={stoneSettings.position === position}
                                            onChange={() => {
                                                handleChange('position', position);
                                            }}
                                            className="sr-only"
                                        />
                                        <div className="aspect-square w-full bg-gray-100 rounded-lg mb-2 overflow-hidden">
                                            <img
                                                src={`/images/positions/${position.toLowerCase()}.png`}
                                                alt={`${position} position`}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <span className="text-sm text-darkGray">{position}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Free Position Slider */}
                        {stoneSettings.position === 'Free' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-darkGray">Stone Position</label>
                                    <span className="text-sm font-medium" style={{ color: stoneSettings.offset === 0 ? '#4B5563' : '#B7A44C' }}>
                                        {stoneSettings.offset === 0
                                            ? 'Center'
                                            : `${(Math.abs(stoneSettings?.offset || 0) * 0.008).toFixed(3)}mm ${Number(stoneSettings?.offset) > 0 ? 'Right' : 'Left'}`}
                                    </span>
                                </div>
                                <div className="relative pb-6">
                                    {/* Ring Preview */}
                                    <div className="absolute top-0 left-0 right-0 flex justify-center items-center">
                                        <div className="w-full h-6 relative">
                                            {/* Ring Bar */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-2 bg-gradient-to-r from-[#E5E7EB] via-[#D1D5DB] to-[#E5E7EB] rounded-full" />
                                            
                                            {/* Center Marker */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-4 bg-darkGray opacity-30" />
                                         
                                        </div>
                                    </div>
                                    
                                    {/* Slider Input */}
                                    <input
                                        type="range"
                                        min="-5"
                                        max="5"
                                        step="1"
                                        value={stoneSettings.offset || 0}
                                        onChange={(e) => handleChange('offset', parseInt(e.target.value))}
                                        className="w-full h-2 appearance-none cursor-pointer bg-transparent z-10 relative slider-input"
                                        style={{
                                            WebkitAppearance: 'none',
                                            background: 'transparent',
                                        }}
                                    />
                                </div>
                                
                                {/* Ring Measurement Image */}
                                <div className="flex justify-center mt-4">
                                    <img 
                                        src="/images/positions/measure.png" 
                                        alt="Ring measurements" 
                                        className="w-full h-auto object-contain"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
