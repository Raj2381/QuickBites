const URL = "https://mecnrhnfthulhclouoxd.supabase.co/rest/v1/orders?select=*,profiles(name,reg_no),order_items(*,menu_items(*))&order=created_at.desc";
const KEY = "sb_publishable_bxbdGvLmiVJaXNa1H4EJLg_Hkg1ZBCt";

async function test() {
  const res = await fetch(URL, {
    headers: {
      "apikey": KEY,
      "Authorization": "Bearer " + KEY
    }
  });
  const data = await res.json();
  console.log("Status:", res.status);
  console.log("Data:", JSON.stringify(data, null, 2));
}

test();
