import React from 'react';
import { PalaceCell } from './PalaceCell';
import { QiMenResult, GRID_ORDER } from '../utils/qimen';
import { ItemType } from '../utils/analysis';
import { FactorWeights } from '../utils/scoring';

interface PanGridProps {
  result: QiMenResult;
  showChangSheng: boolean;
  showGeJu: boolean;
  itemType: ItemType;
  scoreWeights?: FactorWeights;
  diLiRatio?: { palace: number; month: number };
}

export const PanGrid: React.FC<PanGridProps> = ({ result, showChangSheng, showGeJu, itemType, scoreWeights, diLiRatio }) => {
  return (
    <div className="max-w-md mx-auto">
      <div className="grid grid-cols-3 gap-px bg-black border border-black">
        {GRID_ORDER.map((palaceNum) => (
          <PalaceCell
            key={palaceNum}
            palaceNum={palaceNum}
            result={result}
            showChangSheng={showChangSheng}
            showGeJu={showGeJu}
            itemType={itemType}
            scoreWeights={scoreWeights}
            diLiRatio={diLiRatio}
          />
        ))}
      </div>
    </div>
  );
};
