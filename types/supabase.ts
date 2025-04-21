export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          role: 'admin' | 'internal' | 'franchise' | 'client' | 'user'
          franchise_id: string | null
          reset_token: string | null
          reset_token_expiry: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          phone?: string | null
          role?: 'admin' | 'internal' | 'franchise' | 'client' | 'user'
          franchise_id?: string | null
          reset_token?: string | null
          reset_token_expiry?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          role?: 'admin' | 'internal' | 'franchise' | 'client' | 'user'
          franchise_id?: string | null
          reset_token?: string | null
          reset_token_expiry?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      franchises: {
        Row: {
          id: string
          name: string
          location: string
          contact_email: string
          owner_user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          location: string
          contact_email: string
          owner_user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string
          contact_email?: string
          owner_user_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string
          franchise_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          franchise_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          franchise_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          location: string | null
          status: 'planning' | 'in_progress' | 'completed'
          franchise_id: string | null
          client_id: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          location?: string | null
          status?: 'planning' | 'in_progress' | 'completed'
          franchise_id?: string | null
          client_id?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          location?: string | null
          status?: 'planning' | 'in_progress' | 'completed'
          franchise_id?: string | null
          client_id?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      uploads: {
        Row: {
          id: string
          project_id: string
          uploaded_by: string
          file_url: string
          file_type: 'image' | 'video' | 'document'
          approved_by: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          uploaded_by: string
          file_url: string
          file_type: 'image' | 'video' | 'document'
          approved_by?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          uploaded_by?: string
          file_url?: string
          file_type?: 'image' | 'video' | 'document'
          approved_by?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          target_type: string | null
          target_id: string | null
          timestamp: string
          meta: Json | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          target_type?: string | null
          target_id?: string | null
          timestamp?: string
          meta?: Json | null
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          target_type?: string | null
          target_id?: string | null
          timestamp?: string
          meta?: Json | null
        }
      }
      franchise_applications: {
        Row: {
          id: string
          applicant_name: string
          email: string
          phone: string
          reason: string | null
          status: 'pending' | 'approved' | 'rejected'
          reviewed_by: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          applicant_name: string
          email: string
          phone: string
          reason?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          reviewed_by?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          applicant_name?: string
          email?: string
          phone?: string
          reason?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          reviewed_by?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      project_tags: {
        Row: {
          project_id: string
          tag_id: string
        }
        Insert: {
          project_id: string
          tag_id: string
        }
        Update: {
          project_id?: string
          tag_id?: string
        }
      }
    }
  }
}