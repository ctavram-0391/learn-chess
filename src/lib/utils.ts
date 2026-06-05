import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function matchPath(path: string, paths: string[]): boolean {
  return paths.some(pattern => {
    const regexPattern = pattern
      .replace(/:[^/]+/g, '[^/]+')
      .replace(/\*/g, '.*');
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(path);
  });
}
