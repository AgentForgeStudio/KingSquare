import os
import re

files = [
  'data/properties.ts',
  'data/blogPosts.ts',
  'components/home/Testimonials.tsx',
  'components/home/NeighborhoodMap.tsx',
  'components/properties/PropertyGrid.tsx',
  'components/footer-section.tsx',
  'components/LandingPage.tsx',
  'components/chatbot/EnquiryForm.tsx',
  'components/chatbot/ChatWidget.tsx',
  r'app/properties/page.tsx',
  r'app/properties/[slug]/page.tsx',
  r'app/contact/page.tsx',
  r'app/blog/page.tsx',
  r'app/about/page.tsx',
  r'app/about/[slug]/page.tsx'
]

replacers = [
  (r'\$4\.2M', '₹35 Cr'),
  (r'\$9M', '₹75 Cr'),
  (r'New York', 'Vasai'),
  (r'NYC', 'Vasai'),
  (r'Manhattan', 'Vasai'),
  (r'Upper East Side', 'Suncity'),
  (r'Dubai', 'Virar'),
  (r'Downtown Virar', 'Virar West'),
  (r'Burj Khalifa', 'Virar Landmark'),
  (r'Emirates Hills', 'Global City'),
  (r'Palm Jumeirah', 'Arnala'),
  (r'Mumbai', 'Naigaon'),
  (r'Bandra West', 'Naigaon East'),
  (r'Bandra East', 'Naigaon East'),
  (r'Bandra', 'Naigaon'),
  (r'Juhu', 'Bhabola'),
  (r'Worli', 'Juchandra'),
  (r'South Naigaon', 'Naigaon South'),
  (r'Andheri West', 'Naigaon West'),
  (r'Andheri', 'Naigaon'),
  (r'Powai', 'Evershine'),
  (r'Cumballa Hill', 'Umela'),
  (r'Cumballa', 'Umela'),
  (r'Goa', 'Vasai'),
  (r'Anjuna', 'Rangaon'),
  (r'Monaco', 'Virar'),
  (r'Lavant', 'Agashi'),
  (r'Mediterranean', 'Vasai'),
  (r'Raigad', 'Naigaon'),
  (r'Alibaug', 'Naigaon'),
  (r'Los Angeles', 'Vasai'),
  (r'Beverly Hills', 'Bassein'),
  (r'Bel Air', 'Stella'),
  (r'Hollywood Hills', 'Tungareshwar'),
  (r'London', 'Virar'),
  (r'Arabian Sea', 'Vasai Creek'),
  (r'Central Park', 'Vasai Fort'),
]

for file_path in files:
    full_path = os.path.join(os.getcwd(), os.path.normpath(file_path))
    if os.path.exists(full_path):
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()
        for pattern, repl in replacers:
            content = re.sub(pattern, repl, content)
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file_path}")
    else:
        print(f"Not found: {file_path}")
