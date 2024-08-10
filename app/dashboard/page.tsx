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
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          <h1>
            Drag and drop widgets from the right column to the dashboard area on
            the left.
          </h1>
          <p>Click on a widget to view it in full screen.
            Click the "Edit Widgets" button to enable/disable editing mode. In editing
            mode, you can move widgets around the dashboard area. You can also
            resize widgets and remove them.
          </p>
          <p>
            
          </p>
        </AlertDescription>
      </Alert>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
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
