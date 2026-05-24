import React from 'react';
import { PalaceCell } from './PalaceCell';
import { QiMenResult, GRID_ORDER } from '../utils/qimen';

interface PanGridProps {
  result: QiMenResult;
  showChangSheng: boolean;
}

export const PanGrid: React.FC<PanGridProps> = ({ result, showChangSheng }) => {
  return (
    <div className="max-w-md mx-auto">
      <div className="grid grid-cols-3 gap-px bg-black border border-black">
        {GRID_ORDER.map((palaceNum) => (
          <PalaceCell
            key={palaceNum}
            palaceNum={palaceNum}
            result={result}
            showChangSheng={showChangSheng}
          />
        ))}
      </div>
    </div>
  );
};
