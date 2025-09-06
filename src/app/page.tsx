'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';

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
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isAddTaskOpen, setAddTaskOpen] = useState(false);
  const [isAiSchedulerOpen, setAiSchedulerOpen] = useState(false);
  const [isClearAllDialogOpen, setClearAllDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setIsDataLoading(true);
      const tasksCollectionRef = collection(db, 'users', user.uid, 'tasks');
      const unsubscribe = onSnapshot(tasksCollectionRef, (snapshot) => {
        const tasksData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Task[];
        setTasks(tasksData);
        setIsDataLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleAddTask = async (taskData: Omit<Task, 'id' | 'completed'>) => {
    if (!user) return;
    const newTask = {
      ...taskData,
      completed: false,
    };
    await addDoc(collection(db, 'users', user.uid, 'tasks'), newTask);
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    if (!user) return;
    const taskDocRef = doc(db, 'users', user.uid, 'tasks', id);
    await updateDoc(taskDocRef, { completed });
  };

  const handleClearAll = async () => {
    if (!user) return;
    const tasksCollectionRef = collection(db, 'users', user.uid, 'tasks');
    const q = query(tasksCollectionRef);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docSnapshot) => {
      await deleteDoc(doc(db, 'users', user.uid, 'tasks', docSnapshot.id));
    });
    setClearAllDialogOpen(false);
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center min-h-screen">
        <div className="w-full max-w-3xl bg-card">
          <header className="flex items-center justify-between p-4 border-b flex-wrap gap-4">
            <Skeleton className="h-8 w-40" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </header>
          <main className="p-4 md:p-6 space-y-4 pt-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-screen">
      <div className="w-full max-w-3xl bg-card">
        <Header
          user={user}
          onAddTask={() => setAddTaskOpen(true)}
          onAiSchedule={() => setAiSchedulerOpen(true)}
          onClearAll={() => setClearAllDialogOpen(true)}
          hasTasks={tasks.length > 0}
        />
        <main className="p-4 md:p-6">
          <TaskList tasks={tasks} onToggleComplete={handleToggleComplete} isLoading={isDataLoading} />
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
