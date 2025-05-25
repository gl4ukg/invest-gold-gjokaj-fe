import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { GroovesAndEdges, GrooveType, EdgeType, SurfaceType, EdgeSettings, GrooveSettings, Direction } from '@/app/types/configurator';
import { RiLineHeight, RiRoundedCorner } from 'react-icons/ri';
import { SelectInput } from '@/app/components/ui/SelectInput';
import { useCart } from '@/app/context/CartContext';


interface GroovesAndEdgesSelectorProps {
    groovesAndEdges: GroovesAndEdges;
    onUpdateGroovesAndEdges: (settings: GroovesAndEdges) => void;
}

const surfaceTypes: SurfaceType[] = [
    'Polished',
    'Sandblasted'
];

const waveHeights = Array.from({ length: 19 }, (_, i) => (i + 1) * 5); // [5, 10, 15, ..., 95]

const edgeTypes: EdgeType[] = ['none', 'step', 'carbon', 'milgrain'];

const grooveTypes: GrooveType[] = [
    'V-groove (110°)',
    'U-groove',
    'Convex',
    'Square groove',
    'Carbon-groove',
    'Milgrain'
];

const EdgeSettingsForm: React.FC<{
    edge: EdgeSettings;
    onChange: (edge: EdgeSettings) => void;
    label: string;
}> = ({ edge, onChange, label }) => {
    const t = useTranslations();
    return (
    <div className="space-y-4">
        <h4 className="text-darkGray text-lg font-medium">{label}</h4>
        <div>
            <label className="block text-darkGray text-sm font-medium mb-2">{t('configurator.groovesAndEdges.type')}</label>
            <div className="grid grid-cols-8 gap-4">
                {edgeTypes?.map((type) => (
                    <div key={type} className="relative">
                        <input
                            type="radio"
                            id={`${label}-${type}`}
                            name={`${label}-type`}
                            value={type}
                            checked={edge.type === type}
                            onChange={() => {
                                const EDGE_DEPTHS = {
                                    step: 0.30,
                                    carbon: 0.46,
                                    milgrain: 0.10,
                                    none: 0.00,
                                    '': 0.00
                                } as const;

                                onChange({
                                    type,
                                    ...(type !== 'none' && {
                                        width: edge.width,
                                        depth: EDGE_DEPTHS[type as keyof typeof EDGE_DEPTHS],
                                        surface: edge.surface || 'Polished'
                                    })
                                });
                            }}
                            className="sr-only"
                        />
                        <label
                            htmlFor={`${label}-${type}`}
                            className={`block cursor-pointer ${edge.type === type ? 'ring-2 ring-primary ring-offset-2' : 'border border-darkGray'} rounded-lg p-2`}
                        >
                            <div className="space-y-2">
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                    <img
                                        src={`/images/edges/${type.toLowerCase()}.png`}
                                        alt={type}
                                        className="w-full h-full object-contain p-2"
                                    />
                                </div>
                                <p className="text-sm text-center text-darkGray font-medium capitalize">
                                    {type}
                                </p>
                            </div>
                        </label>
                    </div>
                ))}
            </div>
        </div>

        {edge.type !== 'none' && (
            <div className="grid grid-cols-2 gap-4">
                <div>
                    {/* Width options constants */}
                    {(() => {
                        const createOption = (value: string) => ({ 
                            value, 
                            label: `${value} mm` 
                        });

                        const STEP_WIDTHS = Array.from(
                            { length: 23 }, 
                            (_, i) => createOption(((i * 0.1 + 0.3).toFixed(2)))
                        );

                        const CARBON_WIDTHS = [
                            '0.80', '1.00', '1.50', '2.00'
                        ].map(createOption);

                        const MILGRAIN_WIDTHS = [
                            '0.45', '0.62', '0.80'
                        ].map(createOption);

                        const getWidthOptions = () => {
                            switch(edge.type) {
                                case 'step': return STEP_WIDTHS;
                                case 'carbon': return CARBON_WIDTHS;
                                case 'milgrain': return MILGRAIN_WIDTHS;
                                default: return [];
                            }
                        };

                        return (
                            <SelectInput
                                label={t('configurator.groovesAndEdges.width')}
                                value={(edge?.width || 0).toFixed(2)}
                                onChange={(value) => onChange({ ...edge, width: parseFloat(value) })}
                                options={getWidthOptions()}
                                className="w-full"
                            />
                        );
                    })()}
                </div>

                {/* Depth input with fixed values */}
                {(() => {
                    const EDGE_DEPTHS = {
                        step: '0.30',
                        carbon: '0.46',
                        milgrain: '0.10',
                        none: '0.00',
                        '': '0.00'
                    } as const;

                    const depth = EDGE_DEPTHS[edge.type] || EDGE_DEPTHS['none'];

                    return (
                        <div>
                            <SelectInput
                                label={t('configurator.groovesAndEdges.depth')}
                                value={depth}
                                onChange={() => {}} // No-op since it's disabled
                                options={[{ value: depth, label: `${depth} mm` }]}
                                className="w-full"
                                disabled={true}
                            />
                        </div>
                    );
                })()}

                {/* Surface input - always Polished and disabled */}
                <div>
                    <SelectInput
                        label={t('configurator.groovesAndEdges.surface')}
                        value="Polished"
                        onChange={() => {}} // No-op since it's disabled
                        options={[{ value: 'Polished', label: 'Polished' }]}
                        className="w-full"
                        disabled={true}
                    />
                </div>
            </div>
        )}
    </div>
    );
};

export const GroovesAndEdgesSelector: React.FC<GroovesAndEdgesSelectorProps> = ({
    groovesAndEdges,
    onUpdateGroovesAndEdges,
}) => {

    
    const { activeTab, setActiveTab } = useCart();
    const t = useTranslations();

    const [grooves, setGrooves] = useState<GrooveSettings[]>([]);
    const [selectedGrooveId, setSelectedGrooveId] = useState<number | null>(null);

    const addGroove = () => {
        if (grooves.length >= 5) return; // Maximum 5 grooves
        const newGroove: GrooveSettings = {
            id: Math.random(),
            grooveType: 'V-groove (110°)', 
            width: 0.14,
            depth: 0.05,
            surface: 'Polished',
            direction: 'vertical',
            position: 0,
        };
        const updatedGrooves = [...grooves, newGroove];
        setGrooves(updatedGrooves);
        setSelectedGrooveId(newGroove.id);
        
        // Update parent component
        onUpdateGroovesAndEdges({
            ...groovesAndEdges,
            groove: updatedGrooves
        });
    };

    const removeGroove = (id: number) => {
        const updatedGrooves = grooves.filter(groove => groove.id !== id);
        setGrooves(updatedGrooves);
        if (selectedGrooveId === id) {
            setSelectedGrooveId(null);
        }
        
        // Update parent component
        onUpdateGroovesAndEdges({
            ...groovesAndEdges,
            groove: updatedGrooves
        });
    };

    const updateGroove = (id: number, updates: Partial<GrooveSettings>) => {
        const updatedGrooves = grooves.map(groove => 
            groove.id === id ? { ...groove, ...updates } : groove
        );
        setGrooves(updatedGrooves);
        
        // Update parent component
        onUpdateGroovesAndEdges({
            ...groovesAndEdges,
            groove: updatedGrooves
        });
    };

    const handleGrooveChange = <T extends keyof GrooveSettings>(
        field: T,
        value: GrooveSettings[T]
    ) => {
        if (selectedGrooveId) {
            const updates: Partial<GrooveSettings> = { [field]: value };
            
            // If changing direction from wave to vertical, remove wave-specific properties
            if (field === 'direction' && value === 'vertical') {
                updates.numberOfWaves = undefined;
                updates.waveHeight = undefined;
            }
            
            // If changing direction to wave, set default wave properties
            if (field === 'direction' && value === 'wave') {
                updates.numberOfWaves = 1;
                updates.waveHeight = 5;
            }
            
            updateGroove(selectedGrooveId, updates);
        }
    };

    const handleEdgeChange = (side: 'leftEdge' | 'rightEdge', edge: EdgeSettings) => {
        onUpdateGroovesAndEdges({
            ...groovesAndEdges,
            [side]: edge,
        });
    };

    return (
        <div className="space-y-6">
            {/* Tab Switch */}
            <div className="flex justify-center mb-8">
                <div className="inline-flex rounded-xl p-1.5 bg-gray-100 space-x-4">
                    <button
                        onClick={() => setActiveTab('grooves')}
                        className={`
                            flex items-center gap-2 px-6 py-2.5 border rounded-lg text-sm font-medium
                            transition-all duration-200 ease-in-out
                            ${activeTab === 'grooves'
                                ? 'bg-white text-primary shadow-lg transform scale-105'
                                : 'text-darkGray hover:text-primary hover:bg-white/50'
                            }
                        `}
                    >
                        <RiLineHeight className="text-lg" />
                        <span>{t('configurator.groovesAndEdges.grooves')}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('edges')}
                        className={`
                            flex items-center gap-2 px-6 py-2.5 border rounded-lg text-sm font-medium
                            transition-all duration-200 ease-in-out
                            ${activeTab === 'edges'
                                ? 'bg-white text-primary shadow-lg transform scale-105'
                                : 'text-darkGray hover:text-primary hover:bg-white/50'
                            }
                        `}
                    >
                        <RiRoundedCorner className="text-lg" />
                        <span>{t('configurator.groovesAndEdges.edges')}</span>
                    </button>
                </div>
            </div>

            {/* Groove Settings */}
            {activeTab === 'grooves' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-darkGray text-xl font-medium">{t('configurator.groovesAndEdges.grooveSettings')}</h3>
                        <button 
                            onClick={addGroove}
                            disabled={grooves.length >= 5}
                            className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
                        >
                            Add Groove ({grooves.length}/5)
                        </button>
                    </div>

                    {grooves.length > 0 && (
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                            {grooves.map((groove, index) => (
                                <button
                                    key={groove.id}
                                    onClick={() => setSelectedGrooveId(groove.id)}
                                    className={`px-4 py-2 rounded-lg transition-all ${
                                        selectedGrooveId === groove.id
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 text-darkGray hover:bg-gray-200'
                                    }`}
                                >
                                    Groove {index + 1}
                                </button>
                            ))}
                        </div>
                    )}
                    
                    <div className='grid grid-cols-6 gap-4'>
                        <div className="col-span-1 relative w-[80px] h-[400px] bg-yellow-100 rounded-lg">
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70px] h-[400px]">
                                {/* Guide line */}
                                <div className="absolute left-1/2 top-0 bottom-0 w-px border-l border-[#777] border-dashed" />
                                
                                {/* Position markers */}
                                <div className="absolute top-0 -translate-y-1/2 left-0 text-[#777] text-xs">-5mm</div>
                                <div className="absolute top-1/2 -translate-y-1/2 left-0 text-[#777] text-xs">0mm</div>
                                <div className="absolute bottom-0 -translate-y-1/2 left-0 text-[#777] text-xs">+5mm</div>

                                {/* Grooves */}
                                {grooves.map((groove) => (
                                    <div
                                        key={groove.id}
                                        onClick={() => setSelectedGrooveId(groove.id)}
                                        className={`absolute h-full w-[2px] ${
                                            selectedGrooveId === groove.id ? 'bg-primary' : 'bg-darkGray'
                                        } cursor-pointer transition-all`}
                                        style={{
                                            left: `calc(50% + ${groove.position * 7}px)`,
                                            transform: 'translateX(-50%)'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className='col-span-5'>
                            {selectedGrooveId ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-lg text-darkGray font-medium">Groove #{grooves.findIndex(g => g.id === selectedGrooveId) + 1} Settings</h4>
                                        <button 
                                            onClick={() => removeGroove(selectedGrooveId)}
                                            className="px-3 py-1 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            Remove Groove
                                        </button>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-darkGray text-sm font-medium mb-2">{t('configurator.groovesAndEdges.grooveType')}</label>
                                            <div className="grid grid-cols-6 gap-4">
                                                {grooveTypes?.map((type) => (
                                                    <button
                                                        key={type}
                                                        onClick={() => handleGrooveChange('grooveType', type)}
                                                        className={`p-4 border rounded-lg ${
                                                            grooves.find(g => g.id === selectedGrooveId)?.grooveType === type
                                                                ? 'border-primary bg-primary/10'
                                                                : 'border-darkGray'
                                                        }`}
                                                    >
                                                        <div className="space-y-2">
                                                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                                                <img
                                                                    src={`/images/grooves/${type
                                                                        .toLowerCase()
                                                                        .replace('v-groove (110°)', 'v-groove-110')
                                                                        .replace('u-groove', 'u-groove')
                                                                        .replace('convex', 'convex-v-groove')
                                                                        .replace('square groove', 'square-groove')
                                                                        .replace('carbon-groove', 'carbon')
                                                                        .replace('milgrain', 'perlage')}.png`}
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

                                        <div>
                                            <SelectInput
                                                label={t('configurator.groovesAndEdges.width')}
                                                value={grooves.find(g => g.id === selectedGrooveId)?.width.toFixed(2)}
                                                onChange={(value) => handleGrooveChange('width', parseFloat(value))}
                                                options={[
                                                    { value: '0.14', label: '0.14 mm' },
                                                    { value: '0.29', label: '0.29 mm' },
                                                    { value: '0.43', label: '0.43 mm' }
                                                ]}
                                                className="w-full"
                                            />
                                        </div>

                                        <div>
                                            <SelectInput
                                                label={t('configurator.groovesAndEdges.grooveDepth')}
                                                value={grooves.find(g => g.id === selectedGrooveId)?.depth.toFixed(2)}
                                                onChange={(value) => handleGrooveChange('depth', parseFloat(value))}
                                                options={[
                                                    { value: '0.05', label: '0.05 mm' },
                                                    { value: '0.10', label: '0.10 mm' }
                                                ]}
                                                className="w-full"
                                            />
                                        </div>

                                        <div>
                                            <SelectInput
                                                label={t('configurator.groovesAndEdges.surface')}
                                                value={grooves.find(g => g.id === selectedGrooveId)?.surface}
                                                onChange={(value) => handleGrooveChange('surface', value as SurfaceType)}
                                                options={surfaceTypes.map(type => ({
                                                    value: type,
                                                    label: type,
                                                }))}
                                                className="w-full"
                                            />
                                        </div>
                                        
                                        <div>
                                            <SelectInput
                                                label="Direction"
                                                value={grooves.find(g => g.id === selectedGrooveId)?.direction}
                                                onChange={(value) => handleGrooveChange('direction', value as Direction)}
                                                options={[
                                                    { value: 'vertical', label: 'Vertical' },
                                                    { value: 'wave', label: 'Wave' }
                                                ]}
                                                className="w-full"
                                            />
                                        </div>

                                        {grooves.find(g => g.id === selectedGrooveId)?.direction === 'wave' && (
                                            <>
                                                <div>
                                                    <SelectInput
                                                        label="Number of Waves"
                                                        value={grooves.find(g => g.id === selectedGrooveId)?.numberOfWaves?.toString()}
                                                        onChange={(value) => handleGrooveChange('numberOfWaves', parseInt(value) as 1 | 2 | 3)}
                                                        options={[
                                                            { value: '1', label: '1 Wave' },
                                                            { value: '2', label: '2 Waves' },
                                                            { value: '3', label: '3 Waves' }
                                                        ]}
                                                        className="w-full"
                                                    />
                                                </div>
                                                <div>
                                                    <SelectInput
                                                        label="Wave Height"
                                                        value={grooves.find(g => g.id === selectedGrooveId)?.waveHeight?.toString()}
                                                        onChange={(value) => handleGrooveChange('waveHeight', parseInt(value))}
                                                        options={waveHeights.map(height => ({
                                                            value: height.toString(),
                                                            label: `${height}%`
                                                        }))}
                                                        className="w-full"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        <div className="col-span-2 p-4">
                                            <label className="block text-darkGray text-sm font-semibold mb-3">Position</label>
                                            <div className="flex items-center space-x-6">
                                                <div className="relative flex-1">
                                                    <input
                                                        type="range"
                                                        min="-5"
                                                        max="5"
                                                        step="0.1"
                                                        value={grooves.find(g => g.id === selectedGrooveId)?.position || 0}
                                                        onChange={(e) => handleGrooveChange('position', parseFloat(e.target.value))}
                                                        className="w-full h-2 bg-gray rounded-lg appearance-none cursor-pointer accent-primary hover:bg-gray-300 transition-colors"
                                                    />
                                                    <div className="flex justify-between text-primary text-xs text-gray-500 mt-1">
                                                        <span>-5mm</span>
                                                        <span>5mm</span>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-100 rounded-lg px-4 py-2">
                                                    <span className="text-sm font-medium text-darkGray">
                                                        {(grooves.find(g => g.id === selectedGrooveId)?.position || 0).toFixed(1)}mm
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-darkGray">{t('configurator.validation.selectGrooves')}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Edge Settings */}
            {activeTab === 'edges' && (
            <div className="space-y-8">
                <h3 className="text-darkGray text-xl font-medium">{t('configurator.groovesAndEdges.edgeSettings')}</h3>
                
                <EdgeSettingsForm
                    edge={groovesAndEdges.leftEdge}
                    onChange={(edge) => handleEdgeChange('leftEdge', edge)}
                    label={t('configurator.groovesAndEdges.leftEdge')}
                />

                <EdgeSettingsForm
                    edge={groovesAndEdges.rightEdge}
                    onChange={(edge) => handleEdgeChange('rightEdge', edge)}
                    label={t('configurator.groovesAndEdges.rightEdge')}
                />
            </div>
            )}
        </div>
    );
};
