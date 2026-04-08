import fs from 'fs';
import path from 'path';

const files = [
  'data/properties.ts',
  'data/blogPosts.ts',
  'components/home/Testimonials.tsx',
  'components/home/NeighborhoodMap.tsx',
  'components/properties/PropertyGrid.tsx',
  'components/footer-section.tsx',
  'components/LandingPage.tsx',
  'components/chatbot/EnquiryForm.tsx',
  'components/chatbot/ChatWidget.tsx',
  'app/properties/page.tsx',
  'app/properties/[slug]/page.tsx',
  'app/contact/page.tsx',
  'app/blog/page.tsx',
  'app/about/page.tsx',
  'app/about/[slug]/page.tsx'
];

const replacers = [
  // Prices
  [/\$4\.2M/g, '₹35 Cr'],
  [/\$9M/g, '₹75 Cr'],
  
  // Cities / Locations
  [/New York/g, 'Vasai'],
  [/NYC/g, 'Vasai'],
  [/Manhattan/g, 'Vasai'],
  [/Upper East Side/g, 'Suncity'],
  
  [/Dubai/g, 'Virar'],
  [/Downtown Virar/g, 'Virar West'],
  [/Burj Khalifa/g, 'Virar Landmark'],
  [/Emirates Hills/g, 'Global City'],
  [/Palm Jumeirah/g, 'Arnala'],
  
  [/Mumbai/g, 'Naigaon'],
  [/Bandra West/g, 'Naigaon East'],
  [/Bandra East/g, 'Naigaon East'],
  [/Bandra/g, 'Naigaon'],
  [/Juhu/g, 'Bhabola'],
  [/Worli/g, 'Juchandra'],
  [/South Naigaon/g, 'Naigaon South'],
  [/Andheri West/g, 'Naigaon West'],
  [/Andheri/g, 'Naigaon'],
  [/Powai/g, 'Evershine'],
  [/Cumballa Hill/g, 'Umela'],
  [/Cumballa/g, 'Umela'],
  
  [/Goa/g, 'Vasai'],
  [/Anjuna/g, 'Rangaon'],
  
  [/Monaco/g, 'Virar'],
  [/Lavant/g, 'Agashi'],
  [/Mediterranean/g, 'Vasai'],
  
  [/Raigad/g, 'Naigaon'],
  [/Alibaug/g, 'Naigaon'],
  
  [/Los Angeles/g, 'Vasai'],
  [/Beverly Hills/g, 'Bassein'],
  [/Bel Air/g, 'Stella'],
  [/Hollywood Hills/g, 'Tungareshwar'],

  [/London/g, 'Virar'],

  // Misc fixes
  [/Arabian Sea/g, 'Vasai Creek'],
  [/Central Park/g, 'Vasai Fort'],
];

for (const relPath of files) {
  const fullPath = path.resolve(process.cwd(), relPath);
  console.log('Checking', fullPath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    for (const [regex, replacement] of replacers) {
      content = content.replace(regex, replacement);
    }
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${relPath}`);
  } else {
    console.log(`Not found: ${relPath}`);
  }
}
