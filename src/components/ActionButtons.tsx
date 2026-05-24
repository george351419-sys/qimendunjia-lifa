/**
 * 操作按钮组件
 * 提供排盘相关的操作按钮
 * 包括显示长生状态、地盘八神、切换时辰等
 * 采用中国传统古风风格
 */
import React from 'react';
import { Clock, Clock2 } from 'lucide-react';

interface ActionButtonsProps {
  showChangSheng: boolean;
  showDiPanBaShen: boolean;
  onToggleChangSheng: () => void;
  onToggleDiPanBaShen: () => void;
  onPrevHour: () => void;
  onNextHour: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  showChangSheng,
  showDiPanBaShen,
  onToggleChangSheng,
  onToggleDiPanBaShen,
  onPrevHour,
  onNextHour,
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {/* 长生状态切换按钮 */}
      <button
        onClick={onToggleChangSheng}
        className={`type-btn ${showChangSheng ? 'active' : ''}`}
      >
        长生状态
      </button>
      
      {/* 地盘八神切换按钮 */}
      <button
        onClick={onToggleDiPanBaShen}
        className={`type-btn ${showDiPanBaShen ? 'active' : ''}`}
      >
        地盘八神
      </button>
      
      {/* 上一局按钮 */}
      <button
        onClick={onPrevHour}
        className="type-btn flex items-center gap-1"
      >
        <Clock className="w-4 h-4" />
        上一局
      </button>
      
      {/* 下一局按钮 */}
      <button
        onClick={onNextHour}
        className="type-btn flex items-center gap-1"
      >
        下一局
        <Clock2 className="w-4 h-4" />
      </button>
    </div>
  );
};
