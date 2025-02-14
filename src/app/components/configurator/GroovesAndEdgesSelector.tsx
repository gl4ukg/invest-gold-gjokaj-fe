import React from 'react';
import { useTranslations } from 'next-intl';
import { GroovesAndEdges, GrooveType, EdgeType, GrooveAlignment, SurfaceType, EdgeSettings } from '@/app/types/configurator';
import { RiLineHeight, RiRoundedCorner } from 'react-icons/ri';
import { SelectInput } from '@/app/components/ui/SelectInput';

interface GroovesAndEdgesSelectorProps {
    groovesAndEdges: GroovesAndEdges;
    onUpdateGroovesAndEdges: (settings: GroovesAndEdges) => void;
}

const grooveTypes: GrooveType[] = [
    'V-groove (110°)',
    'U-groove',
    'Convex',
    'Square groove',
    'Carbon-groove',
    'Milgrain',
];

const edgeTypes: EdgeType[] = ['none', 'step', 'carbon', 'milgrain'];
const alignments: GrooveAlignment[] = ['left', 'center', 'right'];
const surfaceTypes: SurfaceType[] = ['Polished', 'Sandblasted'];

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
                                onChange({
                                    type,
                                    ...(type !== 'none' && {
                                        width: edge.width || 0.45,
                                        depth: edge.depth || 0.10,
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
                    <SelectInput
                        label={t('configurator.groovesAndEdges.width')}
                        value={edge?.width?.toFixed(2)}
                        onChange={(value) => onChange({ ...edge, width: parseFloat(value) })}
                        options={[
                            { value: '0.30', label: '0.30 mm' },
                            { value: '0.50', label: '0.50 mm' },
                            { value: '1.00', label: '1.00 mm' },
                            { value: '1.50', label: '1.50 mm' },
                            { value: '2.00', label: '2.00 mm' },
                            { value: '2.50', label: '2.50 mm' }
                        ]}
                        className="w-full"
                    />
                </div>

                <div>
                    <SelectInput
                        label={t('configurator.groovesAndEdges.depth')}
                        value={edge?.depth?.toFixed(2)}
                        onChange={(value) => onChange({ ...edge, depth: parseFloat(value) })}
                        options={[
                            { value: '0.30', label: '0.30 mm' }
                        ]}
                        className="w-full"
                    />
                </div>

                <div>
                    <SelectInput
                        label={t('configurator.groovesAndEdges.surface')}
                        value={edge.surface}
                        onChange={(value) => onChange({ ...edge, surface: value as SurfaceType })}
                        options={[
                            { value: 'Polished', label: 'Polished' }
                        ]}
                        className="w-full"
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
    const t = useTranslations();
    const handleGrooveChange = <T extends keyof GroovesAndEdges['groove']>(
        field: T,
        value: GroovesAndEdges['groove'][T]
    ) => {
        onUpdateGroovesAndEdges({
            ...groovesAndEdges,
            groove: {
                ...groovesAndEdges.groove,
                [field]: value,
            },
        });
    };

    const handleEdgeChange = (side: 'leftEdge' | 'rightEdge', edge: EdgeSettings) => {
        onUpdateGroovesAndEdges({
            ...groovesAndEdges,
            [side]: edge,
        });
    };

    const [activeTab, setActiveTab] = React.useState<'grooves' | 'edges'>('grooves');

    return (
        <div className="space-y-8">
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
                <h3 className="text-darkGray text-xl font-medium">{t('configurator.groovesAndEdges.grooveSettings')}</h3>
                
                <div>
                    <label className="block text-darkGray text-sm font-medium mb-2">{t('configurator.groovesAndEdges.grooveType')}</label>
                    <div className="grid grid-cols-6 gap-4">
                        {grooveTypes?.map((type) => (
                            <button
                                key={type}
                                onClick={() => handleGrooveChange('grooveType', type)}
                                className={`p-4 border rounded-lg ${
                                    groovesAndEdges.groove.grooveType === type
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
                                    <p className="text-sm text-center text-darkGray font-medium line-clamp-2">{type}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <SelectInput
                            label={t('configurator.groovesAndEdges.width')}
                            value={groovesAndEdges.groove.width.toFixed(2)}
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
                            value={groovesAndEdges.groove.depth.toFixed(2)}
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
                            value={groovesAndEdges.groove.surface}
                            onChange={(value) => handleGrooveChange('surface', value as SurfaceType)}
                            options={surfaceTypes.map(type => ({
                                value: type,
                                label: type,
                            }))}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-darkGray text-sm font-medium mb-2">{t('configurator.groovesAndEdges.grooveAlignment')}</label>
                        <select
                            value={groovesAndEdges.groove.alignment}
                            onChange={(e) => handleGrooveChange('alignment', e.target.value as GrooveAlignment)}
                            className="w-full p-2 border border-darkGray text-darkGray rounded-lg"
                        >
                            {alignments?.map((alignment) => (
                                <option key={alignment} value={alignment}>
                                    {alignment.charAt(0).toUpperCase() + alignment.slice(1)}
                                </option>
                            ))}
                        </select>
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
