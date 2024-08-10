'use client';
import DraggableOptions from '../../components/draggable/DraggableOptions';
import DroppableDashboard from '../../components/draggable/DroppableDashboard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function DashboardPage() {
  // Draggable Options Column
  const options = [
    'Temperature',
    'Humidity',
    'Wind Speed',
    'Pressure',
    'Precipitation',
  ];

  const [isEditMode, setIsEditMode] = useState(false);

  const handleToggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

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
            <li>Layout is still ugly.</li>
            <li>
              No actual data is displayed in the widgets. Replace the static
              data with real data from an API.
            </li>
          </ul>
        </AlertDescription>
      </Alert>

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
            Your Weather Dashboard
          </h1>
          <Button
            variant="outline"
            onClick={handleToggleEditMode}
            style={{
              color: isEditMode ? '#dc3545' : '#007bff',
              borderColor: isEditMode ? '#dc3545' : '#007bff',
              padding: '8px 16px',
              cursor: 'pointer',
              zIndex: 100,
            }}
          >
            {isEditMode ? 'Finish Editing' : 'Edit Widgets'}
          </Button>
        </div>

        <div style={{ display: 'flex', gap: '20px', flex: 1 }}>
          {/* Droppable Dashboard Area */}
          <div style={{ flex: 1 }}>
            <DroppableDashboard isEditMode={isEditMode} />
          </div>

          {/* Draggable Options Column */}
          <div style={{ width: '200px' }}>
            {options.map((option) => (
              <DraggableOptions
                key={option}
                option={option}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
