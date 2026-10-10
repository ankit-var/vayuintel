import fs from 'fs';
import path from 'path';

const SRC_DIR = 'C:/Users/ankit/Downloads/stitch_air_quality_intelligence_platform/stitch_air_quality_intelligence_platform';
const DEST_DIR = 'C:/Users/ankit/Downloads/stitch_air_quality_intelligence_platform/vayu-frontend/src/pages';

const pages = [
  { dir: 'vayu_main_intelligence_dashboard', name: 'Dashboard' },
  { dir: 'vayu_live_station_telemetry', name: 'LiveTelemetry' },
  { dir: 'vayu_48h_aqi_predictive_forecast', name: 'Forecast' },
  { dir: 'vayu_pollution_source_intelligence', name: 'PollutionSource' },
  { dir: 'vayu_alerts_targeted_advisories', name: 'Alerts' },
  { dir: 'vayu_data_sources_model_transparency', name: 'Transparency' },
];

if (!fs.existsSync(DEST_DIR)) fs.mkdirSync(DEST_DIR, { recursive: true });

pages.forEach(page => {
  const htmlPath = path.join(SRC_DIR, page.dir, 'code.html');
  if (fs.existsSync(htmlPath)) {
    let html = fs.readFileSync(htmlPath, 'utf8');
    
    // Extract body
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      let bodyContent = bodyMatch[1];
      
      // Basic React JSX conversions
      bodyContent = bodyContent.replace(/class=/g, 'className=');
      bodyContent = bodyContent.replace(/for=/g, 'htmlFor=');
      bodyContent = bodyContent.replace(/<!--[\s\S]*?-->/g, ''); // Remove comments
      bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ''); // Remove scripts
      
      // Fix style attributes
      bodyContent = bodyContent.replace(/style="([^"]*)"/g, (match, p1) => {
        const parts = p1.split(';').filter(Boolean);
        const obj = {};
        parts.forEach(p => {
          // split only on first colon
          const firstColon = p.indexOf(':');
          if (firstColon !== -1) {
            const key = p.substring(0, firstColon).trim();
            const val = p.substring(firstColon + 1).trim();
            const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
            obj[camelKey] = val;
          }
        });
        return `style={${JSON.stringify(obj)}}`;
      });

      // Self-close tags like img, input, hr, br
      const voidElements = ['img', 'input', 'br', 'hr', 'link', 'meta'];
      voidElements.forEach(tag => {
        const regex = new RegExp(`(<${tag}\\b[^>]*)(?<!/)>`, 'gi');
        bodyContent = bodyContent.replace(regex, '$1 />');
      });

      const jsx = `
import React from 'react';
import { Link } from 'react-router-dom';

export default function ${page.name}() {
  return (
    <>
      ${bodyContent}
    </>
  );
}
`;
      fs.writeFileSync(path.join(DEST_DIR, `${page.name}.jsx`), jsx);
    }
  }
});
