'use client';

import { Button } from '@/components/ui/button';
import { Plus, Sparkles, Trash2 } from 'lucide-react';
import type { FC } from 'react';

type HeaderProps = {
  onAddTask: () => void;
  onAiSchedule: () => void;
  onClearAll: () => void;
  hasTasks: boolean;
};

export const Header: FC<HeaderProps> = ({ onAddTask, onAiSchedule, onClearAll, hasTasks }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b flex-wrap gap-4">
      <h1 className="text-xl md:text-2xl font-bold text-primary">Verdant Agenda</h1>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onAiSchedule}>
          <Sparkles className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Smart Schedule</span>
        </Button>
        <Button size="sm" onClick={onAddTask}>
          <Plus className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Add Task</span>
        </Button>
        {hasTasks && (
          <Button variant="destructive" size="sm" onClick={onClearAll}>
            <Trash2 className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Clear All</span>
          </Button>
        )}
      </div>
    </header>
  );
};
