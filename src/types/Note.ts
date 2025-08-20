export interface Note {
  id: string;
  title: string;
  content: string;
  htmlContent?: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  color: string;
  attachments?: string[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
}