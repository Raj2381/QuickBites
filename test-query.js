const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mecnrhnfthulhclouoxd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_bxbdGvLmiVJaXNa1H4EJLg_Hkg1ZBCt';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase
    .from('orders')
    .select('*, time_slots(start_time, end_time, capacity), profiles(name, reg_no), order_items(*, menu_items(*))')
    .order('created_at', { ascending: false });
    
  console.log('Error:', error);
  console.log('Data count:', data ? data.length : 0);
}

test();
