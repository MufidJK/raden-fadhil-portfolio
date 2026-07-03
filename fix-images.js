const fs = require('fs');
let content = fs.readFileSync('src/lib/data/projects.ts', 'utf8');
let i = 0;
content = content.replace(/https:\/\/images\.unsplash\.com\/photo-[^\"']+/g, () => {
  i++;
  return `https://picsum.photos/seed/pic${i}/1920/1080`;
});
fs.writeFileSync('src/lib/data/projects.ts', content);
