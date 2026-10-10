import fs from 'fs';
import path from 'path';

const DIR = 'C:/Users/ankit/Downloads/stitch_air_quality_intelligence_platform/vayu-frontend/src/pages';
const OLD_SRC = 'https://lh3.googleusercontent.com/aida/AEtjO1UbZQbHCawZXDGFtIKmpRXo931eYGa1yu09F2TNtdetaQRP5xxBAAWgQWMNFqFiQZ2poTjgkbzwfop5fcgF9z4EX1douStftS0Uy771DHiLPXw7afb4ezP5-yVdiZLuBy5WeGZdnmPgs7VMKeR08y6qfB71cSFJxCJ143Yzt4KIJNgPuyHxEPRSN6_e9C2uvZWtYbLRTBP4r4O-gaS7NUl3gZn_Z_vNX0yn-Px-Fd2JLsk5H2wW-Q3AdVM';
const NEW_SRC = '/vayu-logo.svg';

const files = fs.readdirSync(DIR).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(OLD_SRC)) {
    content = content.replaceAll(OLD_SRC, NEW_SRC);
    fs.writeFileSync(filePath, content);
    console.log(`✓ Fixed logo in: ${file}`);
  } else {
    console.log(`  No change: ${file}`);
  }
});
