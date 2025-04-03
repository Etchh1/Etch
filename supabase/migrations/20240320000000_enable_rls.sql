-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

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

DROP POLICY IF EXISTS "Users can view their own task tags" ON public.task_tags;
DROP POLICY IF EXISTS "Users can create their own task tags" ON public.task_tags;
DROP POLICY IF EXISTS "Users can delete their own task tags" ON public.task_tags;

DROP POLICY IF EXISTS "Users can view their own subtasks" ON public.subtasks;
DROP POLICY IF EXISTS "Users can create their own subtasks" ON public.subtasks;
DROP POLICY IF EXISTS "Users can update their own subtasks" ON public.subtasks;
DROP POLICY IF EXISTS "Users can delete their own subtasks" ON public.subtasks;

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

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Create policies for tasks table
CREATE POLICY "Users can view their own tasks"
    ON public.tasks FOR SELECT
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can create their own tasks"
    ON public.tasks FOR INSERT
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own tasks"
    ON public.tasks FOR UPDATE
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own tasks"
    ON public.tasks FOR DELETE
    USING (auth.uid() = profile_id);

-- Create policies for categories table
CREATE POLICY "Users can view their own categories"
    ON public.categories FOR SELECT
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can create their own categories"
    ON public.categories FOR INSERT
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own categories"
    ON public.categories FOR UPDATE
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own categories"
    ON public.categories FOR DELETE
    USING (auth.uid() = profile_id);

-- Create policies for tags table
CREATE POLICY "Users can view their own tags"
    ON public.tags FOR SELECT
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can create their own tags"
    ON public.tags FOR INSERT
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own tags"
    ON public.tags FOR UPDATE
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own tags"
    ON public.tags FOR DELETE
    USING (auth.uid() = profile_id);

-- Create policies for task_tags table
CREATE POLICY "Users can view their own task tags"
    ON public.task_tags FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.tasks
        WHERE tasks.id = task_tags.task_id
        AND tasks.profile_id = auth.uid()
    ));

CREATE POLICY "Users can create their own task tags"
    ON public.task_tags FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.tasks
        WHERE tasks.id = task_tags.task_id
        AND tasks.profile_id = auth.uid()
    ));

CREATE POLICY "Users can delete their own task tags"
    ON public.task_tags FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.tasks
        WHERE tasks.id = task_tags.task_id
        AND tasks.profile_id = auth.uid()
    ));

-- Create policies for subtasks table
CREATE POLICY "Users can view their own subtasks"
    ON public.subtasks FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.tasks
        WHERE tasks.id = subtasks.task_id
        AND tasks.profile_id = auth.uid()
    ));

CREATE POLICY "Users can create their own subtasks"
    ON public.subtasks FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.tasks
        WHERE tasks.id = subtasks.task_id
        AND tasks.profile_id = auth.uid()
    ));

CREATE POLICY "Users can update their own subtasks"
    ON public.subtasks FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.tasks
        WHERE tasks.id = subtasks.task_id
        AND tasks.profile_id = auth.uid()
    ));

CREATE POLICY "Users can delete their own subtasks"
    ON public.subtasks FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.tasks
        WHERE tasks.id = subtasks.task_id
        AND tasks.profile_id = auth.uid()
    ));

-- Create policies for reminders table
CREATE POLICY "Users can view their own reminders"
    ON public.reminders FOR SELECT
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can create their own reminders"
    ON public.reminders FOR INSERT
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own reminders"
    ON public.reminders FOR UPDATE
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own reminders"
    ON public.reminders FOR DELETE
    USING (auth.uid() = profile_id);

-- Create policies for notifications table
CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can create their own notifications"
    ON public.notifications FOR INSERT
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own notifications"
    ON public.notifications FOR DELETE
    USING (auth.uid() = profile_id);

-- Create policies for settings table
CREATE POLICY "Users can view their own settings"
    ON public.settings FOR SELECT
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can update their own settings"
    ON public.settings FOR UPDATE
    USING (auth.uid() = profile_id);

-- Create a function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create a profile when a new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 