import { FC, useState } from 'react';
import { useDrop } from 'react-dnd';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import FullScreenModal from './FullScreenModal';
import TestChart from './TestChart';

const DroppableDashboard: FC = () => {
  const [widgets, setWidgets] = useState<
    { i: string; option: string; x: number; y: number; w: number; h: number }[]
  >([]); // Widgets state, each widget has an id, option, x, y, w, and h (size)
  const [modalContent, setModalContent] = useState<string | null>(null); // Modal content state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
  const [isEditMode, setIsEditMode] = useState(false); // Edit mode state

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'widget',
    // Drop handler
    drop: (item: { option: string }) => {
      setWidgets((prev) => [
        ...prev,
        {
          i: item.option,
          option: item.option,
          x: prev.length % 4,
          y: Math.floor(prev.length / 4),
          w: 1,
          h: 1,
        },
      ]);
    },
    // Collect handler
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleOpenModal = (option: string) => {
    // Open modal only if not in edit mode
    if (!isEditMode) {
      setModalContent(option);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    // Close modal
    setIsModalOpen(false);
    setModalContent(null);
  };

  const handleToggleEditMode = () => {
    setIsEditMode((prev) => !prev); // Toggle edit mode
  };

  const handleRemoveWidget = (widgetId: string) => {
    setWidgets((prev) => prev.filter((widget) => widget.i !== widgetId)); // Remove widget
  };

  const layout = widgets.map((widget, index) => ({
    // Map widgets to layout
    i: widget.i,
    x: widget.x,
    y: widget.y,
    w: widget.w,
    h: widget.h,
  }));

  return (
    <>
      <button
        onClick={handleToggleEditMode}
        style={{
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          outline: 'none',
          fontSize: '16px',
          fontWeight: 'bold',
          float: 'right',
        }}
      >
        {isEditMode ? 'Finish Editing' : 'Edit Widgets'}
      </button>

      <div
        ref={drop}
        style={{
          minHeight: '500px',
          backgroundColor: isOver ? '#f0f0f0' : '#fff',
          padding: '10px',
          border: '1px solid #ddd',
        }} // Droppable area
      >
        <GridLayout
          className="layout"
          layout={layout}
          cols={4}
          rowHeight={100}
          width={800}
          onLayoutChange={(layout) =>
            setWidgets((prev) =>
              layout.map((l, index) => ({
                ...prev[index],
                x: l.x,
                y: l.y,
                w: l.w,
                h: l.h,
              }))
            )
          } // Update widget positions on layout change
          isDraggable={isEditMode} // Conditionally enable dragging
          isResizable={isEditMode} // Conditionally enable resizing
        >
          {widgets.map((widget) => (
            <div
              key={widget.i}
              className="widget"
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                backgroundColor: '#f9f9f9',
              }} // Widget component
              onClick={() => handleOpenModal(widget.option)}
            >
              <h2>{widget.option}</h2>
              <p>Content for {widget.option}...</p>
              {isEditMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the widget click event
                    handleRemoveWidget(widget.i);
                  }}
                  style={{ marginTop: '10px' }} // Remove widget button
                >
                  Remove Widget
                </button>
              )}
            </div>
          ))}
        </GridLayout>
      </div>

      <FullScreenModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      >
        {modalContent && (
          <div>
            <h1>{modalContent} Full Information</h1>
            <p>Details and charts for {modalContent}:</p>
            <TestChart />
          </div>
        )}
      </FullScreenModal>
    </>
    // Full screen modal with chart, replace with actual chart component
  );
};

export default DroppableDashboard;
