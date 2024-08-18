'use client';

import { FC } from 'react';
import { useDrag } from 'react-dnd';
import { Button } from '@/components/ui/button';

interface DraggableOptionsProps {
  option: string;
  displayName: string;
}

const DraggableOptions: FC<DraggableOptionsProps> = ({ option, displayName }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'widget',
    item: { option },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <Button
      variant="outline"
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        marginBottom: '10px',
        width: '100%',
        justifyContent: 'flex-start',
        paddingLeft: '10px',
      }}
    >
      <img
        src={`/icons/${option.toLowerCase().replace(' ', '-')}.svg`}
        style={{ marginRight: '10px' }}
      />
      {displayName}
    </Button>
  );
};

export default DraggableOptions;
