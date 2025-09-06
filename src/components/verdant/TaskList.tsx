'use client';

import type { FC } from 'react';
import { TaskItem } from './TaskItem';
import type { Task } from '@/lib/types';
import { CalendarCheck2 } from 'lucide-react';

type TaskListProps = {
  tasks: Task[];
  onToggleComplete: (id: string, completed: boolean) => void;
};

export const TaskList: FC<TaskListProps> = ({ tasks, onToggleComplete }) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg mt-8">
        <CalendarCheck2 className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold">All clear!</h3>
        <p className="text-muted-foreground mt-2">Your agenda is empty. Add a task to get started.</p>
      </div>
    );
  }

  const sortedTasks = [...tasks].sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-4 pt-4">
      {sortedTasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggleComplete={onToggleComplete} />
      ))}
    </div>
  );
};
