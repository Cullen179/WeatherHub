'use client';
import DraggableOptions from '../../components/draggable/DraggableOptions';
import DroppableDashboard from '../../components/draggable/DroppableDashboard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function DashboardPage() {
  // Draggable Options Column
  const options = [
    'Temperature',
    'Humidity',
    'Wind Speed',
    'Pressure',
    'Precipitation',
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Droppable Dashboard Area */}
          <div style={{ flex: 1 }}>
            <DroppableDashboard />
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
