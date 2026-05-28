import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env["SUPABASE_URL"];
const supabaseServiceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase configuration in environment variables");
}

// Adjust URL if it ends with /rest/v1/ to use the base API URL for Storage client compatibility
const cleanUrl = supabaseUrl.endsWith("/rest/v1/")
  ? supabaseUrl.replace("/rest/v1/", "")
  : supabaseUrl;

export const supabase = createClient(cleanUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
  },
});
