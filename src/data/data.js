import {
  ShieldCheck,
  Award,
  BadgeDollarSign,
  PackageCheck,
  Headset,
} from 'lucide-react';

export const brands = [
  {
    id: 'unik',
    name: 'Unik',
    priority: true,
    description:
      'Unik is a leading manufacturer of high-quality plumbing and piping solutions. Known for their durable and reliable products, Unik offers a comprehensive range of pipes, fittings, and valves for residential, commercial, and industrial applications.',
    products: ['GI Fittings', 'CPVC Pipes and fittings', 'Connection Pipes', 'Health Faucets'],
    website: '#',
    color: '#0066CC',
  },
  {
    id: 'astral',
    name: 'Astral',
    priority: false,
    description:
      'Astral Pipes is one of India\'s leading manufacturers of plumbing and drainage systems. With cutting-edge technology and innovation, Astral offers CPVC, UPVC, and SWR piping systems trusted by professionals nationwide.',
    products: ['CPVC Pipes & Fittings', 'UPVC Pipes & Fittings', 'Adhesives'],
    website: '#',
    color: '#E31E24',
  },
  {
    id: 'supreme',
    name: 'Supreme',
    priority: false,
    description:
      'Supreme Industries is a pioneer in India\'s plastic piping industry. Their extensive product range includes PVC, CPVC, and UPVC pipes and fittings designed for plumbing, agricultural, and industrial applications.',
    products: ['PVC Pipes', 'CPVC Pipes', 'UPVC Pipes', 'Fittings', 'Solvents'],
    website: '#',
    color: '#003399',
  },
  {
    id: 'jindal-hissar',
    name: 'Jindal Hissar',
    priority: false,
    description:
      'Jindal Hissar (Jindal Industries) is a renowned manufacturer of GI and MS pipes. With state-of-the-art manufacturing facilities in Hisar, they produce high-quality steel pipes for construction, water supply, and structural applications.',
    products: ['GI Pipes', 'MS Pipes'],
    website: '#',
    color: '#CC0000',
    // note: 'Pipes Only',
  },
  {
    id: 'vs',
    name: 'VS',
    priority: false,
    description:
      'VS is a trusted name in MS (Mild Steel) pipes and fittings. Known for their strength and durability, VS products are widely used in construction, infrastructure, and industrial projects across India.',
    products: ['MS Fittings'],
    website: '#',
    color: '#1B5E20',
    // note: 'For MS',
  },
  {
    id: 'mangalam',
    name: 'Mangalam',
    priority: false,
    description:
      'Mangalam is a well-established brand in welding consumables. Their welding rods are known for superior arc stability, excellent weld quality, and consistent performance across various welding applications.',
    products: ['Welding Rods'],
    website: '#',
    color: '#FF6F00',
  },
];

export const strengths = [
  {
    id: 'genuine',
    icon: ShieldCheck,
    title: 'Genuine Products',
    description:
      'We supply only 100% authentic products sourced directly from authorized manufacturers and distributors.',
  },
  {
    id: 'trusted',
    icon: Award,
    title: 'Trusted Brands',
    description:
      'We partner with India\'s leading pipe and fitting brands to ensure you get the best quality every time.',
  },
  {
    id: 'pricing',
    icon: BadgeDollarSign,
    title: 'Competitive Pricing',
    description:
      'Get the best value for your money with our competitive pricing and transparent billing.',
  },
  {
    id: 'bulk',
    icon: PackageCheck,
    title: 'Bulk Supply',
    description:
      'Whether it\'s a small requirement or a large project, we handle bulk orders with timely delivery.',
  },
  {
    id: 'support',
    icon: Headset,
    title: 'Customer Support',
    description:
      'Our dedicated team is always ready to assist you with product selection, technical queries, and after-sales support.',
  },
];

export const productCategories = [
  {
    id: 'pipes',
    name: 'Pipes',
    description: 'GI, MS, PVC, CPVC & UPVC pipes for every application',
    icon: '🔧',
    subcategories: [
      { name: 'GI Pipes', description: 'Galvanized Iron pipes for water supply and structural use' },
      { name: 'MS Pipes', description: 'Mild Steel pipes for construction and industrial applications' },
      { name: 'PVC Pipes', description: 'Polyvinyl Chloride pipes for plumbing and drainage' },
      { name: 'CPVC Pipes', description: 'Chlorinated PVC pipes for hot and cold water systems' },
      { name: 'UPVC Pipes', description: 'Unplasticized PVC pipes for pressure applications' },
    ],
  },
  {
    id: 'fittings',
    name: 'Fittings',
    description: 'Complete range of pipe fittings for all connection needs',
    icon: '⚙️',
    subcategories: [
      { name: 'Tee', description: 'T-shaped fittings for branching pipe connections' },
      { name: '90° Elbow', description: '90-degree elbow fittings for right-angle turns' },
      { name: '45° Elbow', description: '45-degree elbow fittings for angled connections' },
      { name: 'Union', description: 'Union fittings for easy disconnection and maintenance' },
      { name: 'Socket', description: 'Socket fittings for joining pipes of same diameter' },
      { name: 'Cross Tee', description: 'Four-way cross tee fittings' },
      { name: 'Nipple', description: 'Nipple fittings for short pipe connections' },
      { name: 'Hex Nipple', description: 'Hexagonal nipple fittings for wrench-tight connections' },
      { name: 'Bush', description: 'Reducer bush fittings for different pipe diameters' },
      { name: 'Flanges', description: 'Flange fittings for bolted pipe connections' },
      { name: 'Reducing Sockets', description: 'Reducing Sockets of various sizes' },
    ],
  },
  {
    id: 'welding-rods',
    name: 'Mangalam Welding Rods',
    description: 'High-quality welding electrodes for superior welds',
    icon: '⚡',
    subcategories: [
      { name: 'General Purpose Electrodes', description: 'For everyday welding needs' },
      { name: 'Special Electrodes', description: 'For specialized welding applications' },
    ],
  },
  {
    id: 'solvents',
    name: 'Solvents & Adhesives',
    description: 'Pipe jointing solvents and adhesive solutions',
    icon: '🧪',
    subcategories: [
      { name: 'PVC Solvent Cement', description: 'For bonding PVC pipes and fittings' },
      { name: 'CPVC Solvent Cement', description: 'For bonding CPVC pipes and fittings' },
      { name: 'UPVC Solvent Cement', description: 'For bonding UPVC pipes and fittings' },
    ],
  },
  {
    id: 'valves',
    name: 'Valves',
    description: 'Valves for flow control in plumbing systems',
    icon: '🔩',
    subcategories: [
      { name: 'Ball Valve', description: 'Quarter-turn valves for on/off flow control' },
      { name: 'Float Valve with Ball', description: 'Automatic water level control valves' },
      { name: 'Butterfly Valve', description: 'Lever-operated valves for flow control' },
      { name: 'Check Valve', description: 'Non-return valves to prevent backflow' },
    ],
  },
];

export const galleryImages = [
  { id: 1, category: 'products', src: '../src/assets/GI_and_MS_pipes.png' , caption: 'GI & MS Pipes Collection', alt: 'Various GI and MS pipes stacked in warehouse' },
  { id: 2, category: 'products', src: '../src/assets/PVC_fittings.jpeg', caption: 'PVC Pipe Range', alt: 'PVC pipes in different sizes' },
  { id: 3, category: 'products', src: '../src/assets/fittings.png', caption: 'Pipe Fittings Display', alt: 'Various pipe fittings including elbows, tees, and unions' },
  { id: 4, category: 'products', src: '../src/assets/cpvc_piping_sol.png', caption: 'CPVC Piping Solutions', alt: 'CPVC pipes and fittings arranged for display' },
  { id: 5, category: 'products', src: '../src/assets/mangalam.png', caption: 'Welding Rods Stock', alt: 'Mangalam welding rods packages' },
  { id: 6, category: 'warehouse', src: '../src/assets/warehouse_1.jpeg', caption: 'Main Warehouse', alt: 'Large warehouse with organized pipe storage' },
  { id: 7, category: 'warehouse', src: '../src/assets/warehouse_2.jpeg', caption: 'Storage Facility', alt: 'Well-organized storage area with various products' },
  { id: 8, category: 'warehouse', src: '../src/assets/warehouse_3.jpeg', caption: 'Inventory Section', alt: 'Neatly stacked inventory of pipes and fittings' },
  { id: 9, category: 'office', caption: 'Office Front', alt: 'Amba Enterprises office entrance' },
  { id: 10, category: 'office', caption: 'Display Area', alt: 'Product display area at the office' },
  { id: 13, category: 'products', src:'../src/assets/unik_gi_fittings.png', caption: 'Commercial Project Supply', alt: 'Pipe supply for commercial construction project' },
  { id: 14, category: 'products', caption: 'Infrastructure Project', alt: 'Large diameter pipes for infrastructure project' },
  { id: 15, category: 'products', caption: 'Ball Valves Collection', alt: 'Various sizes of ball valves' },
  { id: 16, category: 'warehouse', caption: 'Fittings Section', alt: 'Organized fittings section in warehouse' },
];

export const companyInfo = {
  name: 'Amba Enterprises',
  tagline: 'Pipes | Fittings | Solutions',
  description: 'Your trusted distributor and supplier of pipes, fittings, and industrial products in Gurugram.',
  address: 'Bada Bazar, Basai Road, Gurugram, Haryana - 122001',
  phone: ['+91 9811103866'],
  phones: ['+91 9811103866'],
  email: 'ajay_amba@ymail.com',
  hours: '9:30 AM to 7:30 PM (Mon - Sat)',
  hoursShort: 'Mon-Sat: 9:30 AM - 7:30 PM',
  whatsapp: '9811103866',
  social: {
    instagram: 'https://www.instagram.com/amba__enterprises/',
    // facebook: '#',
    linkedin: 'https://www.linkedin.com/in/amba-enterprises-5764418b/',
  },
  mapUrl: 'https://www.google.com/maps/search/Bada+Bazar+Basai+Road+Gurugram+Haryana',
  stats: {
    experience: '10+',
    yearsExperience: '10+',
    products: '100+',
    brands: '6+',
    customers: '1000+',
  },
};
