'use client';

import { FC, useState, useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import WeatherWidget from './WeatherWidget';
import { useWeather } from '@/hooks/WeatherContext';
import { useUser } from '@clerk/nextjs';
import { WeatherInfo, WeatherInfoType } from '@/type/weatherInfo';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { SkeletonCard } from '@/components/SkeletonCard';
import { saveDashboardData } from '@/app/database/save';
import { fetchAccountData } from '@/app/database/fetch';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

interface DroppableDashboardProps {
  isEditMode: boolean;
  onWidgetAdd: (option: string) => void;
  onWidgetRemove: (option: string) => void;
  setAvailableOptions: (options: WeatherInfoType[]) => void;
}

const DroppableDashboard: FC<DroppableDashboardProps> = ({
  isEditMode,
  onWidgetAdd,
  onWidgetRemove,
  setAvailableOptions,
}) => {
  const [widgets, setWidgets] = useState<
    { i: string; option: string; x: number; y: number; w: number; h: number }[]
  >([]);
  const [layoutWidth, setLayoutWidth] = useState<number>(800);
  const [modalInfo, setModalInfo] = useState<{
    option: string;
  } | null>(null);
  const dashboardRef = useRef<HTMLDivElement | null>(null);
  const { weatherData, forecastData } = useWeather();
  const { user } = useUser();

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
          saveWidgetsToDatabase(newWidgets);
          onWidgetAdd(item.option);
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
      saveWidgetsToDatabase(newWidgets);
      onWidgetRemove(widgetId);
      return newWidgets;
    });
  };

  const handleLayoutChange = (layout: any[]) => {
    const updatedWidgets = layout.map((l) => ({
      ...widgets.find((widget) => widget.i === l.i),
      x: l.x,
      y: l.y,
      w: l.w,
      h: l.h,
    }));
    setWidgets(updatedWidgets);
    saveWidgetsToDatabase(updatedWidgets);
  };

  const saveWidgetsToDatabase = async (widgets: any[]) => {
    if (user) {
      await saveDashboardData(user.id, widgets);
    }
  };

  const handleWidgetClick = async (option: string) => {
    if (!isEditMode) {
      setModalInfo({ option });
    }
  };

  useEffect(() => {
    const fetchWidgets = async () => {
      if (user) {
        const accountData = await fetchAccountData(user.id);
        const fetchedWidgets = accountData.widgets || [];
        setWidgets(fetchedWidgets);
        const usedOptions = fetchedWidgets.map((widget: any) => widget.option);
        setAvailableOptions(
          WeatherInfo.filter((info) => !usedOptions.includes(info.type))
        );
      }
    };
    fetchWidgets();
  }, [user, setAvailableOptions]);

  useEffect(() => {
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

  const layout = Array.isArray(widgets)
    ? widgets.map((widget) => ({
        i: widget.i,
        x: widget.x,
        y: widget.y,
        w: widget.w,
        h: widget.h,
      }))
    : [];

  return (
    <div
      ref={(el) => {
        drop(el);
        dashboardRef.current = el;
      }}
      className={`relative min-h-[500px] bg-white p-2 border border-gray-300 overflow-auto max-h-screen ${
        isOver ? 'bg-gray-100' : ''
      }`}
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
            className={`relative bg-white ${
              isEditMode ? 'cursor-grab' : 'cursor-pointer'
            }`}
            onClick={() => handleWidgetClick(widget.option)}
          >
            {weatherData ? (
              <WeatherWidget
                option={widget.option}
                weatherData={weatherData}
                forecastData={forecastData}
              />
            ) : (
              <SkeletonCard />
            )}
            {isEditMode && (
              <Button variant={'ghost'} onMouseDown={e => e.stopPropagation()} onClick={() => handleRemoveWidget(widget.i)}
                className="absolute top-4 right-4">
                  <X />
              </Button>
            )}
          </div>
        ))}
      </GridLayout>

      {modalInfo && (
        <Dialog
          open={!!modalInfo}
          onOpenChange={() => setModalInfo(null)}
        >
          <DialogContent className="sm:max-w-[580px]">
            <DialogHeader>
              <DialogTitle>Widget Details</DialogTitle>
              <DialogDescription>
                {/* Optional description or title */}
              </DialogDescription>
            </DialogHeader>
            <WeatherWidget
              option={modalInfo.option}
              weatherData={weatherData}
              forecastData={forecastData}
              showDescription
              isModal
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DroppableDashboard;
