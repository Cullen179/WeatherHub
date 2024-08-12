'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input, InputProps } from '@/components/ui/input';
import { XIcon } from 'lucide-react';
import { Dispatch, SetStateAction, forwardRef, useState } from 'react';

type InputTagsProps = InputProps & {
  value: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
};

export const InputTags = forwardRef<HTMLInputElement, InputTagsProps>(
  ({ value, onChange, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = useState('');

    const addPendingDataPoint = () => {
      if (pendingDataPoint) {
        const newDataPoints = new Set([...value, pendingDataPoint]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint('');
      }
    };

    return (
      <>
        <div className="relative flex items-center flex-wrap">
          <Input
            value={pendingDataPoint}
            onChange={(e) => setPendingDataPoint(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addPendingDataPoint();
              } else if (e.key === ',' || e.key === ' ') {
                e.preventDefault();
                addPendingDataPoint();
              }
            }}
            className="flex-grow pl-2 py-1 border rounded-lg"
            {...props}
            ref={ref}
          />
          <Button
            type="button"
            variant="ghost"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-base text-gray-500 hover:bg-transparent hover:text-inherit"
            onClick={addPendingDataPoint}
          >
            +
          </Button>
        </div>
        <div className="overflow-y-auto p-2 flex gap-2 flex-wrap items-center">
          {value.map((item, idx) => (
            <Badge
              key={idx}
              variant="secondary"
            >
              {item}
              <button
                type="button"
                className="w-3 ml-2"
                onClick={() => {
                  onChange(value.filter((i) => i !== item));
                }}
              >
                <XIcon className="w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </>
    );
  }
);

InputTags.displayName = 'InputTags';
