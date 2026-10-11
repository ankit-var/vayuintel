import fs from 'fs';
import path from 'path';

const DIR = 'C:/Users/ankit/Downloads/stitch_air_quality_intelligence_platform/vayu-frontend/src/pages';
const files = fs.readdirSync(DIR);

// Nav link corrections: data-path -> correct route
const navLinkMap = {
  'data-path="overview"': 'to="/"',
  'data-path="stations"': 'to="/live"',
  'data-path="forecast"': 'to="/forecast"',
  'data-path="attribution"': 'to="/sources"',
  'data-path="advisories"': 'to="/alerts"',
  'data-path="data-sources"': 'to="/transparency"',
};

files.forEach(file => {
  if (!file.endsWith('.jsx')) return;
  let content = fs.readFileSync(path.join(DIR, file), 'utf8');
  const original = content;

  // Step 1: Fix all nav Link targets that still incorrectly say to="/"
  // Pattern: <Link ... data-path="X" to="/"> → <Link ... data-path="X" to="/correct">
  // We need to replace to="/" ONLY when preceded by data-path="X" in the same element.
  // Approach: find each Link element in the nav and rewrite it.
  Object.entries(navLinkMap).forEach(([dataProp, correctTo]) => {
    // Match <Link ... data-path="X" ... to="..."> or <Link ... to="..." ... data-path="X" ...>
    // Replace to="..." value when this data-path is present in the same tag.
    // We'll do a targeted replacement per data-path.
    const escaped = dataProp.replace(/"/g, '\\"');
    // Replace: within any Link tag that has this data-path, fix its to=""
    content = content.replace(
      new RegExp(`(<Link[^>]*${dataProp.replace(/["()]/g, c => '\\' + c)}[^>]*?)to="[^"]*"`, 'g'),
      `$1${correctTo}`
    );
    // Also handle case where to comes before data-path
    content = content.replace(
      new RegExp(`(to="[^"]*")([^>]*${dataProp.replace(/["()]/g, c => '\\' + c)})`, 'g'),
      `${correctTo}$2`
    );
  });

  // Step 2: For flex rows in header that have title + badge side by side,
  // add min-w-0 to the title container where it's a bare div without it
  // (This is purely JSX-level and handled in CSS; skip here.)

  // Step 3: Fix the "Trend & Ensemble Forecast" h2 HTML entity
  content = content.replace(/Trend &amp; Ensemble Forecast/g, 'Trend & Ensemble Forecast');
  content = content.replace(/Boundary Layer &amp; Meteorology/g, 'Boundary Layer & Meteorology');
  content = content.replace(/Data Provenance &amp; Scientific Protocol/g, 'Data Provenance & Scientific Protocol');

  if (content !== original) {
    fs.writeFileSync(path.join(DIR, file), content);
    console.log(`Fixed: ${file}`);
  } else {
    console.log(`No changes: ${file}`);
  }
});
