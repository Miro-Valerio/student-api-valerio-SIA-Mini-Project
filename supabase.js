const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://suedfrljjwhztbyoivgv.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1ZWRmcmxqandoenRieW9pdmd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1ODQxNDAsImV4cCI6MjA5NTE2MDE0MH0.MvnVNJSQjWnh3b5IlQgAxNxe_27d8obdWowiib-h7Xo";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;