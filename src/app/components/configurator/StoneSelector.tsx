import React from 'react';
import { StoneSettings, StoneSettingType, StoneType, StoneSize, StoneQuality, StonePosition } from '@/app/types/configurator';
import { SelectInput } from '../ui/SelectInput';
import { useTranslations } from 'next-intl';
import { RingStoneSpread } from './RingStoneSpread';

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
const stonePositions: StonePosition[] = ['Left', 'Center', 'Right', 'Free'];


// Setting types that should hide position selector completely
const settingsWithoutPosition = [
    'Cross American',
    'Cross Pave',
    'Cross Channel',
    'Side American',
    'Side Pave',
    'Tensionring',
    'Tensionring (Diagonal)',
    'Eye (Vertical)',
    'Eye (Horizontal)',
    'Eye (Diagonal)'
];

// Setting types that should disable left/right positions
const settingsWithCenterOnly = [
    'American',
    'Channel',
    'Open Channel'
];

export const StoneSelector: React.FC<StoneSelectorProps> = ({
    stoneSettings,
    onUpdateStoneSettings,
}) => {
    const t = useTranslations();


    const shouldShowPositions = !settingsWithoutPosition.includes(stoneSettings.settingType);
    
    const isPositionDisabled = (position: StonePosition) => {
        if (!settingsWithCenterOnly.includes(stoneSettings.settingType)) return false;
        return position === 'Left' || position === 'Right';
    };

    const handleChange = <T extends keyof StoneSettings>(field: T, value: StoneSettings[T]) => {
        console.log(field,value,"qokla fieldd")
      
        let newSettings;
        if(value === "Free Stone Spreading") {
            newSettings = {
                ...stoneSettings,
                [field]: value,
            };
        } else {
            newSettings = {
                ...stoneSettings,
                [field]: value,
                stones: [],
            };

            // If changing to Cross American, force rows to 1
            if (field === 'settingType' && value === 'Cross American') {
                newSettings.rows = 1;
            }
        }
        
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
                <h3 className="text-darkGray text-lg font-medium mb-4">{t('configurator.stones.settingType')}</h3>
                <div className="grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-3 gap-4">
                    {stoneSettingTypes?.map((type) => (
                        <button
                            key={type}
                            onClick={() => handleChange('settingType', type)}
                            className={`px-1 py-2 md:p-4 border rounded-lg ${
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
                                <p className="text-xs text-center text-darkGray font-medium line-clamp-2">{type}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {stoneSettings.settingType === 'Free Stone Spreading' ? (
                <RingStoneSpread 
                    onUpdateStones={(stones) => {
                        onUpdateStoneSettings({
                            ...stoneSettings,
                            stones: stones
                        });
                    }} 
                />
            ) : stoneSettings.settingType !== 'No stone' && (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Stone Type */}
                        <SelectInput
                            label={t('configurator.stones.stoneType')}
                            value={stoneSettings.stoneType}
                            onChange={(value) => handleChange('stoneType', value as StoneType)}
                            options={stoneTypes.map((type) => ({
                                value: type,
                                label: type
                            }))}
                        />


                        {/* Stone Size */}
                        <SelectInput
                            label={t('configurator.stones.stoneSize')}
                            value={stoneSettings.stoneSize}
                            onChange={(value) => handleChange('stoneSize', value as StoneSize)}
                            options={stoneSizes.map((size) => ({
                                value: size,
                                label: size
                            }))}
                        />

                        {/* Stone Quality */}
                        <SelectInput
                            label={t('configurator.stones.stoneQuality')}
                            value={stoneSettings.stoneQuality}
                            onChange={(value) => handleChange('stoneQuality', value as StoneQuality)}
                            options={stoneQualities.map((quality) => ({
                                value: quality,
                                label: quality
                            }))}
                        />

                        {/* Number of Stones - hide for specific settings */}
                        {![
                            'Cross American',
                            'Cross pave',
                            'Tensionring',
                            'Tensionring (diagonal)',
                            'Eye (Vertical)',
                            'Eye horizontal',
                            'Eye diagonal',
                            'Side American',
                            'Side pave'
                        ].includes(stoneSettings.settingType) && (
                            <SelectInput
                                label={t('configurator.stones.numberOfStones')}
                                value={stoneSettings.numberOfStones?.toString()}
                                onChange={(value) => handleChange('numberOfStones', Number(value))}
                                options={[
                                    { value: '10', label: '1/3 Eternity Ring (10)' },
                                    { value: '15', label: 'Half Eternity Ring (15)' },
                                    { value: '30', label: 'Full Eternity Ring (30)' },
                                    ...[...Array(30)]
                                        .map((_, i) => {
                                            const num = i + 1;
                                            if (![10, 15, 30].includes(num)) {
                                                return {
                                                    value: num.toString(),
                                                    label: num.toString()
                                                };
                                            }
                                            return undefined;
                                        })
                                        .filter((item): item is { value: string; label: string } => item !== undefined)
                                ].sort((a, b) => {
                                    // Keep special options at the top
                                    const isSpecialA = a.label.includes('Eternity');
                                    const isSpecialB = b.label.includes('Eternity');
                                    if (isSpecialA && !isSpecialB) return -1;
                                    if (!isSpecialA && isSpecialB) return 1;
                                    // Sort numbers naturally
                                    return Number(a.value) - Number(b.value);
                                })}
                            />
                        )}

                        {/* Number of Channels - only show for Cross channel */}
                        {stoneSettings.settingType === 'Cross channel' && (
                            <SelectInput
                                label={t('configurator.stones.numberOfChannels')}
                                value={stoneSettings.numberOfChannels?.toString() || '1'}
                                onChange={(value) => handleChange('numberOfChannels', Number(value))}
                                options={[
                                    { value: '1', label: '1' },
                                    { value: '2', label: '2' },
                                    { value: '3', label: '3' },
                                    { value: '4', label: '4' },
                                ]}
                            />
                        )}

                        {/* Rows - only show for Pave, Cross American, or Cross Pave */}
                        {['Pave', 'Cross American', 'Cross pave'].includes(stoneSettings.settingType) && (
                            <SelectInput
                                label={t('configurator.stones.rows')}
                                value={stoneSettings.settingType === 'Cross American' ? '1' : (stoneSettings.rows?.toString() || '1')}
                                onChange={(value) => {
                                    if (stoneSettings.settingType !== 'Cross American') {
                                        handleChange('rows', Number(value));
                                    }
                                }}
                                options={[
                                    { value: '1', label: '1' },
                                    { value: '2', label: '2' },
                                ]}
                                disabled={stoneSettings.settingType === 'Cross American'}
                            />
                        )}

                    </div>

                    {/* Stone Position */}
                    {shouldShowPositions && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-darkGray text-lg font-medium mb-4">{t('configurator.stones.stonePosition')}</h3>
                                <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                                    {stonePositions.map((position) => {
                                        const disabled = isPositionDisabled(position);
                                        return (
                                            <label
                                                key={position}
                                                className={`relative flex flex-col items-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} p-4 border rounded-lg transition-all ${
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
                                                        if (!disabled) {
                                                            handleChange('position', position);
                                                        }
                                                    }}
                                                    disabled={disabled}
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
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Free Position Slider */}
                            {stoneSettings.position === 'Free' && (
                                <div className="space-y-4 w-full max-w-[400px]">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-darkGray">{t('configurator.stones.stonePosition')}</label>
                                        <span className="text-sm font-medium" style={{ color: stoneSettings.offset === 0 ? '#4B5563' : '#B7A44C' }}>
                                            {stoneSettings.offset === 0
                                                ? 'Center'
                                                : `${Math.abs(stoneSettings?.offset || 0)}mm ${Number(stoneSettings?.offset) > 0 ? 'Right' : 'Left'}`}
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
                                            min="-7"
                                            max="7"
                                            step="1"
                                            value={stoneSettings.offset || 0}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('offset', parseInt(e.target.value))}
                                            className="w-full h-2 appearance-none cursor-pointer bg-transparent z-10 relative slider-input"
                                            style={{
                                                WebkitAppearance: 'none',
                                                background: 'transparent'
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
                    )}
                </>
            )}
        </div>
    );
};
