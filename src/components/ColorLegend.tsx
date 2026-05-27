/**
 * 颜色图例组件
 * 展示排盘中各种特殊状态的颜色标识说明
 * 采用中国传统古风风格
 */
import React from 'react';

export const ColorLegend: React.FC = () => {
  // 图例数据：颜色和对应含义
  const legends = [
    { color: '#00b4d8', label: '符使' },    // 值符/值使 - 青色
    { color: '#8a5a00', label: '入墓' },    // 入墓 - 高对比土黄色
    { color: '#a855f7', label: '击刑' },    // 击刑 - 紫色
    { color: '#dc2626', label: '门破' },    // 门破 - 鲜红色
    { color: '#3b82f6', label: '刑+墓' },   // 刑+墓 - 蓝色
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {legends.map((item) => (
        <div key={item.label} className="legend-item">
          <span 
            className="legend-dot" 
            style={{ background: item.color }}
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};
