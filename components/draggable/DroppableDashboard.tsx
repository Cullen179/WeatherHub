import { FC, useState, useEffect, MouseEvent, useRef } from 'react';
import { useDrop } from 'react-dnd';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import FullScreenModal from './FullScreenModal';
import TestChart from './TestChart';

// The dashboard component that will contain the draggable widgets

interface DroppableDashboardProps {
  isEditMode: boolean;
}

const DroppableDashboard: FC<DroppableDashboardProps> = ({ isEditMode }) => {
  const [widgets, setWidgets] = useState<
    { i: string; option: string; x: number; y: number; w: number; h: number }[]
  >([]);
  const [modalContent, setModalContent] = useState<string | null>(null); // The content to display in the modal
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [hoveredWidget, setHoveredWidget] = useState<string | null>(null);

  const [layoutWidth, setLayoutWidth] = useState<number>(800); // Default width
  const dashboardRef = useRef<HTMLDivElement | null>(null); // Reference to the dashboard element. Used to get the width of the dashboard

  // Drop zone, where the widgets can be dropped.
  // The drop zone will accept items of type 'widget'
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'widget',
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
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Open the modal with the full information for the widget
  const handleOpenModal = (option: string) => {
    if (!isEditMode) {
      setModalContent(option);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const handleRemoveWidget = (widgetId: string) => {
    setWidgets((prev) => prev.filter((widget) => widget.i !== widgetId));
    setHoveredWidget(null); // Clear hovered widget
  };

  // Handle layout change when a widget is moved or resized
  const handleLayoutChange = (layout: any[]) => {
    setWidgets((prev) =>
      layout.map((l) => ({
        ...prev.find((widget) => widget.i === l.i),
        x: l.x,
        y: l.y,
        w: l.w,
        h: l.h,
      }))
    );
  };

  // Calculate the layout based on the screen width
  const calculateLayout = () => {
    const screenWidth = layoutWidth;
    const cols = screenWidth < 768 ? 2 : screenWidth < 1200 ? 3 : 4; // Responsive breakpoints
    return widgets.map((widget) => ({
      i: widget.i,
      x: widget.x,
      y: widget.y,
      w: widget.w,
      h: widget.h,
    }));
  };

  // Update the layout width when the dashboard width changes, responsive
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target === dashboardRef.current) {
          setLayoutWidth(entry.contentRect.width);
        }
      }
    });

    if (dashboardRef.current) {
      resizeObserver.observe(dashboardRef.current);
    }

    return () => {
      if (dashboardRef.current) {
        resizeObserver.unobserve(dashboardRef.current);
      }
    };
  }, [dashboardRef.current]);

  const layout = calculateLayout();

  return (
    <div
      ref={(el) => {
        drop(el);
        dashboardRef.current = el;
      }}
      style={{
        minHeight: '500px',
        backgroundColor: isOver ? '#f0f0f0' : '#fff',
        padding: '10px',
        border: '1px solid #ddd',
        position: 'relative',
        overflow: 'hidden', // Ensure widgets stay within bounds
        // Optimize performance during dragging
        willChange: 'transform',
      }}
    >
      <GridLayout
        className="layout"
        layout={layout}
        cols={4} // The number of columns will adapt based on screen size
        rowHeight={100}
        width={layoutWidth}
        onLayoutChange={handleLayoutChange}
        isDraggable={isEditMode}
        isResizable={isEditMode}
        // Avoid unnecessary updates, for performance
        debounce={10}
      >
        {widgets.map((widget) => (
          <div
            key={widget.i}
            className="widget"
            style={{
              position: 'relative',
              padding: '10px',
              border: '1px solid #ddd',
              backgroundColor: '#f9f9f9',
              overflow: 'hidden',
              // Optimize performance during dragging
              willChange: 'opacity, transform',
            }}
            onClick={() => handleOpenModal(widget.option)}
            onMouseEnter={() => setHoveredWidget(widget.i)}
            onMouseLeave={() => setHoveredWidget(null)}
          >
            <button
              onClick={() => handleRemoveWidget(widget.i)}
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                background: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: hoveredWidget === widget.i ? 'block' : 'none',
                cursor: 'pointer',
                fontSize: '14px',
                textAlign: 'center',
                lineHeight: '20px',
                transition: 'opacity 0.2s ease',
              }}
            >
              × 
            </button> 
            <h2>{widget.option}</h2>
            <p>Content for {widget.option}...</p>
          </div>
        ))}
      </GridLayout>

      <FullScreenModal isOpen={isModalOpen} onClose={handleCloseModal}>
        {modalContent && (
          <div>
            <h1>{modalContent} Full Information</h1>
            <p>Details and charts for {modalContent}:</p>
            <TestChart />
          </div>
        )}
      </FullScreenModal>
    </div>
  );
};

export default DroppableDashboard;
