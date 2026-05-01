import { z } from "zod";

export type WorkspaceRole = "admin" | "editor" | "viewer";

export interface WorkspaceMember {
  userId: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: WorkspaceRole;
  joinedAt: Date;
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  members: WorkspaceMember[];
  customDomains: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const CreateWorkspaceSchema = z.object({
  name: z.string().min(2).max(50),
});

export const InviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "editor", "viewer"]).default("editor"),
});

export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceSchema>;
export type InviteMemberInput = z.infer<typeof InviteMemberSchema>;
