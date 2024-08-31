'use client';

import { LucideIcon } from 'lucide-react';
import { FC } from 'react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import clsx from 'clsx';
import { Typography } from '../Typography';

interface ActionIconButtonProps {
  Icon: LucideIcon;
  tooltip: string;
  tooltipDescription: string;
  className?: string;
  onClick?: () => void;
}

const ActionIconButton: FC<ActionIconButtonProps> = ({
  Icon,
  tooltip,
  tooltipDescription,
  className,
  onClick,
}) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            onClick={onClick}
            className={clsx(className)}
          >
            <Icon size={20} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {/* adjust the content format of tooltip in here */}
          <Typography variant="smallText">{tooltip}</Typography>
          <Typography variant="mutedText">{tooltipDescription}</Typography>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ActionIconButton;
