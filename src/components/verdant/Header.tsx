'use client';

import { Button } from '@/components/ui/button';
import { Plus, Sparkles } from 'lucide-react';
import type { FC } from 'react';

type HeaderProps = {
  onAddTask: () => void;
  onAiSchedule: () => void;
};

export const Header: FC<HeaderProps> = ({ onAddTask, onAiSchedule }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <h1 className="text-2xl font-bold text-primary">Verdant Agenda</h1>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onAiSchedule}>
          <Sparkles className="mr-2 h-4 w-4" />
          Smart Schedule
        </Button>
        <Button size="sm" onClick={onAddTask}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>
    </header>
  );
};
