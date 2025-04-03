-- Drop existing policies if they exist
DROP POLICY IF EXISTS "profiles_policy" ON public.profiles;
DROP POLICY IF EXISTS "tasks_policy" ON public.tasks;
DROP POLICY IF EXISTS "categories_policy" ON public.categories;
DROP POLICY IF EXISTS "tags_policy" ON public.tags;
DROP POLICY IF EXISTS "task_tags_policy" ON public.task_tags;
DROP POLICY IF EXISTS "subtasks_policy" ON public.subtasks;
DROP POLICY IF EXISTS "reminders_policy" ON public.reminders;
DROP POLICY IF EXISTS "notifications_policy" ON public.notifications;
DROP POLICY IF EXISTS "settings_policy" ON public.settings;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "profiles_policy" ON public.profiles
FOR ALL USING (auth.uid() = id);

-- Create policies for tasks
CREATE POLICY "tasks_policy" ON public.tasks
FOR ALL USING (auth.uid() = profile_id);

-- Create policies for categories
CREATE POLICY "categories_policy" ON public.categories
FOR ALL USING (auth.uid() = profile_id);

-- Create policies for tags
CREATE POLICY "tags_policy" ON public.tags
FOR ALL USING (auth.uid() = profile_id);

-- Create policies for task_tags
CREATE POLICY "task_tags_policy" ON public.task_tags
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM tasks 
    WHERE id = task_tags.task_id 
    AND profile_id = auth.uid()
  )
);

-- Create policies for subtasks
CREATE POLICY "subtasks_policy" ON public.subtasks
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM tasks 
    WHERE id = subtasks.task_id 
    AND profile_id = auth.uid()
  )
);

-- Create policies for reminders
CREATE POLICY "reminders_policy" ON public.reminders
FOR ALL USING (auth.uid() = profile_id);

-- Create policies for notifications
CREATE POLICY "notifications_policy" ON public.notifications
FOR ALL USING (auth.uid() = profile_id);

-- Create policies for settings
CREATE POLICY "settings_policy" ON public.settings
FOR ALL USING (auth.uid() = profile_id);

-- Ensure tables are not accessible to the public
REVOKE ALL ON public.profiles FROM anon, authenticated;
REVOKE ALL ON public.tasks FROM anon, authenticated;
REVOKE ALL ON public.categories FROM anon, authenticated;
REVOKE ALL ON public.tags FROM anon, authenticated;
REVOKE ALL ON public.task_tags FROM anon, authenticated;
REVOKE ALL ON public.subtasks FROM anon, authenticated;
REVOKE ALL ON public.reminders FROM anon, authenticated;
REVOKE ALL ON public.notifications FROM anon, authenticated;
REVOKE ALL ON public.settings FROM anon, authenticated;

-- Grant specific permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tags TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.task_tags TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subtasks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reminders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.settings TO authenticated;
