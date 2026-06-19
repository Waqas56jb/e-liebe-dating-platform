// Seed real data into Supabase: a Storage bucket + sample complete profiles.
//   node scripts/seed.js
require('dotenv').config();
const { admin } = require('../src/config/supabase');

const PASSWORD = 'Seed123!secure';
const dob = (age) => { const d = new Date(); d.setFullYear(d.getFullYear() - age); return d.toISOString().slice(0, 10); };

const PEOPLE = [
  { name: 'Sophia', age: 27, city: 'München', country: 'de', job: 'Marketing Managerin', education: 'Master in BWL', height: 168, religion: 'christian', goal: 'serious', children: 'want', bio: 'Ich liebe gutes Essen, spontane Roadtrips und tiefgründige Gespräche.', interests: ['travel', 'yoga', 'cooking', 'music'], photo: '1524250502761-1ac6f2e30d43' },
  { name: 'Mia', age: 24, city: 'Zürich', country: 'ch', job: 'Fotografin', education: 'Studium Fotografie', height: 170, religion: 'spiritual', goal: 'longterm', children: 'open', bio: 'Ich fange goldene Stunden und gute Vibes ein ✨', interests: ['travel', 'photography', 'yoga', 'nature'], photo: '1496440737103-cd596325d314' },
  { name: 'Emma', age: 27, city: 'München', country: 'de', job: 'Marketing Lead', education: 'Master Marketing', height: 172, religion: 'none', goal: 'serious', children: 'want', bio: 'Pflanzensammlerin 🌿, Podcast-Süchtige und angehende Surferin.', interests: ['nature', 'reading', 'travel', 'fitness'], photo: '1508214751196-bcfd4ca60f91' },
  { name: 'Lena', age: 29, city: 'Hamburg', country: 'de', job: 'Ärztin', education: 'Studium Medizin', height: 165, religion: 'christian', goal: 'marriage', children: 'have', bio: 'Liebe lange Gespräche bei gutem Wein 🍷.', interests: ['wine', 'cooking', 'music', 'dancing'], photo: '1499952127939-9bbf5af6c51c' },
  { name: 'Clara', age: 25, city: 'Basel', country: 'ch', job: 'Architektin', education: 'Master Architektur', height: 174, religion: 'spiritual', goal: 'longterm', children: 'want', bio: 'Designverliebt, immer auf der Suche nach dem besten Croissant 🥐.', interests: ['art', 'coffee', 'travel', 'foodie'], photo: '1487412947147-5cebf100ffc2' },
  { name: 'Hannah', age: 31, city: 'Wien', country: 'at', job: 'Musikerin', education: 'Musikhochschule', height: 169, religion: 'none', goal: 'serious', children: 'open', bio: 'Gitarristin auf der Suche nach meinem Duett-Partner 🎸.', interests: ['music', 'travel', 'coffee', 'movies'], photo: '1534751516642-a1af1ef26a56' },
  { name: 'Amira', age: 28, city: 'Frankfurt', country: 'de', job: 'Anwältin', education: 'Jura Staatsexamen', height: 167, religion: 'muslim', goal: 'marriage', children: 'want', bio: 'Ehrgeizig, herzlich und immer für ein Abenteuer zu haben.', interests: ['reading', 'foodie', 'fitness', 'travel'], photo: '1531123897727-8f129e1688ce' },
  { name: 'Julia', age: 23, city: 'Köln', country: 'de', job: 'Studentin', education: 'Bachelor (laufend)', height: 171, religion: 'christian', goal: 'longterm', children: 'open', bio: 'Yoga am Morgen, Tanzen am Abend 💃.', interests: ['yoga', 'dancing', 'coffee', 'nature'], photo: '1502764613149-7f1d229e230f' },
];
const photoUrl = (id) => `https://images.unsplash.com/photo-${id}?w=1280&q=90&fit=crop&crop=faces`;

(async () => {
  console.log('\n→ Seeding E-Liebe data\n');

  // 1) Storage bucket for user photos (public read)
  const { error: bErr } = await admin.storage.createBucket('photos', { public: true });
  console.log(bErr ? `  photos bucket: ${bErr.message}` : '  ✔ created public "photos" bucket');

  // interest slug -> id
  const { data: interests } = await admin.from('interests').select('id,slug');
  const idBySlug = Object.fromEntries((interests || []).map((i) => [i.slug, i.id]));

  // 2) Profiles
  for (let i = 0; i < PEOPLE.length; i++) {
    const person = PEOPLE[i];
    const email = `seed_${person.name.toLowerCase()}@eliebe.app`;

    // create (or find) confirmed auth user -> trigger makes the profile row
    let userId;
    const { data: created, error: cErr } = await admin.auth.admin.createUser({
      email, password: PASSWORD, email_confirm: true, user_metadata: { name: person.name },
    });
    if (cErr) {
      if (/registered|exists/i.test(cErr.message)) {
        const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
        userId = list.users.find((u) => u.email === email)?.id;
      } else { console.log(`  ✖ ${person.name}: ${cErr.message}`); continue; }
    } else { userId = created.user.id; }
    if (!userId) { console.log(`  ✖ ${person.name}: no id`); continue; }

    await admin.from('profiles').update({
      name: person.name, date_of_birth: dob(person.age), gender: 'female', show_me: 'men',
      city: person.city, country: person.country, job: person.job, education: person.education,
      height_cm: person.height, religion: person.religion, relationship_goal: person.goal,
      children: person.children, bio: person.bio, is_verified: i % 2 === 0, is_complete: true,
    }).eq('id', userId);

    await admin.from('profile_photos').delete().eq('profile_id', userId);
    await admin.from('profile_photos').insert({ profile_id: userId, url: photoUrl(person.photo), position: 0, is_primary: true });

    await admin.from('profile_interests').delete().eq('profile_id', userId);
    const ids = person.interests.map((s) => idBySlug[s]).filter(Boolean);
    if (ids.length) await admin.from('profile_interests').insert(ids.map((interest_id) => ({ profile_id: userId, interest_id })));

    console.log(`  ✔ ${person.name} (${email})`);
  }

  console.log('\n  Done. Sample login: seed_sophia@eliebe.app / Seed123!secure\n');
  process.exit(0);
})().catch((e) => { console.error('✖', e.message); process.exit(1); });
