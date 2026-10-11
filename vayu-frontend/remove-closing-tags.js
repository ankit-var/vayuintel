import fs from 'fs';
import path from 'path';

const DIR = 'C:/Users/ankit/Downloads/stitch_air_quality_intelligence_platform/vayu-frontend/src/pages';
const files = fs.readdirSync(DIR);

files.forEach(file => {
  if (file.endsWith('.jsx')) {
    let content = fs.readFileSync(path.join(DIR, file), 'utf8');
    
    // Remove invalid stray closing tags that were created by the self-closing tag regex
    const tagsToRemove = ['stop', 'path', 'circle', 'line', 'polygon', 'rect'];
    tagsToRemove.forEach(tag => {
      content = content.replace(new RegExp(`</${tag}>`, 'gi'), '');
    });

    fs.writeFileSync(path.join(DIR, file), content);
  }
});
