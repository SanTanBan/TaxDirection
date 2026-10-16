/* ------------------------------------------------------------------ *
 *  #TaxDirection  --  public dashboard configuration
 * ------------------------------------------------------------------ *
 *
 *  This file exposes the Supabase connection details that the PUBLIC
 *  results dashboard (dashboard.html / dashboard.js) needs in order to
 *  read the aggregated `clusters` table.
 *
 *  ----------------------------------------------------------------
 *  IS IT SAFE TO COMMIT THESE VALUES?  ->  YES, the ANON key only.
 *  ----------------------------------------------------------------
 *  The Supabase "anon" (anonymous) key is DESIGNED to be shipped to
 *  browsers. It carries no privileges of its own -- every query it
 *  makes is filtered by Postgres Row-Level Security (RLS) policies.
 *  As long as RLS on the `clusters` table grants only SELECT to the
 *  `anon` role (and nothing on `profiles` / `wishes`), exposing this
 *  key here is the standard, supported Supabase pattern.
 *
 *  NEVER place the SERVICE_ROLE key (SUPABASE_SERVICE_KEY) in this
 *  file or anywhere in this repository. That key bypasses RLS and is
 *  used only by the Python admin pipeline on Hugging Face.
 *
 *  ----------------------------------------------------------------
 *  HOW TO CONFIGURE
 *  ----------------------------------------------------------------
 *  1. Open your Supabase project  ->  Settings  ->  API.
 *  2. Copy the "Project URL"   into  SUPABASE_URL  below.
 *  3. Copy the "anon public" key into  SUPABASE_ANON_KEY  below.
 *  4. Commit & push. GitHub Pages will serve the live dashboard.
 *
 *  Until you replace the PLACEHOLDER values, the dashboard renders a
 *  friendly "Backend not configured" banner instead of crashing.
 * ------------------------------------------------------------------ */

window.TAXDIRECTION_CONFIG = {
  // ---- REPLACE THIS PLACEHOLDER ----
  SUPABASE_URL: "https://YOUR-PROJECT-ref.supabase.co",

  // ---- REPLACE THIS PLACEHOLDER (anon public key -- safe to expose) ----
  SUPABASE_ANON_KEY: "PLACEHOLDER_SUPABASE_ANON_KEY"
};
