export interface Task {
  id: number;
  title: string;
  description: string;
  image_url: string;
  points: number;
  link: string;
  conditions: string[];
  section: string;
  sort_order: number;
}

export interface User {
  id: string;
  username: string;
  points: number;
  completed_tasks: number[];
}