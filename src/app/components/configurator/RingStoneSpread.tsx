import React, { useState } from 'react';
import { SelectInput } from '../ui/SelectInput';

interface Stone {
  id: number;
  size: string;
  quality: string;
  x: number;
  y: number;
  isActive: boolean;
}

interface RingStoneSpreadProps {
  onUpdateStones: (stones: Stone[]) => void;
}

const stoneSizes = [
  '0.004 ct.',
  '0.005 ct.',
  '0.0065 ct.',
  '0.0085 ct.',
  '0.01 ct.',
  '0.013 ct.',
  '0.015 ct.',
  '0.018 ct.',
  '0.02 ct.',
  '0.025 ct.',
  '0.03 ct.',
  '0.035 ct.',
  // '0.04 ct.',
  // '0.05 ct.',
  // '0.08 ct.',
  // '0.1 ct.',
  // '0.13 ct.'
];

const stoneQualities = [
  'zirconia',
  'G-H/VS-SI',
  'I-J/VS-SI',
  'Black Diamond - VS/SI'
];

// Convert carat size to visual size in pixels
const getVisualStoneSize = (caratSize: string): number => {
  // Extract the numeric value from the carat string
  const caratValue = parseFloat(caratSize.replace(' ct.', ''));
  
  // Define the mapping for known sizes
  if (caratValue === 0.004) return 14.4;
  if (caratValue === 0.035) return 32;
  
  // For sizes in between, calculate proportionally
  // Using linear interpolation between 0.004 (14.4px) and 0.035 (32px)
  const minCarat = 0.004;
  const maxCarat = 0.035;
  const minSize = 14.4;
  const maxSize = 32;
  
  // Linear interpolation formula
  return minSize + ((caratValue - minCarat) * (maxSize - minSize)) / (maxCarat - minCarat);
};

// Calculate Y position with fixed 1.68mm gaps between stone edges
const getStoneYPosition = (stoneIndex: number, stones: Stone[], newStoneSize: string): number => {
  const GAP = 1.68; // Fixed gap in mm between stone edges
  
  if (stoneIndex === 0) return 0;
  
  // Convert stone sizes from pixels to mm
  const getCurrentStoneSize = (size: string) => getVisualStoneSize(size) / 10;
  
  // Get the size of the new stone
  const currentStoneSize = getCurrentStoneSize(newStoneSize);
  
  if (stoneIndex === 1) {
    // First stone after center - position up
    const centerStoneSize = getCurrentStoneSize(stones[0].size);
    return -(centerStoneSize/2 + GAP + currentStoneSize/2);
  }
  
  // Get reference stone (the one we're positioning relative to)
  const referenceIndex = stoneIndex - 2;
  const referenceStone = stones[referenceIndex];
  const referenceStoneSize = getCurrentStoneSize(referenceStone.size);
  
  // Calculate position based on reference stone
  const direction = stoneIndex % 2 === 0 ? 1 : -1; // Even goes down, odd goes up
  const referencePosition = referenceStone.y;
  const gapToAdd = direction * (referenceStoneSize/2 + GAP + currentStoneSize/2);
  
  return referencePosition + gapToAdd;
};

export const RingStoneSpread: React.FC<RingStoneSpreadProps> = ({ onUpdateStones }) => {
  const [stones, setStones] = useState<Stone[]>([]);
  const [selectedSize, setSelectedSize] = useState(stoneSizes[0]);
  const [selectedQuality, setSelectedQuality] = useState(stoneQualities[0]);

  const addStone = () => {
    const newStone: Stone = {
      id: Date.now(),
      size: selectedSize,
      quality: selectedQuality,
      x: 0,
      y: getStoneYPosition(stones.length, stones, selectedSize),
      isActive: false
    };

    const updatedStones = [...stones, newStone];
    setStones(updatedStones);
    onUpdateStones(updatedStones);
  };

  const updateStonePosition = (id: number, axis: 'x' | 'y', value: number) => {
    const updatedStones = stones.map(stone => 
      stone.id === id ? { ...stone, [axis]: value } : stone
    );
    setStones(updatedStones);
    onUpdateStones(updatedStones);
  };

  const deleteStone = (id: number) => {
    const updatedStones = stones.filter(stone => stone.id !== id);
    setStones(updatedStones);
    onUpdateStones(updatedStones);
  };

  const deleteAllStones = () => {
    setStones([]);
    onUpdateStones([]);
  };

  return (
    <div className="grid grid-cols-[100px_1fr] gap-8">
      {/* Left side - Ring Preview */}
      <div className="relative w-[80px] h-[400px] bg-yellow-100 rounded-lg">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70px] h-[400px]">
          {/* Vertical guide line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px border-l border-[#777] border-dashed" />
          
          {/* Degree markers */}
          <div className="absolute left-0 text-[#777] -translate-x-1/2 top-4">315°</div>
          <div className="absolute left-0 text-[#777] -translate-x-1/2 top-[47.5%]">0°</div>
          <div className="absolute left-0 text-[#777] -translate-x-1/2 bottom-4">45°</div>

          {/* Stones */}
          {stones.map((stone) => {
            const visualSize = getVisualStoneSize(stone.size);
            return (
              <div
                key={stone.id}
                className={`absolute border border-1 ${stone.isActive ? 'bg-primary' : 'bg-white'} rounded-full transform -translate-x-1/2 -translate-y-1/2`}
                style={{
                  left: `calc(50% + ${stone.x}mm)`,
                  top: `calc(50% + ${stone.y * 2.5}mm)`,
                  width: `${visualSize}px`,
                  height: `${visualSize}px`
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Right side - Controls */}
      <div className="space-y-6">
        {/* Stone controls */}
        <div className="space-y-4">
          <SelectInput
            label="Stone Size"
            value={selectedSize}
            onChange={(value) => setSelectedSize(value)}
            options={stoneSizes.map(size => ({ value: size, label: size }))}
          />
          <SelectInput
            label="Stone Quality"
            value={selectedQuality}
            onChange={(value) => setSelectedQuality(value)}
            options={stoneQualities.map(quality => ({ value: quality, label: quality }))}
          />
          <button
            onClick={addStone}
            className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Add Stone
          </button>
        </div>

        {/* Stones table */}
        {stones.length > 0 && (
          <div className="space-y-4">
            <table className="w-full">
              <thead>
                <tr>
                  <th className='text-left text-primary'>Size</th>
                  <th className='text-left text-primary'>X-Pos.</th>
                  <th className='text-left text-primary'>Y-Pos.</th>
                  <th className='text-left text-primary'>Delete</th>
                </tr>
              </thead>
              <tbody>
                {stones.map((stone) => (
                  <tr 
                    className={stone.isActive ? 'bg-primary/10' : 'bg-white'}
                    onMouseEnter={() => setStones(prev => 
                      prev.map(s => ({ ...s, isActive: s.id === stone.id }))
                    )} 
                    onMouseLeave={() => setStones(prev => 
                      prev.map(s => ({ ...s, isActive: false }))
                    )} 
                    key={stone.id}>
                    <td className='text-primary'>{stone.size}</td>
                    <td className='text-primary text-sm'>
                      <input
                        type="number"
                        value={stone.x}
                        onChange={(e) => updateStonePosition(stone.id, 'x', parseFloat(e.target.value))}
                        step="0.01"
                        className="w-20 px-2 py-1 border rounded me-1"
                      />
                      mm
                    </td>
                    <td className='text-primary text-sm'>
                      <input
                        type="number"
                        value={stone.y}
                        onChange={(e) => updateStonePosition(stone.id, 'y', parseFloat(e.target.value))}
                        step="0.01"
                        className="w-20 px-2 py-1 border rounded me-1"
                      />
                      mm
                    </td>
                    <td className='text-primary'>
                      <button
                        onClick={() => deleteStone(stone.id)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={deleteAllStones}
              className="flex border border-1 border-red p-2 rounded-lg items-center space-x-2 text-red-500 hover:text-red-700"
            >
              <span className='pe-2'>Delete all</span> 🗑️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
