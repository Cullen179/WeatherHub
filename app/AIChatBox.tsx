'use client';

import { useChat } from 'ai/react';
import { Bot, CircleArrowUp, X } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import ChatMessage from '../components/AI/ChatMessage';
import { useWeather } from '@/hooks/WeatherContext';

interface AIChatBoxProps {
  open: boolean;
  onClose: () => void;
}
export default function AIChatBox({ open, onClose }: AIChatBoxProps) {
  const { weatherData, forecastData } = useWeather();
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat({
    body: {
      weatherData,
      forecastData,
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const lastMessageIsUser = useMemo(
    () => messages[messages.length - 1]?.role === 'user',
    [messages]
  );

  return (
    <div
      className={cn(
        'relative bottom-2 right-0 z-10 w-full max-w-[420px] p-1 xl:right-4 min-h-[365px]',
        open ? 'fixed' : 'hidden'
      )}
    >
      <div></div>
      <Button
        onClick={onClose}
        variant="ghost"
        size="icon"
        className="absolute right-3 top-3 bg-transparent text-muted-foreground hover:bg-transparent hover:text-muted-foreground"
      >
        <X
          size={18}
          className="stroke-muted-foreground"
        />
      </Button>

      <div className="flex h-[450px] flex-col bg-[rgba(32,32,32,0.9)] rounded-2xl pt-11">
        <div
          className="mt-3 h-full overflow-y-auto px-4"
          ref={scrollRef}
        >
          {messages.map((message) => (
            <ChatMessage
              message={message}
              key={message.id}
            />
          ))}
          {isLoading && lastMessageIsUser && (
            <ChatMessage
              message={{
                role: 'assistant',
                content: '...',
              }}
            />
          )}
          {error && (
            <ChatMessage
              message={{
                role: 'assistant',
                content: 'Something went wrong. Please try again.',
              }}
            />
          )}
          {!error && messages.length === 0 && (
            <div className="flex h-full items-center justify-center gap-2">
              <Bot className="stroke-muted-foreground" />
              <p className="text-muted-foreground">Ask AI</p>
            </div>
          )}
        </div>
        <form
          onSubmit={handleSubmit}
          className="m-3 flex-1 gap-1.5"
        >
          {/* <Button
            title="Clear chat"
            variant="secondary"
            size="icon"
            className="shrink-0"
            type="button"
            onClick={() => setMessages([])}
          >
            <Trash size={16} />
          </Button> */}
          <div className="relative flex items-center w-full rounded-2xl focus-within:focus-within-shadow">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type something..."
              ref={inputRef}
              className="text-customTextWhite flex-1 p-2 rounded-2xl outline-none focus:outline-none focus:border-transparent"
            />
            <button
              className="absolute right-3 opacity-40"
              type="submit"
            >
              <CircleArrowUp size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
