# Manifested Word Bride Assembly — Church Q&A

A simple, anonymous question submission page for a church Q&A session. It does
not ask for names or contact information, and submitted questions are not shown
on the public page.

## Run locally

1. Install Node.js (version 20.19+ or 22.12+).
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env.local` and add your Supabase project URL and
   anon/publishable key.
4. In the Supabase SQL Editor, run [`supabase/schema.sql`](supabase/schema.sql).
5. Start the site with `npm run dev`.

The Supabase URL and anon/publishable key are intended for browser use. Never
put a Supabase `service_role` key in this app or in a `VITE_` environment
variable. Row-level security permits anonymous question submissions from both
signed-out and signed-in sessions, but only authenticated users listed in
`admin_users` can read questions or update their status.

## Set up the admin

1. In Supabase, enable **Authentication → Providers → Email**.
2. Create the admin’s account in **Authentication → Users**. Keep public sign-up
   disabled if only invited accounts should be able to sign in.
3. In **SQL Editor**, find the account’s UUID by replacing the email below:

   ```sql
   select id, email from auth.users where email = 'admin@yourchurch.org';
   ```

4. Add that UUID to the approved admin list:

   ```sql
   insert into public.admin_users (user_id)
   values ('PASTE-ADMIN-USER-UUID-HERE')
   on conflict (user_id) do nothing;
   ```

5. Open `/admin` on your local site or deployed website and sign in with that
   account. Only accounts explicitly listed in `admin_users` can read the
   submitted questions. Admins can mark each question pending, reviewed,
   answered, or archived.

   Admins can also add guide questions from the top of the admin inbox. They are
   stored alongside submissions with a **Guide question** label, so they are easy
   to tell apart and remain private to approved admins.

   Admins can also update the public question heading and the date the church
   will answer questions. The answer date is optional; when set, it appears on
   the public question page.

   To remove admin access, delete that user's row from `public.admin_users` in the
   Supabase SQL Editor. Do not grant admin access by putting a service-role key in
   the website.

   If you already ran an earlier version of the schema, run the updated
   [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL Editor to add
   the guide-question and public Q&A settings support and their access policies.

## Deploy

### Netlify

1. Push this project to a GitHub, GitLab, or Bitbucket repository.
2. In Netlify, choose **Add new site → Import an existing project**, connect the
   repository, and set:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Before deploying, open **Site configuration → Environment variables** and
   add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the values from
   your Supabase project. These are build-time variables, so trigger a new
   deploy after changing them.
4. Deploy the site. Netlify will provide a public URL; the admin page is at
   `<your-site-url>/admin`.

The `public/_redirects` file routes direct requests such as `/admin` to the
single-page app, so refreshing that page works on Netlify.

Never set a Supabase `service_role` key in Netlify or in a `VITE_` variable.
