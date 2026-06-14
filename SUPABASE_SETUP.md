# 🗄️ Supabase Backend Setup — Aurora App

## Step 1: Free Account banao
👉 https://supabase.com → "Start your project" → GitHub se login karo

## Step 2: New Project banao
- "New Project" click karo
- Name: `aurora-health`
- Database Password: koi bhi strong password
- Region: Southeast Asia (Singapore) — India ke liye best
- "Create new project" → 2 min wait karo

## Step 3: API Keys copy karo
Left sidebar → Settings → API
- **Project URL** copy karo (https://xxxxx.supabase.co)
- **anon public** key copy karo

## Step 4: Keys daalo app mein
File: `src/supabase.js` — line 7-8:
```
const SUPABASE_URL = 'paste-your-url-here';
const SUPABASE_ANON_KEY = 'paste-your-anon-key-here';
```

## Step 5: Database table banao (optional - for saving health data)
Left sidebar → SQL Editor → New query → paste karo:

```sql
create table health_data (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  water_ml int default 0,
  sleep_hours float default 0,
  calories int default 0,
  updated_at timestamptz default now()
);

alter table health_data enable row level security;

create policy "Users can manage own data"
on health_data for all
using (auth.uid() = user_id);
```

## Step 6: Done! 🎉
Ab sign up karo → profile mein tumhara registered naam aayega!

## Auth features jo already kaam karte hain:
✅ Email + password signup
✅ Login / logout  
✅ Registered name → Profile mein dikhta hai
✅ Session persist (app band karo, kholo — logged in rahega)
✅ Password validation (min 6 chars)
✅ Error messages Hindi mein
