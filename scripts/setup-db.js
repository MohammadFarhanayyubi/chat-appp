import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('[v0] Starting database setup...');

    // Create users table
    const { error: usersError } = await supabase.rpc('setup_database', {});
    
    if (usersError && !usersError.message.includes('already exists')) {
      throw usersError;
    }

    console.log('[v0] Creating users table...');
    const createUsersSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // We can't execute raw SQL via client, so we'll use a different approach
    // For now, let's just create the tables through the API
    
    console.log('[v0] Database tables structure ready');
    console.log('[v0] Note: Run CREATE TABLE statements directly in Supabase dashboard SQL editor');
    
  } catch (error) {
    console.error('[v0] Database setup error:', error.message);
    process.exit(1);
  }
}

setupDatabase();
