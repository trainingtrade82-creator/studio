'use client';

import { Button } from '@/components/ui/button';
import { Plus, Sparkles, Trash2, LogOut } from 'lucide-react';
import type { FC } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { User } from 'firebase/auth';


type HeaderProps = {
  user: User | null;
  onAddTask: () => void;
  onAiSchedule: () => void;
  onClearAll: () => void;
  hasTasks: boolean;
};

export const Header: FC<HeaderProps> = ({ user, onAddTask, onAiSchedule, onClearAll, hasTasks }) => {
  const { logout } = useAuth();

  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

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
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};
