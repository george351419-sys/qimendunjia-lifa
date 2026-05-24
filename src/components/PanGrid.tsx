import React from 'react';
import { PalaceCell } from './PalaceCell';
import { QiMenResult, GRID_ORDER } from '../utils/qimen';
import { ItemType } from '../utils/analysis';

interface PanGridProps {
  result: QiMenResult;
  showChangSheng: boolean;
  itemType: ItemType;
}

export const PanGrid: React.FC<PanGridProps> = ({ result, showChangSheng, itemType }) => {
  return (
    <div className="max-w-md mx-auto">
      <div className="grid grid-cols-3 gap-px bg-black border border-black">
        {GRID_ORDER.map((palaceNum) => (
          <PalaceCell
            key={palaceNum}
            palaceNum={palaceNum}
            result={result}
            showChangSheng={showChangSheng}
            itemType={itemType}
          />
        ))}
      </div>
    </div>
  );
};
