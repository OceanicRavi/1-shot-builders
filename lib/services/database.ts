import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

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
        `, { count: 'exact' });

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
        .insert(project);
      return { data, error };
    }
  },

  uploads: {
    list: async () => {
      const { data, count, error } = await supabase
        .from('uploads')
        .select(`
          *,
          projects(name),
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
    create: async(upload: Database['public']['Tables']['franchise_applications']['Insert']) => {
            const { data, error } = await supabase
              .from("franchise_applications")
              .insert(upload);
            return {data, error};
    }
  }
};