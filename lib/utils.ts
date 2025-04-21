import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { type ClassValue as CVA } from 'class-variance-authority/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date | string) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
};

export const truncateText = (text: string, length: number) => {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const createAuditLog = async (
  action: string,
  userId?: string,
  targetType?: string,
  targetId?: string,
  meta?: any
) => {
  try {
    const response = await fetch('/api/audit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        userId,
        targetType,
        targetId,
        meta,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create audit log');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating audit log:', error);
  }
};

export const roleToLabel: Record<string, string> = {
  admin: 'Administrator',
  internal: 'Internal Staff',
  franchise: 'Franchise Owner',
  client: 'Client',
  user: 'User',
};

export const statusToLabel: Record<string, string> = {
  planning: 'Planning',
  in_progress: 'In Progress',
  completed: 'Completed',
};

export const statusToColor: Record<string, string> = {
  planning: 'text-blue-600 bg-blue-100',
  in_progress: 'text-amber-600 bg-amber-100',
  completed: 'text-green-600 bg-green-100',
};