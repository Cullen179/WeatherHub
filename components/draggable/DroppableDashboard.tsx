'use client';

import { FC, useState, useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import WeatherWidget from './WeatherWidget';
import { useWeather } from '@/hooks/WeatherContext';
import { saveDashboardData } from '@/app/database/fetch';
import { useUser } from '@clerk/nextjs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { db } from '@/firebase'; // Import the initialized Firestore instance

interface DroppableDashboardProps {
  isEditMode: boolean;
}

const DroppableDashboard: FC<DroppableDashboardProps> = ({ isEditMode }) => {
  const [widgets, setWidgets] = useState<
    { i: string; option: string; x: number; y: number; w: number; h: number }[]
  >([]);
  const [hoveredWidget, setHoveredWidget] = useState<string | null>(null);
  const [layoutWidth, setLayoutWidth] = useState<number>(800);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null);
  const [isModalAnimating, setIsModalAnimating] = useState(false);

  const dashboardRef = useRef<HTMLDivElement | null>(null);
  const { weatherData, forecastData } = useWeather();
  const { user } = useUser(); // Use useUser to get the current user

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'widget',
    drop: async (item: { option: string }, monitor) => {
      const offset = monitor.getClientOffset();
      const dashboardRect = dashboardRef.current?.getBoundingClientRect();
      if (offset && dashboardRect) {
        const x = offset.x - dashboardRect.left;
        const y = offset.y - dashboardRect.top;
        setWidgets((prev) => {
          const newWidgets = [
            ...prev,
            {
              i: item.option,
              option: item.option,
              x: Math.floor(x / 150),
              y: Math.floor(y / 150),
              w: 3,
              h: 2.35,
            },
          ];
          // Save widgets to local storage
          localStorage.setItem('widgets', JSON.stringify(newWidgets));
          // Save widgets to Firebase
          saveWidgetsToDatabase(newWidgets);
          return newWidgets;
        });
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleRemoveWidget = (widgetId: string) => {
    setWidgets((prev) => {
      const newWidgets = prev.filter((widget) => widget.i !== widgetId);
      localStorage.setItem('widgets', JSON.stringify(newWidgets));
      saveWidgetsToDatabase(newWidgets);
      return newWidgets;
    });
    setHoveredWidget(null);
  };

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
    localStorage.setItem('layout', JSON.stringify(layout));
    saveWidgetsToDatabase(widgets); // Save widgets with updated layout
  };

  const handleOpenModal = (widget: any) => {
    setModalContent(widget);
    setIsModalOpen(true);
    setIsModalAnimating(true);
  };

  const handleCloseModal = () => {
    setIsModalAnimating(false);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 300); // Match the duration of the CSS transition
  };

  const saveWidgetsToDatabase = async (widgets: any[]) => {
    if (user) {
      await saveDashboardData(user.id, widgets);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.id, 'dashboards', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const savedData = docSnap.data();
          setWidgets(savedData.widgets || []);
        }
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const savedWidgets = localStorage.getItem('widgets');
    const savedLayout = localStorage.getItem('layout');

    if (savedWidgets) {
      const widgetsFromStorage = JSON.parse(savedWidgets);
      setWidgets(widgetsFromStorage);
    }

    if (savedLayout) {
      const layoutFromStorage = JSON.parse(savedLayout);
      setWidgets((prev) =>
        prev.map((widget) => {
          const layoutItem = layoutFromStorage.find(
            (l: any) => l.i === widget.i
          );
          return layoutItem ? { ...widget, ...layoutItem } : widget;
        })
      );
    }

    const resizeObserver = new ResizeObserver((entries) => {
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
  }, []);

  const layout = widgets.map((widget) => ({
    i: widget.i,
    x: widget.x,
    y: widget.y,
    w: widget.w,
    h: widget.h,
  }));

  return (
    <>
      {isModalOpen && (
        <div
          className={`modal-backdrop ${isModalAnimating ? 'visible' : 'hidden'}`}
          onClick={handleCloseModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent black
            zIndex: 1000,
          }}
        />
      )}

      {isModalOpen && (
        <div
          className={`modal ${isModalAnimating ? '' : 'hidden'}`}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1001,
            maxWidth: '80%',
            backgroundColor: 'white',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
          }}
        >
          <div>
            <button onClick={handleCloseModal} style={
              { position: 'absolute', top: '10px', right: '10px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.8rem' }
            }>x</button>
            {modalContent && (
              <WeatherWidget
                option={modalContent.option}
                weatherData={weatherData}
                forecastData={forecastData}
                showDescription={true}
              />
            )}
          </div>
        </div>
      )}

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
          overflow: 'auto',
          maxHeight: '100vh',
        }}
      >
        <GridLayout
          className="layout"
          layout={layout}
          cols={6}
          rowHeight={140}
          width={layoutWidth}
          onLayoutChange={handleLayoutChange}
          isDraggable={isEditMode}
          isResizable={isEditMode}
        >
          {widgets.map((widget) => (
            <div
              key={widget.i}
              className={`widget ${!isEditMode ? 'clickable' : ''}`}
              onMouseEnter={() => setHoveredWidget(widget.i)}
              onMouseLeave={() => setHoveredWidget(null)}
              style={{
                position: 'relative',
                cursor: !isEditMode ? 'pointer' : 'grab',
                fontSize: '0.8rem',
                backgroundColor: 'white',
              }}
              onClick={() =>  !isEditMode && handleOpenModal(widget)}
            >
              <WeatherWidget
                option={widget.option}
                weatherData={weatherData}
                forecastData={forecastData}
              />
              {isEditMode && (
                <button
                  onClick={() => handleRemoveWidget(widget.i)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '1rem',
                  }}
                >
                  x
                </button>
              )}
            </div>
          ))}
        </GridLayout>
      </div>
    </>
  );
};

export default DroppableDashboard;
