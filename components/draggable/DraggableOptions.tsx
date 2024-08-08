import { FC } from 'react';
import { useDrag } from 'react-dnd';

const DraggableOptions: FC<{ option: string }> = ({ option }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'widget',
    item: { option },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(), // Dragging state
    }),
  })); // Drag hook

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: '10px',
        marginBottom: '10px',
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '4px',
        cursor: 'grab',
      }}
    >
      {option}
    </div> // Draggable options
  );
};

export default DraggableOptions;
