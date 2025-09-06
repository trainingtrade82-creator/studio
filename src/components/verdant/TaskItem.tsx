'use client';

import type { FC } from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { Task } from '@/lib/types';

type TaskItemProps = {
  task: Task;
  onToggleComplete: (id: string, completed: boolean) => void;
};

export const TaskItem: FC<TaskItemProps> = ({ task, onToggleComplete }) => {
  return (
    <Card className="flex items-center p-4 transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col items-center pr-4">
        <time className="text-sm font-medium">{task.startTime}</time>
        <div className="h-4 w-px bg-border my-1"></div>
        <time className="text-sm text-muted-foreground">{task.endTime}</time>
      </div>
      <div className="flex-grow pl-4 border-l border-border">
        <div className="flex items-center justify-between">
          <label
            htmlFor={`task-${task.id}`}
            className={cn(
              'font-medium transition-all duration-300',
              task.completed && 'line-through text-muted-foreground'
            )}
          >
            {task.title}
          </label>
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={(checked) => onToggleComplete(task.id, !!checked)}
            aria-label={`Mark "${task.title}" as complete`}
          />
        </div>
      </div>
    </Card>
  );
};
