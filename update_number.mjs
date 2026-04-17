import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateDb() {
  const { data, error } = await supabase
    .from('site_content')
    .upsert({ content_key: 'whatsapp_number', content_value: '917099017799' }, { onConflict: 'content_key' });

  if (error) {
    console.error('Error updating DB:', error);
  } else {
    console.log('Successfully updated Whatsapp number in Supabase to 917099017799');
  }
}

updateDb();
