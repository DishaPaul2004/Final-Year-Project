// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   batch?: string;
//   skills: string[];
//   experience: Experience[];
//   githubLink?: string;
//   linkedinLink?: string;
//   rating: number;
//   profilePicture?: string;
// }

// export interface Experience {
//   title: string;
//   description: string;
//   startDate: string;
//   endDate?: string;
// }

// export interface Project {
//   id: string;
//   name: string;
//   abstract: string;
//   technologies: string[];
//   githubLink?: string;
//   startDate: string;
//   endDate: string;
//   teamMembers: TeamMember[];
//   imageUrl?: string;
// }

// export interface TeamMember {
//   id: string;
//   name: string;
//   role?: string;
// }

// export interface MentorRelationship {
//   id: string;
//   mentorName: string;
//   otherMentees: string[];
//   projectName: string;
//   startDate: string;
//   endDate: string;
//   paymentStatus: 'pending' | 'completed';
// }

// export interface MenteeRelationship {
//   id: string;
//   menteeName: string;
//   projectName: string;
//   startDate: string;
//   endDate: string;
//   paymentStatus: 'pending' | 'completed';
// }

// export interface ChatMessage {
//   id: string;
//   senderId: string;
//   senderName: string;
//   content: string;
//   timestamp: Date;
// }

// export interface ChatConversation {
//   id: string;
//   name: string;
//   participants: string[];
//   lastMessage?: string;
//   lastMessageTime?: Date;
//   isGroup: boolean;
//   unreadCount?: number;
// }
export interface User {
  id: number; // Changed to number to match backend Long database IDs
  name: string;
  email: string;
  phone?: string;
  batch?: string;
  skills: string[];
  experience: Experience[];
  githubLink?: string;
  linkedinLink?: string;
  rating: number;
  profilePicture?: string;
}

export interface Experience {
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
}

// ==========================================
// NEW: Project Group Architecture Interfaces
// ==========================================
export interface ProjectGroup {
  id: number; // Maps to Backend Long ID
  groupName: string;
  techStack: string;
  members: User[]; // Collection of User entities
  mentor?: User | null; // Assigned Mentor from the User entity table
  createdBy: string; // Email or ID of the creator
  createdAt: string; // Handled as an ISO string from LocalDateTime
  status: 'NORMAL' | 'CANCEL';
}

export interface ConnectionRequest {
  id: number;
  group: ProjectGroup; // Full relational Group details
  mentor: User; // Full relational targeted Mentor details
  status: -1 | 1 | 0; // -1: Pending, 1: Accepted, 0: Rejected
  projectId?: number | null; // Pre-mapped placeholder for future features
}

// ==========================================
// REFACTORED: Normalized Messaging Interface
// ==========================================
export interface ChatMessage {
  id: number;
  group?: ProjectGroup; // The Project Group entity channel this message belongs to
  sender: User; // Replaced senderId/Name text with direct User relationship block
  content: string;
  timestamp: string; // LocalDateTime converts directly to an ISO-8601 string payload
}

// ==========================================
// Legacy/Alternative Structures (Retained)
// ==========================================
export interface Project {
  id: string;
  name: string;
  abstract: string;
  technologies: string[];
  githubLink?: string;
  startDate: string;
  endDate: string;
  teamMembers: TeamMember[];
  imageUrl?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role?: string;
}

export interface MentorRelationship {
  id: string;
  mentorName: string;
  otherMentees: string[];
  projectName: string;
  startDate: string;
  endDate: string;
  paymentStatus: 'pending' | 'completed';
}

export interface MenteeRelationship {
  id: string;
  menteeName: string;
  projectName: string;
  startDate: string;
  endDate: string;
  paymentStatus: 'pending' | 'completed';
}

export interface ChatConversation {
  id: string;
  name: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTime?: string;
  isGroup: boolean;
  unreadCount?: number;
}