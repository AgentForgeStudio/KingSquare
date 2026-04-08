const fs = require('fs');

let text = fs.readFileSync('data/properties.ts', 'utf8');

const properties = [
  ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600607687931-cebfad2114ce?q=80&w=2070&auto=format&fit=crop'],
  ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=2070&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop'],
  ['https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?q=80&w=2070&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600573472550-8090b5e2765e?q=80&w=2070&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600585153490-76fb20a32601?q=80&w=2070&auto=format&fit=crop'],
  ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2084&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600585154526-990dced4ea0d?q=80&w=2070&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2070&auto=format&fit=crop'],
  ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop'],
  ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2134&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=2070&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600566753086-00f18efc2297?q=80&w=2070&auto=format&fit=crop'],
  ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2084&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600607687931-cebfad2114ce?q=80&w=2070&auto=format&fit=crop'],
  ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop', 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?q=80&w=2070&auto=format&fit=crop']
];

const agents = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2076&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1537511446984-935f663eb1f4?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2000&auto=format&fit=crop'
];

let propIndex = 0;
text = text.replace(/images:\s*\[[\s\S]*?\]\,/g, () => {
    let list = properties[propIndex % properties.length];
    propIndex++;
    return 'images: [\n' + list.map(item => `      '${item}'`).join(',\n') + '\n    ],';
});

let agentIndex = 0;
text = text.replace(/photo:\s*\'[^\']*\'/g, () => {
    let pic = agents[agentIndex % agents.length];
    agentIndex++;
    return `photo: '${pic}'`;
});

fs.writeFileSync('data/properties.ts', text);
console.log('Done replacement');
