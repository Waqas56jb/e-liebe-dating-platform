// Seed real demo profiles (real DB accounts) with photos, both genders, and
// make them pre-like every existing real user so liking back = instant match.
//   node scripts/seed.js
require('dotenv').config();
const { admin } = require('../src/config/supabase');

const PASSWORD = 'Seed123!secure';
const dob = (age) => { const d = new Date(); d.setFullYear(d.getFullYear() - age); return d.toISOString().slice(0, 10); };

// Download a portrait and upload it into OUR Supabase Storage (real hosted image),
// then return the public Storage URL. No external image URLs end up in the DB.
async function uploadPhoto(userId, photoId, index) {
  const src = `https://images.unsplash.com/photo-${photoId}?w=1280&q=85&fit=crop&crop=faces`;
  const res = await fetch(src);
  if (!res.ok) throw new Error(`download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const path = `${userId}/${index}.jpg`;
  const { error } = await admin.storage
    .from('photos')
    .upload(path, buf, { contentType: 'image/jpeg', upsert: true });
  if (error) throw error;
  return admin.storage.from('photos').getPublicUrl(path).data.publicUrl;
}

const PEOPLE = [
  { name: 'Sophia', age: 27, gender: 'female', show: 'men', city: 'München', country: 'de', job: 'Marketing Managerin', edu: 'Master in BWL', h: 168, rel: 'christian', goal: 'serious', kids: 'want', bio: 'Gutes Essen, spontane Roadtrips & tiefe Gespräche.', ints: ['travel','yoga','cooking','music'], photo: '1524250502761-1ac6f2e30d43' },
  { name: 'Mia', age: 24, gender: 'female', show: 'men', city: 'Zürich', country: 'ch', job: 'Fotografin', edu: 'Studium Fotografie', h: 170, rel: 'spiritual', goal: 'longterm', kids: 'open', bio: 'Ich fange goldene Stunden ein ✨', ints: ['travel','photography','yoga','nature'], photo: '1496440737103-cd596325d314' },
  { name: 'Emma', age: 27, gender: 'female', show: 'men', city: 'München', country: 'de', job: 'Marketing Lead', edu: 'Master Marketing', h: 172, rel: 'none', goal: 'serious', kids: 'want', bio: 'Pflanzen 🌿, Podcasts & Surfen.', ints: ['nature','reading','travel','fitness'], photo: '1508214751196-bcfd4ca60f91' },
  { name: 'Lena', age: 29, gender: 'female', show: 'men', city: 'Hamburg', country: 'de', job: 'Ärztin', edu: 'Studium Medizin', h: 165, rel: 'christian', goal: 'marriage', kids: 'have', bio: 'Lange Gespräche bei gutem Wein 🍷.', ints: ['wine','cooking','music','dancing'], photo: '1499952127939-9bbf5af6c51c' },
  { name: 'Clara', age: 25, gender: 'female', show: 'men', city: 'Basel', country: 'ch', job: 'Architektin', edu: 'Master Architektur', h: 174, rel: 'spiritual', goal: 'longterm', kids: 'want', bio: 'Designverliebt 🥐', ints: ['art','coffee','travel','foodie'], photo: '1487412947147-5cebf100ffc2' },
  { name: 'Hannah', age: 31, gender: 'female', show: 'men', city: 'Wien', country: 'at', job: 'Musikerin', edu: 'Musikhochschule', h: 169, rel: 'none', goal: 'serious', kids: 'open', bio: 'Gitarristin sucht Duett-Partner 🎸', ints: ['music','travel','coffee','movies'], photo: '1534751516642-a1af1ef26a56' },
  { name: 'Amira', age: 28, gender: 'female', show: 'men', city: 'Frankfurt', country: 'de', job: 'Anwältin', edu: 'Jura', h: 167, rel: 'muslim', goal: 'marriage', kids: 'want', bio: 'Ehrgeizig & herzlich.', ints: ['reading','foodie','fitness','travel'], photo: '1531123897727-8f129e1688ce' },
  { name: 'Julia', age: 23, gender: 'female', show: 'men', city: 'Köln', country: 'de', job: 'Studentin', edu: 'Bachelor', h: 171, rel: 'christian', goal: 'longterm', kids: 'open', bio: 'Yoga am Morgen, Tanzen am Abend 💃', ints: ['yoga','dancing','coffee','nature'], photo: '1502764613149-7f1d229e230f' },
  { name: 'Lukas', age: 30, gender: 'male', show: 'women', city: 'Berlin', country: 'de', job: 'Ingenieur', edu: 'Master Maschinenbau', h: 184, rel: 'none', goal: 'serious', kids: 'want', bio: 'Berge, Kaffee & gute Bücher.', ints: ['hiking','coffee','reading','sports'], photo: '1500648767791-00dcc994a43e' },
  { name: 'Max', age: 28, gender: 'male', show: 'women', city: 'Hamburg', country: 'de', job: 'Designer', edu: 'Design', h: 180, rel: 'spiritual', goal: 'longterm', kids: 'open', bio: 'Italienisch kochen & Roadtrips.', ints: ['cooking','travel','art','music'], photo: '1506794778202-cad84cf45f1d' },
  { name: 'Daniel', age: 33, gender: 'male', show: 'women', city: 'Zürich', country: 'ch', job: 'Arzt', edu: 'Studium Medizin', h: 186, rel: 'christian', goal: 'marriage', kids: 'want', bio: 'Familienmensch mit Humor.', ints: ['fitness','wine','travel','foodie'], photo: '1521119989659-a83eee488004' },
  { name: 'Jonas', age: 26, gender: 'male', show: 'women', city: 'Wien', country: 'at', job: 'Musiker', edu: 'Musik', h: 178, rel: 'none', goal: 'serious', kids: 'open', bio: 'Konzerte, Vinyl & spätes Frühstück.', ints: ['music','movies','coffee','photography'], photo: '1507003211169-0a1dd7228f2d' },
];

(async () => {
  console.log('\n→ Seeding demo profiles\n');
  // bucket (ignore if exists)
  await admin.storage.createBucket('photos', { public: true }).catch(() => {});
  const { data: interests } = await admin.from('interests').select('id,slug');
  const idBySlug = Object.fromEntries((interests || []).map((i) => [i.slug, i.id]));

  // existing real users to pre-like
  const { data: usersList } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const realUserIds = usersList.users.filter((u) => !/@eliebe\.app$/.test(u.email || '')).map((u) => u.id);

  const seededIds = [];
  for (let i = 0; i < PEOPLE.length; i++) {
    const p = PEOPLE[i];
    const email = `seed_${p.name.toLowerCase()}@eliebe.app`;
    let userId;
    const { data: created, error } = await admin.auth.admin.createUser({ email, password: PASSWORD, email_confirm: true, user_metadata: { name: p.name } });
    if (error) {
      const found = usersList.users.find((u) => u.email === email);
      userId = found?.id;
      if (!userId) { console.log(`  ✖ ${p.name}: ${error.message}`); continue; }
    } else userId = created.user.id;
    seededIds.push(userId);

    await admin.from('profiles').update({
      name: p.name, date_of_birth: dob(p.age), gender: p.gender, show_me: p.show,
      city: p.city, country: p.country, job: p.job, education: p.edu, height_cm: p.h,
      religion: p.rel, relationship_goal: p.goal, children: p.kids, bio: p.bio,
      is_verified: i % 2 === 0, is_complete: true, hide_discovery: false, pause_matching: false,
    }).eq('id', userId);

    await admin.from('profile_photos').delete().eq('profile_id', userId);
    try {
      const hostedUrl = await uploadPhoto(userId, p.photo, 0);
      await admin.from('profile_photos').insert({ profile_id: userId, url: hostedUrl, position: 0, is_primary: true });
    } catch (e) {
      console.log(`  ⚠ ${p.name}: photo upload failed (${e.message})`);
    }

    await admin.from('profile_interests').delete().eq('profile_id', userId);
    const ids = p.ints.map((s) => idBySlug[s]).filter(Boolean);
    if (ids.length) await admin.from('profile_interests').insert(ids.map((interest_id) => ({ profile_id: userId, interest_id })));

    console.log(`  ✔ ${p.name} (${p.gender})`);
  }

  // Pre-like: every seeded profile likes every real user -> liking back = instant match
  let likes = 0;
  for (const sid of seededIds) {
    for (const rid of realUserIds) {
      const { error } = await admin.from('swipes').upsert(
        { swiper_id: sid, swipee_id: rid, action: 'like' }, { onConflict: 'swiper_id,swipee_id' });
      if (!error) likes++;
    }
  }
  console.log(`\n  Pre-liked ${realUserIds.length} real user(s) -> ${likes} likes. (Like any of them back = instant match.)`);
  console.log('  Done.\n');
  process.exit(0);
})().catch((e) => { console.error('✖', e.message); process.exit(1); });
