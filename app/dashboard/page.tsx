'use client';

import DraggableOptions from '../../components/draggable/DraggableOptions';
import DroppableDashboard from '../../components/draggable/DroppableDashboard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useState, useContext } from 'react';
import { WeatherContext } from '@/hooks/WeatherContext';
import { WeatherInfo } from '@/type/weatherInfo';
// styles
import './dashboard.css';

// Function to shorten weather info types
const getDisplayName = (type: string) => {
  const map: { [key: string]: string } = {
    'Probability of Precipitation': 'Precipitation',
    // Add more mappings if needed
  };
  return map[type] || type;
};

export default function DashboardPage() {
  const [isEditMode, setIsEditMode] = useState(false);
  const { weatherData } = useContext(WeatherContext);

  const handleToggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  const location = weatherData
    ? `${weatherData.name}, ${weatherData.sys.country}`
    : 'Loading...';
  const currentTime = new Date().toLocaleString();

  return (
    <DndProvider backend={HTML5Backend}>
      <Alert>
        <AlertTitle>Notes</AlertTitle>
        <AlertDescription>
          <ul>
            <li>
              Drag and drop widgets from the right column to the dashboard area
              on the left.
            </li>
            <li>Click on a widget: view it in full screen modal.</li>
            <li>
              Click edit widgets: enable/disable editing mode.
              <ul>
                <li>
                  In editing mode, you can move widgets around, resize widgets,
                  and remove them.
                </li>
                <li>In non-editing mode, you can only view the widgets.</li>
              </ul>
            </li>
            <li>
              The widgets and their layout are saved to local storage.
              Refreshing the page will restore the saved layout.
            </li>
          </ul>
        </AlertDescription>
      </Alert>

      <div style={{ padding: '10px', borderBottom: '1px solid #ddd',  }}>
        <p>
          <strong>Location:</strong> {location}
        </p>
        <p>
          <strong>Current Time:</strong> {currentTime}
        </p>
      </div>

      <div
        style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px',
            borderBottom: '1px solid #ddd',
            marginBottom: '10px',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 500 }}>
            Dashboard
          </h1>
          <Button
            variant="default"
            onClick={handleToggleEditMode}
            style={{
              background: isEditMode ? 'red' : 'blue',
              padding: '8px 16px',
              cursor: 'pointer',
            }}
          >
            {isEditMode ? 'Finish Editing' : 'Edit Layout'}
          </Button>
        </div>

        <div style={{ display: 'flex', gap: '20px', flex: 1 }}>
          {/* Droppable Dashboard Area */}
          <div style={{ flex: 1 }}>
            <DroppableDashboard isEditMode={isEditMode} />
          </div>

          {/* Draggable Options Column */}
          <div style={{ width: '200px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '10px', fontWeight: 'bold' }}>
              Chart List
            </h2>
            {WeatherInfo.map((info) => (
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
  );
}
