import { FC } from 'react';
import { useDrag } from 'react-dnd';

const DraggableWidgets: FC<{ option: string; isEditing: boolean }> = ({ option, isEditing, children }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'widget',
    item: { option },
    canDrag: isEditing,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [isEditing]);
    
  // Return the draggable widget, this is the component that will be dragged around
  return (
    <div
      ref={isEditing ? drag : null}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: '10px',
        marginBottom: '10px',
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '4px',
        cursor: isEditing ? 'grab' : 'default',
      }}
    >
      {children}
    </div> 
  );
};

export default DraggableWidgets;
