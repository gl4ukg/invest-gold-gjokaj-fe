import React from 'react';
import Image from 'next/image';

interface SelectInputOption {
    value: string;
    label: string;
    image?: string;
}

interface SelectInputProps {
    options: SelectInputOption[];
    value?: string;
    onChange: (value: string) => void;
    label?: string;
    className?: string;
    imageClassName?: string;
    disabled?: boolean;
}

export const SelectInput: React.FC<SelectInputProps> = ({
    options,
    value,
    onChange,
    label,
    className = '',
    imageClassName = '',
    disabled = false
}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(option => option.value === value);

    return (
        <div className="relative" ref={dropdownRef}>
            {label && (
                <label className="block text-darkGray text-sm font-medium mb-2">
                    {label}
                </label>
            )}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full p-2 flex items-center gap-1 md:gap-3 border rounded-lg transition-all duration-200 
                    ${isOpen && !disabled ? 'ring-2 ring-primary/20' : ''} 
                    ${disabled ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed' : 'border-darkGray hover:bg-gray-50 text-darkGray cursor-pointer'} 
                    ${className}`}
            >
                {selectedOption?.image && (
                    <div className={`flex-shrink-0 ${imageClassName}`}>
                        <Image
                            src={selectedOption.image}
                            alt={selectedOption.label}
                            width={24}
                            height={24}
                            className="w-7 h-7 object-cover"
                        />
                    </div>
                )}
                <span className="flex-1 text-left text-xs sm:text-sm md:text-base lg:text-base xl:text-base">{selectedOption?.label}</span>
                <svg
                    className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''} ${disabled ? 'opacity-50' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    <div className="p-1">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`w-full p-2 flex items-center gap-3 hover:bg-primary/5 rounded-md transition-all duration-200 ${
                                option.value === value ? 'bg-primary/10 text-primary font-medium' : 'text-darkGray'
                            }`}
                        >
                            {option.image && (
                                <div className={`flex-shrink-0 ${imageClassName}`}>
                                    <Image
                                        src={option.image}
                                        alt={option.label}
                                        width={24}
                                        height={24}
                                        className="w-7 h-7 object-cover"
                                    />
                                </div>
                            )}
                            <span className="flex-1 text-left text-xs sm:text-sm md:text-base lg:text-base xl:text-base">{option.label}</span>
                        </button>
                    ))}
                    </div>
                </div>
            )}
        </div>
    );
};
