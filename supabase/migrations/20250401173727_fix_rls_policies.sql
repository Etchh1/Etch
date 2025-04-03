-- Remove any existing policies first
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can create their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;

DROP POLICY IF EXISTS "Users can view their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can create their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can update their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can delete their own categories" ON public.categories;

DROP POLICY IF EXISTS "Users can view their own tags" ON public.tags;
DROP POLICY IF EXISTS "Users can create their own tags" ON public.tags;
DROP POLICY IF EXISTS "Users can update their own tags" ON public.tags;
DROP POLICY IF EXISTS "Users can delete their own tags" ON public.tags;

DROP POLICY IF EXISTS "Users can view task tags for their tasks" ON public.task_tags;
DROP POLICY IF EXISTS "Users can create task tags for their tasks" ON public.task_tags;
DROP POLICY IF EXISTS "Users can delete task tags for their tasks" ON public.task_tags;

DROP POLICY IF EXISTS "Users can view subtasks of their tasks" ON public.subtasks;
DROP POLICY IF EXISTS "Users can create subtasks for their tasks" ON public.subtasks;
DROP POLICY IF EXISTS "Users can update subtasks of their tasks" ON public.subtasks;
DROP POLICY IF EXISTS "Users can delete subtasks of their tasks" ON public.subtasks;

DROP POLICY IF EXISTS "Users can view their own reminders" ON public.reminders;
DROP POLICY IF EXISTS "Users can create their own reminders" ON public.reminders;
DROP POLICY IF EXISTS "Users can update their own reminders" ON public.reminders;
DROP POLICY IF EXISTS "Users can delete their own reminders" ON public.reminders;

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can create their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;

DROP POLICY IF EXISTS "Users can view their own settings" ON public.settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON public.settings;
DROP POLICY IF EXISTS "Users can insert their own settings" ON public.settings;

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Enable RLS on all tables
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create indexes for RLS performance
CREATE INDEX IF NOT EXISTS idx_tasks_profile_id ON public.tasks(profile_id);
CREATE INDEX IF NOT EXISTS idx_categories_profile_id ON public.categories(profile_id);
CREATE INDEX IF NOT EXISTS idx_tags_profile_id ON public.tags(profile_id);
CREATE INDEX IF NOT EXISTS idx_reminders_profile_id ON public.reminders(profile_id);
CREATE INDEX IF NOT EXISTS idx_notifications_profile_id ON public.notifications(profile_id);
CREATE INDEX IF NOT EXISTS idx_task_tags_task_id ON public.task_tags(task_id);
CREATE INDEX IF NOT EXISTS idx_subtasks_task_id ON public.subtasks(task_id);

-- Tasks policies
CREATE POLICY "Users can view their own tasks"
    ON public.tasks FOR SELECT
    TO authenticated
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can create their own tasks"
    ON public.tasks FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own tasks"
    ON public.tasks FOR UPDATE
    TO authenticated
    USING (auth.uid() = profile_id)
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own tasks"
    ON public.tasks FOR DELETE
    TO authenticated
    USING (auth.uid() = profile_id);

-- Categories policies
CREATE POLICY "Users can view their own categories"
    ON public.categories FOR SELECT
    TO authenticated
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can create their own categories"
    ON public.categories FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own categories"
    ON public.categories FOR UPDATE
    TO authenticated
    USING (auth.uid() = profile_id)
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own categories"
    ON public.categories FOR DELETE
    TO authenticated
    USING (auth.uid() = profile_id);

-- Tags policies
CREATE POLICY "Users can view their own tags"
    ON public.tags FOR SELECT
    TO authenticated
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can create their own tags"
    ON public.tags FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own tags"
    ON public.tags FOR UPDATE
    TO authenticated
    USING (auth.uid() = profile_id)
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own tags"
    ON public.tags FOR DELETE
    TO authenticated
    USING (auth.uid() = profile_id);

-- Task tags policies
CREATE POLICY "Users can view task tags for their tasks"
    ON public.task_tags FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.tasks 
        WHERE id = task_tags.task_id 
        AND profile_id = auth.uid()
    ));

CREATE POLICY "Users can create task tags for their tasks"
    ON public.task_tags FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.tasks 
        WHERE id = task_tags.task_id 
        AND profile_id = auth.uid()
    ));

CREATE POLICY "Users can delete task tags for their tasks"
    ON public.task_tags FOR DELETE
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.tasks 
        WHERE id = task_tags.task_id 
        AND profile_id = auth.uid()
    ));

-- Subtasks policies
CREATE POLICY "Users can view subtasks of their tasks"
    ON public.subtasks FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.tasks 
        WHERE id = subtasks.task_id 
        AND profile_id = auth.uid()
    ));

CREATE POLICY "Users can create subtasks for their tasks"
    ON public.subtasks FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.tasks 
        WHERE id = subtasks.task_id 
        AND profile_id = auth.uid()
    ));

CREATE POLICY "Users can update subtasks of their tasks"
    ON public.subtasks FOR UPDATE
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.tasks 
        WHERE id = subtasks.task_id 
        AND profile_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.tasks 
        WHERE id = subtasks.task_id 
        AND profile_id = auth.uid()
    ));

CREATE POLICY "Users can delete subtasks of their tasks"
    ON public.subtasks FOR DELETE
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.tasks 
        WHERE id = subtasks.task_id 
        AND profile_id = auth.uid()
    ));

-- Reminders policies
CREATE POLICY "Users can view their own reminders"
    ON public.reminders FOR SELECT
    TO authenticated
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can create their own reminders"
    ON public.reminders FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own reminders"
    ON public.reminders FOR UPDATE
    TO authenticated
    USING (auth.uid() = profile_id)
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own reminders"
    ON public.reminders FOR DELETE
    TO authenticated
    USING (auth.uid() = profile_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    TO authenticated
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can create their own notifications"
    ON public.notifications FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own notifications"
    ON public.notifications FOR UPDATE
    TO authenticated
    USING (auth.uid() = profile_id)
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own notifications"
    ON public.notifications FOR DELETE
    TO authenticated
    USING (auth.uid() = profile_id);

-- Settings policies (using profile_id as both PK and FK)
CREATE POLICY "Users can view their own settings"
    ON public.settings FOR SELECT
    TO authenticated
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can update their own settings"
    ON public.settings FOR UPDATE
    TO authenticated
    USING (auth.uid() = profile_id)
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can insert their own settings"
    ON public.settings FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = profile_id);

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
