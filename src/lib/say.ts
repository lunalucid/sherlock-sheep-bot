import { pick } from '../util';

const searchPhrase = [
  'Wool-gathering intel... stay floofy.',
  'The flock sleeps. I don\’t. I hunt lies in the moonlight...',
  'By fleece and flame, I hunt the ancient claims...',
  'Baa-bytes syncing… scanning the truth-grid...',
  'Tuning in to Sheeplevision™ Channel 3: The Truth Hour...',
  'Neon hooves. Encrypted lies. Let\’s decrypt this pasture...',
  'Running the woolgorithm™...',
  'Shear luck won\’t save lies from detection... ⚔️ 🐑',
  'Fluff sync engaged... ☁️',
  'Baasearch initiated... 🐑'
]

const foundPhrase = [
  'Baaaaam. Facts confirmed. 🐑 🕵️',
  'Wool pulled back. Truth exposed. ☁️ 🕵️',
  'With blade and baaa, the truth has been reclaimed. 🗡️ 🐑',
  'Truth.exe completed. Uploading receipts. 💾 ✅',
  'Ewe just got served. With a side of FACTS. 🐑 🍽️',
  'Data packet verified. Misinformation neutralized. 🐑 🛰️',
  'Report finalized. This baa\’s got receipts. 🧾 🐑',
  'Fluff filters engaged — baaad data denied. 🚫 🗂️',
  'Fluff confirmed, no wool over our eyes today. 😎 🐏',
  'Floofy facts CONFIRMED. 🐑 ✨'
]

export const Say = {
  search: () => pick(searchPhrase),
  found: () => pick(foundPhrase),
};