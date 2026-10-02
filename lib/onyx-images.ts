export const images:Record<string,string>={
'/images/sleeve.webp':'https://images.unsplash.com/photo-1501939387519-cf9c35d4f4eb?auto=format&fit=crop&w=1400&q=85',
'/images/work.webp':'https://images.unsplash.com/photo-1649019612111-2f919bb7fd61?auto=format&fit=crop&w=1600&q=85',
'/images/artist.webp':'https://images.pexels.com/photos/13346106/pexels-photo-13346106.jpeg?auto=compress&cs=tinysrgb&w=1200',
'/images/detail.webp':'https://images.unsplash.com/photo-1543244128-30d70d41e2a9?auto=format&fit=crop&w=1200&q=85'};
export const photo=(v:string)=>images[v]||v;
