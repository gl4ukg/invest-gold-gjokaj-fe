import React from 'react';
import Image from 'next/image';
import { SelectInput } from '../ui/SelectInput';
import { PreciousMetal, ColorType, MetalColor, PolishType, Fineness, ColorConfig, ShapeCategory, ShapeConfig, WaveCount, HeightPercentage } from '@/app/types/configurator';

interface PreciousMetalSelectorProps {
    preciousMetal: PreciousMetal;
    onUpdatePreciousMetal: (preciousMetal: PreciousMetal) => void;
}

const metalColors: MetalColor[] = [
    'yellow gold',
    'white gold',
    'red gold',
    'rose gold',
    'white gold with palladium',
    'silver/ rhodium plated',
    'silver/ yellow gold plated',
    'silver/ red gold plated',
    'zirconium (black)',
    'zirconium (grey)',
];

const polishTypes: PolishType[] = [
    'Polished',
    'Vertical matte',
    'Horizontal matte',
    'Crossed matte',
    'Sandblasted',
    'Double crossed',
    'Ice matte',
    'Honeycomb',
    'Hammered tight',
    'Hammered wide',
    'Bark cross',
    'Wave',
    'MA3',
    'MA2-2',
    'Hammered tight (polished)',
    'Hammered wide (polished)',
];

const finenessOptions: Fineness[] = ['8K', '9K', '10K', '14K', '18K', '21K', '22K'];

const twoColorShapes: { category: ShapeCategory; variant: string }[] = [
    { category: 'vertical', variant: '1-1' },
    { category: 'vertical', variant: '1-2' },
    { category: 'vertical', variant: '2-1' },
    { category: 'vertical', variant: '3-1' },
    { category: 'vertical', variant: '4-1' },
    { category: 'sine', variant: '1-1' },
    { category: 'diagonal', variant: '1-1' },
    { category: 'segment', variant: '1-1' },
    { category: 'horizontal', variant: '1-1' },
];

const threeColorShapes: { category: ShapeCategory; variant: string }[] = [
    { category: 'vertical', variant: '1-1-1' },
    { category: 'vertical', variant: '2-1-2' },
    { category: 'vertical', variant: '1-2-2' },
    { category: 'vertical', variant: '2-2-1' },
    { category: 'vertical', variant: '1-2-1' },
    { category: 'vertical', variant: '3-1-3' },
    { category: 'vertical', variant: '1-3-1' },
    { category: 'vertical', variant: '1-4-1' },
    { category: 'vertical', variant: '4-1-1' },
    { category: 'vertical', variant: '3-1-1' },
    { category: 'vertical', variant: '2-1-1' },
    { category: 'diagonal', variant: '1-1-1' },
    { category: 'diagonal', variant: '1-2-1' },
    { category: 'vertical', variant: '2-1-2' },
    { category: 'sine', variant: '1-1-1' },
    { category: 'sine', variant: '1-2-1' },
    { category: 'sine', variant: '2-1-2' },
];

const waveCountOptions: WaveCount[] = [2, 3, 4];
const heightPercentageOptions: HeightPercentage[] = [30, 50, 70];

export const PreciousMetalSelector: React.FC<PreciousMetalSelectorProps> = ({
    preciousMetal,
    onUpdatePreciousMetal,
}) => {
    const handleColorTypeChange = (colorType: ColorType) => {
        onUpdatePreciousMetal({
            colorType,
            colors: Array(colorType === 'single' ? 1 : colorType === 'two' ? 2 : 3).fill({
                metalColor: metalColors[0],
                polishType: polishTypes[0],
                fineness: finenessOptions[0],
            }),
        });
    };

    const handleShapeSelect = (category: ShapeCategory, variant: string) => {
        onUpdatePreciousMetal({
            ...preciousMetal,
            shape: {
                category,
                variant,
                ...(category === 'sine' ? { waveCount: 2, heightPercentage: 50 } : {}),
                ...(category === 'diagonal' ? { heightPercentage: 50 } : {}),
            },
        });
    };

    const handleWaveCountChange = (waveCount: WaveCount) => {
        if (preciousMetal.shape?.category === 'sine') {
            onUpdatePreciousMetal({
                ...preciousMetal,
                shape: {
                    ...preciousMetal.shape,
                    waveCount,
                },
            });
        }
    };

    const handleHeightPercentageChange = (heightPercentage: HeightPercentage) => {
        if (preciousMetal.shape?.category === 'sine' || preciousMetal.shape?.category === 'diagonal') {
            onUpdatePreciousMetal({
                ...preciousMetal,
                shape: {
                    ...preciousMetal.shape,
                    heightPercentage,
                },
            });
        }
    };

    const handleColorConfigUpdate = (index: number, updates: Partial<ColorConfig>) => {
        const newColors = [...preciousMetal.colors];
        newColors[index] = { ...newColors[index], ...updates };
        onUpdatePreciousMetal({
            ...preciousMetal,
            colors: newColors,
        });
    };

    return (
        <div className="space-y-8">
            {/* Color Type Selection */}
            <div>
                <h3 className="text-darkGray text-lg font-medium mb-4">Select Color Type</h3>
                <div className="grid grid-cols-3 gap-4">
                    {(['single', 'two', 'three'] as const)?.map((type) => (
                        <button
                            key={type}
                            onClick={() => handleColorTypeChange(type)}
                            className={`p-4 border rounded-lg ${
                                preciousMetal.colorType === type
                                    ? 'border-primary bg-primary/10'
                                    : 'border-darkGray'
                            }`}
                        >
                            <span className="text-darkGray">
                                {type === 'single' ? 'Single Color' : type === 'two' ? 'Two Colors' : 'Three Colors'}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Shape Selection for Two/Three Colors */}
            {(preciousMetal.colorType === 'two' || preciousMetal.colorType === 'three') && (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-darkGray text-lg font-medium mb-4">Select Shape</h3>
                        <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-2 gap-4">
                            {(preciousMetal.colorType === 'two' ? twoColorShapes : threeColorShapes)?.map((shape) => (
                                <button
                                    key={`${shape.category}-${shape.variant}`}
                                    onClick={() => handleShapeSelect(shape.category, shape.variant)}
                                    className={`p-2 border rounded-lg ${
                                        preciousMetal.shape?.category === shape.category &&
                                        preciousMetal.shape?.variant === shape.variant
                                            ? 'border-primary bg-primary/10'
                                            : 'border-darkGray'
                                    }`}
                                >
                                    <div className="aspect-square bg-gray-100 rounded-lg mb-2">
                                        <img
                                            src={`/images/shapes/${preciousMetal.colorType}colors/${shape.category}-${shape.variant}.png`}
                                            alt={`${shape.category} ${shape.variant}`}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <p className="text-sm text-darkGray text-center">
                                        {shape.category} {shape.variant}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Additional Configuration for Sine Waves */}
                    {preciousMetal.shape?.category === 'sine' && (
                        <div className="grid grid-cols-2 gap-4">
                            <SelectInput
                                label="Wave Count"
                                value={preciousMetal?.shape?.waveCount?.toString() || '2'}
                                onChange={(value) => handleWaveCountChange(Number(value) as WaveCount)}
                                options={waveCountOptions.map((count) => ({
                                    value: count.toString(),
                                    label: `${count} Waves`
                                }))}
                            />
                            <SelectInput
                                label="Wave Height"
                                value={preciousMetal?.shape?.heightPercentage?.toString() || '50'}
                                onChange={(value) => handleHeightPercentageChange(Number(value) as HeightPercentage)}
                                options={heightPercentageOptions.map((height) => ({
                                    value: height.toString(),
                                    label: `${height}%`
                                }))}
                            />
                        </div>
                    )}

                    {/* Additional Configuration for Diagonal */}
                    {preciousMetal.shape?.category === 'diagonal' && (
                        <div>
                            <SelectInput
                                label="Diagonal Height"
                                value={preciousMetal?.shape?.heightPercentage?.toString() || '50'}
                                onChange={(value) => handleHeightPercentageChange(Number(value) as HeightPercentage)}
                                options={heightPercentageOptions.map((height) => ({
                                    value: height.toString(),
                                    label: `${height}%`
                                }))}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Color Configuration */}
            {preciousMetal.colors?.map((color, index) => (
                <div key={index} className="space-y-4">
                    <h3 className="text-darkGray text-lg font-medium">
                        {index === 0 ? 'Primary' : index === 1 ? 'Secondary' : 'Tertiary'} Color
                    </h3>
                    <div className='grid grid-cols-2 gap-4'>

                        {/* Metal Color */}
                        <SelectInput
                            label="Metal Color"
                            value={color.metalColor}
                            onChange={(value) => handleColorConfigUpdate(index, { metalColor: value as MetalColor })}
                            options={metalColors.map(color => {
                                // Handle special cases for metal colors
                                const imageNameMap: { [key: string]: string } = {
                                    'white gold with palladium': 'white-gold with palladium',
                                    'silver/ rhodium plated': 'silver-rhodium-plated',
                                    'silver/ yellow gold plated': 'silver-yellow-gold-plated',
                                    'silver/ red gold plated': 'silver-red-gold-plated',
                                    'zirconium (black)': 'zirconium-black',
                                    'zirconium (grey)': 'zirconium-grey'
                                };
                                
                                const imageName = imageNameMap[color.toLowerCase()] || color.toLowerCase().replace(/ /g, '-');
                                console.log('Color:', color, 'Image:', imageName);
                                
                                return ({
                                    value: color,
                                    label: color,
                                    image: `/images/colors/${imageName}.png`
                                });
                            })}
                            imageClassName="w-8 h-8 bg-gray-100 overflow-hidden"
                        />

                        {/* Polish Type */}
                        <SelectInput
                            label="Polish Type"
                            value={color.polishType}
                            onChange={(value) => handleColorConfigUpdate(index, { polishType: value as PolishType })}
                            options={polishTypes.map(type => {
                                // Map polish types to actual image names
                                const imageNameMap: { [key: string]: string } = {
                                    'Polished': 'polished',
                                    'Ice matte': 'ice-matte',
                                    'Sandblasted': 'sandblasted',
                                    'Vertical matte': 'vertical-matte',
                                    'Horizontal matte': 'horizontal-matte',
                                    'Crossed matte': 'crossed-matte',
                                    'Double crossed': 'double-crossed',
                                    'Bark cross': 'bark-cross',
                                    'Wave': 'wave',
                                    'Honeycomb': 'honeycomb',
                                    'Hammered wide': 'hammered-wide',
                                    'Hammered tight': 'hammered-tight',
                                    'Hammered wide (polished)': 'hammered-wide-(polished)',
                                    'Hammered tight (polished)': 'hammered-tight-(polished)',
                                };
                                return ({
                                    value: type,
                                    label: type,
                                    image: `/images/surface/${imageNameMap[type] || type.toLowerCase().replace(/ /g, '-')}.png`
                                });
                            })}
                            imageClassName="w-8 h-8 bg-gray-100 rounded-lg overflow-hidden"
                        />

                    </div>
                    {/* Fineness */}
                    <div>
                        <label className="block text-darkGray text-sm font-medium mb-2">Fineness</label>
                        <div className="grid grid-cols-4 gap-2">
                            {finenessOptions?.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleColorConfigUpdate(index, { fineness: option })}
                                    className={`
                                        px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                        ${color.fineness === option
                                            ? 'bg-primary text-white shadow-md transform scale-105'
                                            : 'border-2 border-primary/20 hover:border-primary/40 text-darkGray hover:bg-primary/5'
                                        }
                                    `}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
