'use client';

import { FC } from 'react';
import { useDrag } from 'react-dnd';
import { Button } from '@/components/ui/button';

interface DraggableOptionsProps {
  option: string;
  displayName: string;
}

const DraggableOptions: FC<DraggableOptionsProps> = ({
  option,
  displayName,
}) => {
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
      className={`mb-2 w-full justify-start pl-2 ${
        isDragging ? 'opacity-50 cursor-grabbing' : 'opacity-100 cursor-grab'
      }`}
    >
      {/* <Image
        src={`/icons/${option.toLowerCase().replace(' ', '-')}.svg`}
        className="mr-2"
        alt={''}
      /> */}
      {displayName}
    </Button>
  );
};

export default DraggableOptions;
