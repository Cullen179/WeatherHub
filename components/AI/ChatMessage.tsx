'use client';
import React from 'react';

import { Bot, User2 } from 'lucide-react';
import { Message } from 'ai/react';
import { cn } from '@/lib/utils';

export default function ChatMessage({
  message: { role, content },
}: {
  message: Pick<Message, 'role' | 'content'>;
}) {
  const isAiMessage = role === 'assistant';

  return (
    <div
      className={cn(
        'mb-3 flex items-center',
        isAiMessage ? 'me-5 justify-start' : 'ms-5 justify-end'
      )}
    >
      {isAiMessage && <Bot className="mr-2 shrink-0" />}
      <p
        className={cn(
          'whitespace-pre-line rounded-md border px-3 py-2',
          isAiMessage ? 'bg-background' : 'bg-primary text-primary-foreground'
        )}
      >
        {content}
      </p>
    </div>
  );
}
