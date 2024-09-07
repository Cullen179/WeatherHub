'use client';

import DraggableOptions from '@/components/draggable/DraggableOptions';
import DroppableDashboard from '@/components/draggable/DroppableDashboard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/button';
import { useState, useCallback } from 'react';
import { WeatherInfo, WeatherInfoType } from '@/type/weatherInfo';
import Forecast from './Forecast';
import './dashboard.css';
import { Typography } from '@/components/Typography';

// Function to shorten weather info types
const getDisplayName = (type: string) => {
  const map: { [key: string]: string } = {
    'Probability of Precipitation': 'Precipitation',
    // Add more mappings if needed
  };
  return map[type] || type;
};

export default function Home() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [availableOptions, setAvailableOptions] = useState(WeatherInfo);
  const [widgetList, setWidgetList] = useState<string[]>([]);

  const handleToggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  const updateAvailableOptions = useCallback(
    (newOptions: WeatherInfoType[]) => {
      setAvailableOptions(newOptions);
    },
    []
  );

  const handleWidgetAdd = useCallback((option: string) => {
    setAvailableOptions((prev) => prev.filter((opt) => opt.type !== option));
    setWidgetList((prev) => [...prev, option]);
  }, []);

  const handleWidgetRemove = useCallback((option: string) => {
    setAvailableOptions((prev) => [
      ...prev,
      WeatherInfo.find((info) => info.type === option)!,
    ]);
    setWidgetList((prev) => prev.filter((opt) => opt !== option));
  }, []);

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <Forecast />

        <div className="flex flex-col h-screen mt-5">
          <div className="flex items-center justify-between p-2 mb-2">
            <Typography variant="h2">Dashboard</Typography>

            <Button
              variant={isEditMode ? 'secondary' : 'default'}
              onClick={handleToggleEditMode}
            >
              {isEditMode ? 'Save Layout' : 'Edit Layout'}
            </Button>
          </div>

          <div className="flex gap-5 flex-1">
            {/* Droppable Dashboard Area */}
            <div className="flex-1">
              <DroppableDashboard
                isEditMode={isEditMode}
                onWidgetAdd={handleWidgetAdd}
                onWidgetRemove={handleWidgetRemove}
                setAvailableOptions={updateAvailableOptions}
              />
            </div>

            {/* Draggable Options Column */}
            <div className="w-48 space-y-2">
              <Typography variant="h3">Chart List</Typography>
              {availableOptions.map((info) => (
                <DraggableOptions
                  key={info.type}
                  option={info.type}
                  displayName={getDisplayName(info.type)}
                />
              ))}
            </div>
          </div>
        </div>
      </DndProvider>
    </div>
  );
}
