import React from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Slider } from '../ui/slider';

interface YearFilterProps {
  yearRange: [number, number];
  onYearRangeChange: (range: [number, number]) => void;
  minYear?: number;
  maxYear?: number;
  showResetButton?: boolean;
  className?: string;
}

export function YearFilter({ 
  yearRange, 
  onYearRangeChange,
  minYear = 2015,
  maxYear = 2025,
  showResetButton = true,
  className
}: YearFilterProps) {
  const handleSliderChange = (values: number[]) => {
    if (values.length === 2) {
      onYearRangeChange([values[0], values[1]]);
    }
  };

  return (
    <Card className={`transition-shadow hover:shadow-md ${className || ''}`}>
      <CardContent className="p-4 md:p-6">
        <h3 className="mb-4 flex items-center gap-2" style={{ color: '#215285' }}>
          <Calendar className="h-5 w-5" style={{ color: '#4FA3D1' }} />
          출판 연도
        </h3>
        
        <div className="space-y-4">
          {/* 선택된 연도 범위 표시 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="px-3 py-1.5 rounded-md text-sm"
                style={{ backgroundColor: '#EAF4FA', color: '#215285' }}
              >
                {yearRange[0]}년
              </div>
              <span className="text-gray-400">~</span>
              <div 
                className="px-3 py-1.5 rounded-md text-sm"
                style={{ backgroundColor: '#EAF4FA', color: '#215285' }}
              >
                {yearRange[1]}년
              </div>
            </div>
          </div>

          {/* 슬라이더 */}
          <div className="px-2 py-2">
            <Slider
              min={minYear}
              max={maxYear}
              step={1}
              value={yearRange}
              onValueChange={handleSliderChange}
              className="w-full"
              style={{
                '--slider-track-bg': '#e5e7eb',
                '--slider-range-bg': '#4FA3D1',
                '--slider-thumb-bg': '#4FA3D1',
              } as React.CSSProperties}
            />
          </div>

          {/* 전체 범위 표시 */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>{minYear}</span>
            <span>{maxYear}</span>
          </div>

          {/* 초기화 버튼 */}
          {showResetButton && (yearRange[0] !== minYear || yearRange[1] !== maxYear) && (
            <button
              onClick={() => onYearRangeChange([minYear, maxYear])}
              className="w-full text-sm text-gray-500 hover:text-[#4FA3D1] transition-colors underline"
            >
              초기화
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
