import { FC } from 'react';
import { useDrag } from 'react-dnd';

const DraggableWidgets: FC<{ option: string; isEditing: boolean }> = ({
  option,
  isEditing,
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
      ref={isEditing ? drag : null}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: '10px',
        marginBottom: '10px',
        cursor: isEditing ? 'grab' : 'default',
      }}
    >
      {children}
    </div>
  );
};

export default DraggableWidgets;
