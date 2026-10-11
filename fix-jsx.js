import fs from 'fs';
import path from 'path';

const DIR = 'C:/Users/ankit/Downloads/stitch_air_quality_intelligence_platform/vayu-frontend/src/pages';
const files = fs.readdirSync(DIR);

const replacements = [
  ['stroke-linecap', 'strokeLinecap'],
  ['stroke-width', 'strokeWidth'],
  ['stroke-dasharray', 'strokeDasharray'],
  ['preserveaspectratio', 'preserveAspectRatio'],
  ['viewbox', 'viewBox'],
  ['stop-color', 'stopColor'],
  ['stop-opacity', 'stopOpacity'],
  ['stroke-linejoin', 'strokeLinejoin'],
  ['fill-rule', 'fillRule'],
  ['clip-rule', 'clipRule'],
  ['charset', 'charSet'],
  ['autoplay', 'autoPlay'],
  ['playsinline', 'playsInline'],
  ['<svg ', '<svg '],
];

files.forEach(file => {
  if (file.endsWith('.jsx')) {
    let content = fs.readFileSync(path.join(DIR, file), 'utf8');
    
    // Replace SVG attrs
    replacements.forEach(([oldAttr, newAttr]) => {
      content = content.replace(new RegExp(oldAttr, 'gi'), newAttr);
    });

    const xmlTags = ['path', 'circle', 'stop', 'line', 'polygon', 'defs', 'linearGradient', 'svg', 'use', 'g', 'rect'];
    xmlTags.forEach(tag => {
      const regex = new RegExp(`(<${tag}\\b[^>]*)(?<!/)>`, 'gi');
      content = content.replace(regex, (match, p1) => {
        if (['path', 'circle', 'stop', 'line', 'polygon', 'rect'].includes(tag.toLowerCase())) {
          return `${p1} />`;
        }
        return match;
      });
    });
    
    // Quick fix for the nav links in the HTML
    content = content.replace(/href="#"/g, 'to="/"'); // temporary placeholder for Link, wait, it's an <a> tag
    content = content.replace(/<a /g, '<Link ');
    content = content.replace(/<\/a>/g, '</Link>');

    // Update specific Links
    content = content.replace(/to="\/" data-path="overview"/g, 'to="/"');
    content = content.replace(/to="\/" data-path="stations"/g, 'to="/live"');
    content = content.replace(/to="\/" data-path="forecast"/g, 'to="/forecast"');
    content = content.replace(/to="\/" data-path="attribution"/g, 'to="/sources"');
    content = content.replace(/to="\/" data-path="advisories"/g, 'to="/alerts"');
    content = content.replace(/to="\/" data-path="data-sources"/g, 'to="/transparency"');

    // DO NOT MANGLE STYLES HERE
    // The styles were properly JSON.stringify'd in convert.js, so they look like style={{"width":"34%"}} which is already valid React JSX!
    // I am just removing the mangling code that was here before.

    fs.writeFileSync(path.join(DIR, file), content);
  }
});
