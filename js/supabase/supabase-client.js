
import {createClient} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

// Conexión a Supabase
const supabaseUrl = "https://omsxyeiwlchkpdojzbbk.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tc3h5ZWl3bGNoa3Bkb2p6YmJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMDQ3MjAsImV4cCI6MjA3MjY4MDcyMH0.EAAqXwFShq-B2L02XLL28g_NqhmFH1F4mpcqhAkWWRE"
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase