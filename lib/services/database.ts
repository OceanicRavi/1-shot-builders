import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

const supabase = createClientComponentClient<Database>();

export const db = {
  auth: {
    getSession: () => supabase.auth.getSession(),
    signInWithPassword: (params: { email: string; password: string }) =>
      supabase.auth.signInWithPassword(params),
    signUp: (email: string, password: string, data?: object) =>
      supabase.auth.signUp({
        email,
        password,
        options: { data }
      }),
    signOut: () => supabase.auth.signOut(),
    resetPassword: (email: string, redirectTo: string) =>
      supabase.auth.resetPasswordForEmail(email, { redirectTo }),
    updatePassword: (password: string) =>
      supabase.auth.updateUser({ password })
  },

  users: {
    getByAuthId: async (authId: string) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authId)
        .single();
      return { data, error };
    },
    getByEmail: async (email: string) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      return { data, error };
    },
    list: async () => {
      const { data, count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .is("deleted_at", null);
      return { data, count, error };
    },
    update: async (id: string, updates: Partial<Database['public']['Tables']['users']['Update']>) => {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id);
      return { data, error };
    },
    create: async (user: Database['public']['Tables']['users']['Insert']) => {
      const { data, error } = await supabase
        .from('users')
        .insert(user);
      return { data, error };
    }
  },

  projects: {
    list: async (filters?: { status?: string; search?: string }) => {
      let query = supabase
        .from('projects')
        .select(`
          *,
          franchise:franchises(name),
          client:clients(user:users(full_name))
        `, { count: 'exact' }).is("deleted_at", null);

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      const { data, count, error } = await query;
      return { data, count, error };
    },
    create: async (project: Database['public']['Tables']['projects']['Insert']) => {
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single();
      return { data, error };
    },
    update: async (id: string, updates: Partial<Database['public']['Tables']['projects']['Update']>) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id); // optional: fetch updated record
      return { data, error };
    },

    softDelete: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);
      return { error };
    },
    publiclist: async (filters?: { status?: string; search?: string }) => {
      let query = supabase
        .from('projects')
        .select(`
          *,
          media:uploads(file_url, file_type, title, description, original_name, is_main_image)
        `, { count: 'exact' })
        .is("deleted_at", null)
        .eq('uploads.is_public', true)
        .eq('show_on_website', true); // Filter media by 'is_public' being true

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      const { data, count, error } = await query;
      return { data, count, error };
    }
  },

  uploads: {
    list: async () => {
      const { data, count, error } = await supabase
        .from('uploads')
        .select(`
          *,
          projects(name, show_on_website),
          users!uploads_uploaded_by_fkey(email)
        `, { count: 'exact' });
      return { data, count, error };
    },
    update: async (id: string, updates: Partial<Database['public']['Tables']['uploads']['Update']>) => {
      const { data, error } = await supabase
        .from('uploads')
        .update(updates)
        .eq('id', id);
      return { data, error };
    },
    create: async (upload: Database['public']['Tables']['uploads']['Insert']) => {
      const { data, error } = await supabase
        .from('uploads')
        .insert(upload);
      return { data, error };
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('uploads')
        .delete()
        .eq('id', id);
      return { error };
    }
  },

  storage: {
    from: (bucket: string) => ({
      upload: (path: string, file: File) =>
        supabase.storage.from(bucket).upload(path, file),
      getPublicUrl: (path: string) =>
        supabase.storage.from(bucket).getPublicUrl(path),
      download: (path: string) =>
        supabase.storage.from(bucket).download(path),
      remove: (paths: string[]) =>
        supabase.storage.from(bucket).remove(paths),
      list: (path?: string) =>
        supabase.storage.from(bucket).list(path),
    })
  },

  audit: {
    list: async ({ limit }: { limit: number }) => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      return { data, error };
    }
  },

  franchise_applications: {
    create: async (upload: Database['public']['Tables']['franchise_applications']['Insert']) => {
      const { data, error } = await supabase
        .from("franchise_applications")
        .insert(upload);
      return { data, error };
    }
  },

  testimonials: {
    list: async () => {
      const { data, count, error } = await supabase
        .from('testimonials')
        .select(`
        *,
        projects(name)
      `, { count: 'exact' });
      return { data, count, error };
    },
    publiclist: async () => {
      const { data, count, error } = await supabase
        .from('testimonials')
        .select(`
      *,
      projects:project_id(name)
    `, { count: 'exact' })
        .eq('is_public', true);
      return { data, count, error };
    },
    update: async (id: string, updates: Partial<Database['public']['Tables']['testimonials']['Update']>) => {
      const { data, error } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', id);
      return { data, error };
    },
    create: async (testimonial: Database['public']['Tables']['testimonials']['Insert']) => {
      const { data, error } = await supabase
        .from('testimonials')
        .insert(testimonial);
      return { data, error };
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      return { error };
    }
  },
  // Email system services
  emailTemplates: {
    list: async () => {
      const { data, count, error } = await supabase
        .from('email_templates')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });
      return { data, count, error };
    },
    create: async (template: Database['public']['Tables']['email_templates']['Insert']) => {
      const { data, error } = await supabase
        .from('email_templates')
        .insert(template)
        .select()
        .single();
      return { data, error };
    },
    update: async (id: string, updates: Partial<Database['public']['Tables']['email_templates']['Update']>) => {
      const { data, error } = await supabase
        .from('email_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', id);
      return { error };
    },
    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('id', id)
        .single();
      return { data, error };
    }
  },

  recipients: {
    list: async () => {
      const { data, count, error } = await supabase
        .from('recipients')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });
      return { data, count, error };
    },
    create: async (recipient: Database['public']['Tables']['recipients']['Insert']) => {
      const { data, error } = await supabase
        .from('recipients')
        .insert(recipient)
        .select()
        .single();
      return { data, error };
    },
    update: async (id: string, updates: Partial<Database['public']['Tables']['recipients']['Update']>) => {
      const { data, error } = await supabase
        .from('recipients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('recipients')
        .delete()
        .eq('id', id);
      return { error };
    },
    getByTags: async (tags: string[]) => {
      const { data, error } = await supabase
        .from('recipients')
        .select('*')
        .overlaps('tags', tags);
      return { data, error };
    }
  },

  campaigns: {
    list: async () => {
      const { data, count, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          template:email_templates(name, subject),
          campaign_recipients(id, email_sent, sent_at, error_message)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });
      return { data, count, error };
    },
    create: async (campaign: Database['public']['Tables']['campaigns']['Insert']) => {
      const { data, error } = await supabase
        .from('campaigns')
        .insert(campaign)
        .select()
        .single();
      return { data, error };
    },
    update: async (id: string, updates: Partial<Database['public']['Tables']['campaigns']['Update']>) => {
      const { data, error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);
      return { error };
    },
    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          template:email_templates(*),
          campaign_recipients(*, recipient:recipients(*))
        `)
        .eq('id', id)
        .single();
      return { data, error };
    }
  },

  campaignRecipients: {
    create: async (campaignRecipient: Database['public']['Tables']['campaign_recipients']['Insert']) => {
      const { data, error } = await supabase
        .from('campaign_recipients')
        .insert(campaignRecipient)
        .select()
        .single();
      return { data, error };
    },
    update: async (id: string, updates: Partial<Database['public']['Tables']['campaign_recipients']['Update']>) => {
      const { data, error } = await supabase
        .from('campaign_recipients')
        .update(updates)
        .eq('id', id);
      return { data, error };
    },
    getByCampaign: async (campaignId: string) => {
      const { data, error } = await supabase
        .from('campaign_recipients')
        .select(`
          *,
          recipient:recipients(*)
        `)
        .eq('campaign_id', campaignId);
      return { data, error };
    }
  }
//
};