import * as fs from 'fs';
import * as path from 'path';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'imagen-4.0-fast-generate-001';
const OUTPUT_DIR = '/Users/dave/clawd/damediaco-rebuild/public/projects';

const projects = [
  {
    filename: 'mykavabar.jpg',
    prompt: 'Modern web application interface showing a kava bar directory map with location pins, clean UI with teal accents, database listing cards, search functionality, professional screenshot aesthetic, dark navy background'
  },
  {
    filename: 'swipebetter.jpg',
    prompt: 'AI-powered dating profile optimization dashboard, before/after comparison interface, profile photo analysis, match rate statistics, modern SaaS design with charts and metrics, teal and navy color scheme'
  },
  {
    filename: 'llmfire.jpg',
    prompt: 'Multi-model AI comparison interface showing side-by-side chat responses, multiple LLM columns with chat bubbles, testing dashboard, tech-focused UI with code syntax highlighting, dark theme with teal highlights'
  },
  {
    filename: 'freetoolboxes.jpg',
    prompt: 'Grid of 50+ online tool icons and categories, developer tools collection interface, colorful icon set on dark background, calculator and conversion tools visible, modern web tools dashboard'
  },
  {
    filename: 'lobsterpad.jpg',
    prompt: 'macOS installer application window with lobster icon, clean Apple-style interface, installation progress, Gumroad product page aesthetic, professional Mac app design with teal accents'
  },
  {
    filename: 'blog-network.jpg',
    prompt: 'Multiple blog websites thumbnails in grid layout showing AISourceNews, KavaAtlas, BudgetSavvyGuide, cryptocurrency and sports content sites, multi-site network dashboard, professional blog previews'
  }
];

async function generateImage(prompt, outputPath) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: '4:3'
        }
      })
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  const base64 = data.predictions[0].bytesBase64Encoded;
  fs.writeFileSync(outputPath, Buffer.from(base64, 'base64'));
}

async function main() {
  console.log('API Key:', GEMINI_API_KEY ? 'Found' : 'MISSING!');
  
  if (!GEMINI_API_KEY) {
    console.log('Please set GEMINI_API_KEY environment variable');
    process.exit(1);
  }
  
  console.log('Output directory:', OUTPUT_DIR);
  console.log('');

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const project of projects) {
    const outputPath = path.join(OUTPUT_DIR, project.filename);
    console.log(`Generating ${project.filename}...`);
    console.log(`Prompt: ${project.prompt}`);
    
    try {
      await generateImage(project.prompt, outputPath);
      const stats = fs.statSync(outputPath);
      console.log(`✅ Generated: ${project.filename} (${(stats.size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.log(`❌ Failed: ${err.message}`);
    }
    console.log('');
  }

  console.log('Done!');
}

main();
