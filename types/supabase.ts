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
          deleted_at: string
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
          deleted_at?: string
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
          deleted_at?: string
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
          deleted_at: string
          address?: string
          category?: string
          tags?: string[]
          features?: string[]
          materials_used?: string[]
          budget?: number | null
          highlighted?: boolean
          show_on_website?: boolean
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
          deleted_at?: string
          address?: string
          category?: string
          tags?: string[]
          features?: string[]
          materials_used?: string[]
          budget?: number | null
          highlighted?: boolean
          show_on_website?: boolean
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
          deleted_at?: string
          address?: string
          category?: string
          tags?: string[]
          features?: string[]
          materials_used?: string[]
          budget?: number | null
          highlighted?: boolean
          show_on_website?: boolean
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
          title?: string
          description?: string | null
          original_name?: string
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
          title?: string
          description?: string | null
          original_name?: string
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
          title?: string
          description?: string | null
          original_name?: string
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
      },
      testimonials: {
        Row: {
          id: number
          author: string
          position: string
          type: 'text' | 'video'
          quote: string
          video_url: string | null
          project_id: string
          is_public?: boolean
        }
        Insert: {
          id?: number
          author: string
          position: string
          type: 'text' | 'video'
          quote: string
          video_url?: string | null
          project_id: string
          is_public?: boolean
        }
        Update: {
          id?: number
          author?: string
          position?: string
          type?: 'text' | 'video'
          quote?: string
          video_url?: string | null
          project_id?: string
          is_public?: boolean
        }
      },
      email_templates: {
        Row: {
          id: string
          name: string
          subject: string
          body_html: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          subject: string
          body_html: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          subject?: string
          body_html?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      recipients: {
        Row: {
          id: string
          name: string
          email: string
          tags: string[]
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          tags?: string[]
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          tags?: string[]
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          name: string
          template_id: string | null
          recipient_tags: string[]
          status: string
          sent_at: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          template_id?: string | null
          recipient_tags?: string[]
          status?: string
          sent_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          template_id?: string | null
          recipient_tags?: string[]
          status?: string
          sent_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      campaign_recipients: {
        Row: {
          id: string
          campaign_id: string
          recipient_id: string
          email_sent: boolean
          sent_at: string | null
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          recipient_id: string
          email_sent?: boolean
          sent_at?: string | null
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          recipient_id?: string
          email_sent?: boolean
          sent_at?: string | null
          error_message?: string | null
          created_at?: string
        }
      }
    }
  }
}