# Supabase Setup Progress

This version uses Supabase instead of MongoDB, so the website can stay static and still save contact form messages.

## Current Goal

Make the contact form fully functional with Supabase while keeping the website static and secure.

## What Is Already Done

- Created a Supabase project: `mudilifashions`.
- Switched the website plan from MongoDB/backend server to Supabase.
- Added `supabase-config.js` for the public Supabase URL and anon key.
- Added the Supabase browser library to `index.html`.
- Connected the contact form JavaScript to insert into the `messages` table.
- Prepared secure Row Level Security for public inserts only.

## What Is Left

1. Run the SQL below in Supabase.
2. Confirm the `messages` table exists.
3. Add your Project URL and anon public key in `supabase-config.js`.
4. Test the contact form and confirm the message appears in Supabase.

## 1. Create The Messages Table

Open Supabase, go to SQL Editor, and run:

```sql
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) > 0 and char_length(name) <= 100),
  email text not null check (char_length(email) > 0 and char_length(email) <= 254 and email like '%@%.%'),
  message text not null check (char_length(message) > 0 and char_length(message) <= 2000),
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

drop policy if exists "Allow public contact form inserts" on public.messages;

create policy "Allow public contact form inserts"
on public.messages
for insert
to anon
with check (
  char_length(name) > 0
  and char_length(name) <= 100
  and email like '%@%.%'
  and char_length(message) > 0
  and char_length(message) <= 2000
);
```

This allows visitors to send messages, but it does not allow visitors to read messages.

## 2. Verify The Table

Open:

```text
Table Editor > messages
```

Confirm the table exists with these columns:

```text
id, name, email, message, created_at
```

## 3. Add Your Supabase Public Keys

Open `supabase-config.js` and replace the placeholder values:

```js
window.MUDULI_SUPABASE = {
  url: 'https://YOUR_PROJECT_ID.supabase.co',
  anonKey: 'YOUR_SUPABASE_ANON_KEY'
};
```

Use the project URL and anon public key from Supabase:

```text
Project Settings > API
```

The anon key is safe to use in frontend code when Row Level Security is enabled. Never put your `service_role` key in this website.

## 4. Test The Form

Open your website and submit the contact form. In Supabase, check:

```text
Table Editor > messages
```

You should see the submitted message there.

## Future Improvements

- Add spam protection with Cloudflare Turnstile.
- Add an admin dashboard.
- Add a product database.
- Add image uploads with Supabase Storage.
- Add authentication.
- Add order management.

## Suggested Supabase Tables

- `messages`: saves contact form messages with `name`, `email`, `message`, and `created_at`.
- `products`: stores product name, category, price, images, sizes, colors, stock, and featured status.
- `orders`: stores customer details, selected products, order total, order status, payment status, and delivery address.
- `customers`: stores customer name, email, phone, address, order history, and notes.
