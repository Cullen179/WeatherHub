import { FC, LegacyRef } from 'react';
import { useDrag } from 'react-dnd';

const DraggableWidgets: FC<{ option: string; isEditing: boolean, children: React.ReactNode }> = ({
  option,
  isEditing,
  children,
}) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'widget',
      item: { option },
      canDrag: isEditing,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [isEditing]
  );

  return (
      <div
        ref={isEditing ? drag as any: null}
        className={`mb-2 p-2 ${isDragging ? 'opacity-50' : 'opacity-100'} ${
          isEditing ? 'cursor-grab' : 'cursor-default'
        }`}
      >
        {children}
      </div>
    );
};

export default DraggableWidgets;
