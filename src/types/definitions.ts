export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ImageEdit {
  id: string;
  originalImage: string;
  editedImage?: string;
  prompt: string;
  timestamp: number;
  status: 'pending' | 'completed' | 'error';
}