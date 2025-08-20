export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}