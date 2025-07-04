import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatar?: string;
  age?: number;
  location?: string;
  interests?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Match {
  id: string;
  users: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}
