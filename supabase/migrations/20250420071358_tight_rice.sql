/*
  # Set up Storage for Project Files

  1. New Storage Bucket
    - Create a new bucket called 'project-files' for storing project-related files
    - Enable public access for approved files
    - Set up appropriate security policies

  2. Security
    - Enable RLS on the storage bucket
    - Add policies for file uploads and downloads
    - Restrict access based on user roles and project permissions
*/

-- Create storage bucket for project files
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-files', 'project-files', true);

-- Enable RLS on the bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy for uploading files
CREATE POLICY "Users can upload project files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'project-files' AND
  (auth.role() IN ('admin', 'internal') OR
   EXISTS (
     SELECT 1 FROM public.projects p
     WHERE (
       -- Allow franchise owners to upload to their projects
       auth.role() = 'franchise' AND
       p.id = (storage.foldername(name))[1]::uuid AND
       p.franchise_id IN (SELECT id FROM franchises WHERE owner_user_id = auth.uid())
     ) OR (
       -- Allow clients to upload to their projects
       auth.role() = 'client' AND
       p.id = (storage.foldername(name))[1]::uuid AND
       p.client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
     )
   ))
);

-- Policy for reading files
CREATE POLICY "Users can read approved files"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'project-files' AND
  (
    -- Admins and internal staff can read all files
    auth.role() IN ('admin', 'internal') OR
    -- Users can read files from their projects
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE (
        p.id = (storage.foldername(name))[1]::uuid AND
        (
          -- Franchise owners can read their project files
          (auth.role() = 'franchise' AND
           p.franchise_id IN (SELECT id FROM franchises WHERE owner_user_id = auth.uid())) OR
          -- Clients can read their project files
          (auth.role() = 'client' AND
           p.client_id IN (SELECT id FROM clients WHERE user_id = auth.uid()))
        )
      )
    )
  )
);

-- Policy for updating files
CREATE POLICY "Only admins and internal staff can update files"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'project-files' AND
  auth.role() IN ('admin', 'internal')
);

-- Policy for deleting files
CREATE POLICY "Only admins and internal staff can delete files"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'project-files' AND
  auth.role() IN ('admin', 'internal')
);