'use client';

import { useState } from 'react';
import { AddTaskDialog } from '@/components/verdant/AddTaskDialog';
import { AiSchedulerDialog } from '@/components/verdant/AiSchedulerDialog';
import { Header } from '@/components/verdant/Header';
import { TaskList } from '@/components/verdant/TaskList';
import type { Task } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const initialTasks: Task[] = [
  { id: '1', title: 'Morning Stand-up', startTime: '09:00', endTime: '09:15', completed: true },
  { id: '2', title: 'Work on feature #123', startTime: '09:30', endTime: '11:30', completed: false },
  { id: '3', title: 'Lunch Break', startTime: '12:00', endTime: '13:00', completed: false },
  { id: '4', title: 'Team Meeting', startTime: '14:00', endTime: '15:00', completed: false },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isAddTaskOpen, setAddTaskOpen] = useState(false);
  const [isAiSchedulerOpen, setAiSchedulerOpen] = useState(false);
  const [isClearAllDialogOpen, setClearAllDialogOpen] = useState(false);

  const handleAddTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      completed: false,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, completed } : task))
    );
  };

  const handleClearAll = () => {
    setTasks([]);
    setClearAllDialogOpen(false);
  };

  return (
    <div className="flex justify-center min-h-screen">
      <div className="w-full max-w-3xl bg-card">
        <Header 
          onAddTask={() => setAddTaskOpen(true)}
          onAiSchedule={() => setAiSchedulerOpen(true)}
          onClearAll={() => setClearAllDialogOpen(true)}
          hasTasks={tasks.length > 0}
        />
        <main className="p-4 md:p-6">
          <TaskList tasks={tasks} onToggleComplete={handleToggleComplete} />
        </main>
        
        <AddTaskDialog 
          isOpen={isAddTaskOpen}
          onOpenChange={setAddTaskOpen}
          onAddTask={handleAddTask}
        />
        
        <AiSchedulerDialog
          isOpen={isAiSchedulerOpen}
          onOpenChange={setAiSchedulerOpen}
          onAddTask={handleAddTask}
          tasks={tasks}
        />

        <AlertDialog open={isClearAllDialogOpen} onOpenChange={setClearAllDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all of your tasks.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearAll}>Clear All</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  );
}
