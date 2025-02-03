import React from 'react';
import { Profile } from '@/app/types/configurator';
import { profileSvg } from './profileSvgs';

interface ProfileSelectorProps {
    selectedProfile: string | null;
    onSelectProfile: (profileId: string) => void;
}

const profiles: Profile[] = Array.from({ length: 19 }, (_, i) => ({
    id: `${i + 1}`,
    name: `PR ${i + 1}`,
})).filter((_, i) => i !== 15 && i !== 17);

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({
    selectedProfile,
    onSelectProfile,
}) => {
    return (
        <div className="grid grid-cols-4 gap-4">
            {profiles?.map((profile) => (
                <button
                    key={profile.id}
                    onClick={() => onSelectProfile(profile.id)}
                    className={`p-3 border rounded-lg ${
                        selectedProfile === profile.id
                            ? 'border-primary bg-primary/10'
                            : 'border-darkGray'
                    }`}
                >
                    <div className="aspect-square bg-gray-100 rounded-lg mb-2">
                        <div 
                            className="w-full h-full flex items-center justify-center text-darkGray bg-[url('/images/profile.svg')] bg-no-repeat bg-bottom">
                            {profileSvg[profile.id]}
                        </div>
                    </div>
                    <p className="text-sm text-darkGray text-center">{profile.name}</p>
                </button>
            ))}
        </div>
    );
};
