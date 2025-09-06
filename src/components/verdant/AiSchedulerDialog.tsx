'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { FC } from 'react';
import { useState } from 'react';
import { suggestOptimalTaskTimes } from '@/app/actions';
import type { Task } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const aiSchedulerSchema = z.object({
  taskName: z.string().min(1, 'Task name is required.'),
  taskDuration: z.string().min(1, 'Duration is required.'),
  userPreferences: z.string().optional(),
});

type AiSchedulerFormData = z.infer<typeof aiSchedulerSchema>;

type AiSchedulerDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddTask: (data: { title: string; startTime: string; endTime: string }) => void;
  tasks: Task[];
};

type Suggestion = {
  suggestedTime: string;
  reasoning: string;
};

export const AiSchedulerDialog: FC<AiSchedulerDialogProps> = ({ isOpen, onOpenChange, onAddTask, tasks }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [taskNameToAdd, setTaskNameToAdd] = useState('');

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AiSchedulerFormData>({
    resolver: zodResolver(aiSchedulerSchema),
    defaultValues: { taskName: '', taskDuration: '30 minutes', userPreferences: '' },
  });

  const getAvailableTimeSlots = (existingTasks: Task[]): string => {
    const dayStart = '09:00';
    const dayEnd = '17:00';
    
    if (existingTasks.length === 0) return `${dayStart} - ${dayEnd}`;

    const sortedTasks = [...existingTasks].sort((a, b) => a.startTime.localeCompare(b.startTime));
    const slots = [];

    if (sortedTasks[0].startTime > dayStart) slots.push(`${dayStart} - ${sortedTasks[0].startTime}`);

    for (let i = 0; i < sortedTasks.length - 1; i++) {
      if (sortedTasks[i].endTime < sortedTasks[i+1].startTime) slots.push(`${sortedTasks[i].endTime} - ${sortedTasks[i+1].startTime}`);
    }
    
    if (sortedTasks[sortedTasks.length - 1].endTime < dayEnd) slots.push(`${sortedTasks[sortedTasks.length - 1].endTime} - ${dayEnd}`);
    
    return slots.length > 0 ? slots.join(', ') : "No available slots today.";
  };
  
  const parseSuggestedTime = (timeRange: string): { startTime: string; endTime: string } | null => {
    const timeParts = timeRange.match(/(\d{1,2}:\d{2})\s*(AM|PM)?\s*-\s*(\d{1,2}:\d{2})\s*(AM|PM)?/i);
    if (!timeParts) return null;

    const formatTo24Hour = (time: string, ampm?: string) => {
      let [hours, minutes] = time.split(':').map(Number);
      if (ampm?.toLowerCase() === 'pm' && hours < 12) hours += 12;
      if (ampm?.toLowerCase() === 'am' && hours === 12) hours = 0;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    const startTime = formatTo24Hour(timeParts[1], timeParts[2]);
    const endTime = formatTo24Hour(timeParts[3], timeParts[4]);
    
    return { startTime, endTime };
  }

  const onSubmit = async (data: AiSchedulerFormData) => {
    setIsLoading(true);
    setSuggestion(null);
    setTaskNameToAdd(data.taskName);
    try {
      const availableTimeSlots = getAvailableTimeSlots(tasks);
      const result = await suggestOptimalTaskTimes({ ...data, availableTimeSlots });
      setSuggestion(result);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not get a suggestion. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = () => {
    if (suggestion && taskNameToAdd) {
      const parsedTime = parseSuggestedTime(suggestion.suggestedTime);
      if (parsedTime) {
        onAddTask({ title: taskNameToAdd, ...parsedTime });
        handleClose();
      } else {
         toast({
            variant: 'destructive',
            title: 'Error Parsing Time',
            description: `Could not understand the suggested time: "${suggestion.suggestedTime}". Please add it manually.`,
          });
      }
    }
  };

  const handleClose = () => {
    reset();
    setSuggestion(null);
    setTaskNameToAdd('');
    onOpenChange(false);
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if(!open) handleClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Smart Schedule Assistant</DialogTitle>
          <DialogDescription>Let AI find the perfect slot for your task.</DialogDescription>
        </DialogHeader>
        
        {!suggestion && !isLoading && (
          <form onSubmit={handleSubmit(onSubmit)} id="ai-scheduler-form" className="space-y-4 py-4">
            <div>
              <Label htmlFor="taskName">Task Name</Label>
              <Input id="taskName" {...register('taskName')} placeholder="e.g., Design review meeting" />
              {errors.taskName && <p className="text-sm text-destructive mt-1">{errors.taskName.message}</p>}
            </div>

            <div>
              <Label htmlFor="taskDuration">Task Duration</Label>
              <Controller
                name="taskDuration"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select duration" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15 minutes">15 minutes</SelectItem>
                      <SelectItem value="30 minutes">30 minutes</SelectItem>
                      <SelectItem value="1 hour">1 hour</SelectItem>
                      <SelectItem value="1 hour 30 minutes">1.5 hours</SelectItem>
                      <SelectItem value="2 hours">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.taskDuration && <p className="text-sm text-destructive mt-1">{errors.taskDuration.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="userPreferences">Preferences (optional)</Label>
              <Textarea id="userPreferences" {...register('userPreferences')} placeholder="e.g., 'In the morning', 'Not after 4 PM'" />
            </div>
          </form>
        )}
        
        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Finding the best time...</p>
          </div>
        )}

        {suggestion && !isLoading && (
          <div className="py-4 space-y-4">
             <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle className="font-semibold">Suggestion Found!</AlertTitle>
              <AlertDescription className="mt-2 space-y-2">
                <p><strong>Suggested Time:</strong> {suggestion.suggestedTime}</p>
                <p><strong>Reasoning:</strong> {suggestion.reasoning}</p>
              </AlertDescription>
            </Alert>
          </div>
        )}

        <DialogFooter>
          {!suggestion ? (
            <Button type="submit" form="ai-scheduler-form" disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Get Suggestion
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setSuggestion(null)}>Try Again</Button>
              <Button onClick={handleAddTask}>Add to Schedule</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
