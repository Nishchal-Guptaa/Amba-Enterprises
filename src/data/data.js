import {
  ShieldCheck,
  Award,
  BadgeDollarSign,
  PackageCheck,
  Headset,
} from "lucide-react";


export const strengths = [
  {
    id: "genuine",
    icon: ShieldCheck,
    title: "Genuine Products",
    description:
      "We supply only 100% authentic products sourced directly from authorized manufacturers and distributors.",
  },
  {
    id: "trusted",
    icon: Award,
    title: "Trusted Brands",
    description:
      "We partner with India's leading pipe and fitting brands to ensure you get the best quality every time.",
  },
  {
    id: "pricing",
    icon: BadgeDollarSign,
    title: "Competitive Pricing",
    description:
      "Get the best value for your money with our competitive pricing and transparent billing.",
  },
  {
    id: "bulk",
    icon: PackageCheck,
    title: "Bulk Supply",
    description:
      "Whether it's a small requirement or a large project, we handle bulk orders with timely delivery.",
  },
  {
    id: "support",
    icon: Headset,
    title: "Customer Support",
    description:
      "Our dedicated team is always ready to assist you with product selection, technical queries, and after-sales support.",
  },
];

export const productCategories = [
  {
    id: "pipes",
    name: "Pipes",
    description: "GI, MS, PVC, CPVC & UPVC pipes for every application",
    subcategories: [
      {
        name: "GI Pipes",
        description: "Galvanized Iron pipes for water supply and structural use",
        images: [
          { src: new URL("../assets/GI_Pipes.png", import.meta.url).href, caption: "GI Pipe Bundles" },
          { src: new URL("../assets/GI_pipes2.jpg", import.meta.url).href, caption: "GI Pipes" },
          { src: new URL("../assets/GI_pipes3.jpg", import.meta.url).href, caption: "GI Pipes" },
        ],
      },
      {
        name: "MS Pipes",
        description: "Mild Steel pipes for construction and industrial applications",
        images: [
          { src: new URL("../assets/ms_pipes.jpg", import.meta.url).href, caption: "MS Pipe Stock" },
          { src: new URL("../assets/ms_pipes2.png", import.meta.url).href, caption: "MS Pipe Bundles" },
          { src: new URL("../assets/ms_pipes3.jpg", import.meta.url).href, caption: "MS Pipes — Structural Grade" },
        ],
      },
      {
        name: "PVC Pipes",
        description: "Polyvinyl Chloride pipes for plumbing and drainage",
        images: [
          { src: new URL("../assets/PVC_fittings.jpeg", import.meta.url).href, caption: "PVC Pipe Range" },
          { src: new URL("../assets/pvc_pipes.png", import.meta.url).href, caption: "PVC Piping Solution" },
          { src: new URL("../assets/pvc_pipes2.jpg", import.meta.url).href, caption: "PVC Pipe Assortment" },
        ],
      },
      {
        name: "CPVC Pipes",
        description: "Chlorinated PVC pipes for hot and cold water systems",
        images: [
          { src: new URL("../assets/cpvc_pipes.png", import.meta.url).href, caption: "CPVC Piping System" },
          { src: new URL("../assets/astral_cpvc_pipes.jpeg", import.meta.url).href, caption: "CPVC Pipe & Fittings" },
          { src: new URL("../assets/astral_cpvc_pipes2.png", import.meta.url).href, caption: "CPVC Assembly" },
        ],
      },
      {
        name: "UPVC Pipes",
        description: "Unplasticized PVC pipes for pressure applications",
        images: [
          { src: new URL("../assets/uPVC_pipes.png", import.meta.url).href, caption: "UPVC Fittings" },
          { src: new URL("../assets/uPVC_pipes2.jpg", import.meta.url).href, caption: "UPVC Pipe System" },
          { src: new URL("../assets/PVC_fittings.jpeg", import.meta.url).href, caption: "UPVC Pipes" },
        ],
      },
    ],
  },
  {
    id: "fittings",
    name: "Fittings",
    description: "Complete range of pipe fittings for all connection needs",
    subcategories: [
      {
        name: "Tee",
        description: "T-shaped fittings for branching pipe connections",
        images: [
          { src: new URL("../assets/GI_Tee.png", import.meta.url).href, caption: "GI Tee Fittings" },
          { src: new URL("../assets/MS_tee.jpeg", import.meta.url).href, caption: "Tee — Various Sizes" },
        ],
      },
      {
        name: "90° Elbow",
        description: "90-degree elbow fittings for right-angle turns",
        images: [
          { src: new URL("../assets/gi_elbow.png", import.meta.url).href, caption: "GI 90° Elbow" },
          { src: new URL("../assets/ms_band.jpg", import.meta.url).href, caption: "PVC 90° Elbow" },
        ],
      },
      {
        name: "45° Elbow",
        description: "45-degree elbow fittings for angled connections",
        images: [
          { src: new URL("../assets/45_deg_cpvc.png", import.meta.url).href, caption: "45° Elbow — GI" },
          { src: new URL("../assets/45_deg_pvc.png", import.meta.url).href, caption: "45° Elbow Set" },
        ],
      },
      {
        name: "Union",
        description: "Union fittings for easy disconnection and maintenance",
        images: [
          { src: new URL("../assets/ms_union.jpeg", import.meta.url).href, caption: "GI Union Fittings" },
          { src: new URL("../assets/cpvc_union.jpeg", import.meta.url).href, caption: "Union — Various Sizes" },
        ],
      },
      {
        name: "Socket",
        description: "Socket fittings for joining pipes of same diameter",
        images: [
          { src: new URL("../assets/ms_socket.jpg", import.meta.url).href, caption: "Socket Fittings" },
          { src: new URL("../assets/pvc_socket.avif", import.meta.url).href, caption: "GI Socket Range" },
          { src: new URL("../assets/cpvc_socket.png", import.meta.url).href, caption: "PVC Socket" },
        ],
      },
      {
        name: "Cross Tee",
        description: "Four-way cross tee fittings",
        images: [
          { src: new URL("../assets/gi_cross.jpg", import.meta.url).href, caption: "Cross Tee Fittings" },
          { src: new URL("../assets/ms_cross.png", import.meta.url).href, caption: "GI Cross Tee" },
          { src: new URL("../assets/pvc_cross.jpg", import.meta.url).href, caption: "PVC Cross Tee" },
        ],
      },
      {
        name: "Nipple",
        description: "Nipple fittings for short pipe connections",
        images: [
          { src: new URL("../assets/gi_nipple.jpg", import.meta.url).href, caption: "GI Nipple Fittings" },
          { src: new URL("../assets/ms_nipple.jpg", import.meta.url).href, caption: "Nipple — Various Lengths" },
        ],
      },
      
      {
        name: "Bush",
        description: "Reducer bush fittings for different pipe diameters",
        images: [
          { src: new URL("../assets/ms_bush.jpeg", import.meta.url).href, caption: "Reducer Bush Fittings" },
          { src: new URL("../assets/pvc_bush.jpg", import.meta.url).href, caption: "GI Bush — Hex" },
          { src: new URL("../assets/cpvc_bush.jpg", import.meta.url).href, caption: "PVC Bush" },
        ],
      },
      {
        name: "Flanges",
        description: "Flange fittings for bolted pipe connections",
        images: [
          { src: new URL("../assets/flanges.png", import.meta.url).href, caption: "Flanges — Full Range" },
          { src: new URL("../assets/unik_flange.webp", import.meta.url).href, caption: "Flange Assortment" },
          { src: new URL("../assets/flanges.jpg", import.meta.url).href, caption: "GI Flanges" },
        ],
      },
      {
        name: "Reducing Sockets",
        description: "Reducing Sockets of various sizes",
        images: [
          { src: new URL("../assets/ms_reducer.jpg", import.meta.url).href, caption: "Reducing Sockets" },
          { src: new URL("../assets/pvc_reducer.jpg", import.meta.url).href, caption: "GI Reducing Socket" },
          { src: new URL("../assets/gi_reducer.jpeg", import.meta.url).href, caption: "PVC Reducing Socket" },
        ],
      },
    ],
  },
  {
    id: "welding-rods",
    name: "Welding Rods",
    description: "High-quality welding electrodes for superior welds",
    subcategories: [
      {
        name: "Mangalam Welding Electrods",
        description: "For everyday welding needs",
        images: [
          { src: new URL("../assets/mangalam.png", import.meta.url).href, caption: "Mangalam Welding Rods" },
          { src: new URL("../assets/mangalam2.jpeg", import.meta.url).href, caption: "Mangalam Welding Rods" },
          { src: new URL("../assets/mangalam3.jpeg", import.meta.url).href, caption: "Mangalam Welding Rods" },
        ],
      },
      {
        name: "L&T Welding Electrodes",
        description: "For solid welding",
        images: [
          { src: new URL("../assets/arcus.jpeg", import.meta.url).href, caption: "L&T Welding Electrodes" },
          { src: new URL("../assets/arcus2.jpg", import.meta.url).href, caption: "L&T  Welding Electrodes" },
          { src: new URL("../assets/arcus3.jpg", import.meta.url).href, caption: "L&T welding Electrodes" },
        ],
      },
    ],
  },
  {
    id: "solvents",
    name: "Solvents & Adhesives",
    description: "Pipe jointing solvents and adhesive solutions",
    images: [
      { src: new URL("../assets/cpvc_piping_sol.png", import.meta.url).href, caption: "CPVC Piping Solution" },
      { src: new URL("../assets/PVC_fittings.jpeg", import.meta.url).href, caption: "PVC Solvent Application" },
      { src: new URL("../assets/fittings.png", import.meta.url).href, caption: "Solvent Cement Range" },
    ],
    subcategories: [
      {
        name: "PVC Solvent Cement",
        description: "For bonding PVC pipes and fittings",
        images: [
          { src: new URL("../assets/PVC_fittings.jpeg", import.meta.url).href, caption: "PVC Solvent Cement" },
          { src: new URL("../assets/fittings.png", import.meta.url).href, caption: "PVC Bond Application" },
          { src: new URL("../assets/cpvc_piping_sol.png", import.meta.url).href, caption: "PVC Jointing" },
        ],
      },
      {
        name: "CPVC Solvent Cement",
        description: "For bonding CPVC pipes and fittings",
        images: [
          { src: new URL("../assets/cpvc_piping_sol.png", import.meta.url).href, caption: "CPVC Solvent Cement" },
          { src: new URL("../assets/PVC_fittings.jpeg", import.meta.url).href, caption: "CPVC Bond Solution" },
          { src: new URL("../assets/fittings.png", import.meta.url).href, caption: "CPVC Jointing" },
        ],
      },
      {
        name: "UPVC Solvent Cement",
        description: "For bonding UPVC pipes and fittings",
        images: [
          { src: new URL("../assets/fittings.png", import.meta.url).href, caption: "UPVC Solvent Cement" },
          { src: new URL("../assets/cpvc_piping_sol.png", import.meta.url).href, caption: "UPVC Bond" },
          { src: new URL("../assets/PVC_fittings.jpeg", import.meta.url).href, caption: "UPVC Jointing Solution" },
        ],
      },
    ],
  },
  {
    id: "valves",
    name: "Valves",
    description: "Valves for flow control in plumbing systems",
    subcategories: [
      {
        name: "Ball Valve",
        description: "Quarter-turn valves for on/off flow control",
        images: [
          { src: new URL("../assets/unik_ball.jpg", import.meta.url).href, caption: "Unik Ball Valve - SS, Brass, MS" },
          { src: new URL("../assets/cpvc_vall.png", import.meta.url).href, caption: "CPVC Ball Valve" },
          { src: new URL("../assets/zoloto_ball.jpg", import.meta.url).href, caption: "Zoloto Ball Valve" },
        ],
      },
      {
        name: "Float Valve with Ball",
        description: "Automatic water level control valves",
        images: [
          { src: new URL("../assets/unik_float.jpg", import.meta.url).href, caption: "Float Valve" },
          { src: new URL("../assets/float_ball.jpeg", import.meta.url).href, caption: "Float Valve Ball" },
        ],
      },
      {
        name: "Other Valves",
        description: "Lever-operated valves for flow control",
        images: [
          { src: new URL("../assets/unik_butterfly.jpeg", import.meta.url).href, caption: "Butterfly Valve" },
          { src: new URL("../assets/unik_horizontal.png", import.meta.url).href, caption: "Horizontal NRV" },
          { src: new URL("../assets/unik_prv.jpg", import.meta.url).href, caption: "PRV - Pressure Reducing Valve" },
        ],
      },
    ],
  },
];

export const galleryImages = [
  {
    id: 1,
    category: "products",
    src: "../src/assets/GI_and_MS_pipes.png",
    caption: "GI & MS Pipes Collection",
    alt: "Various GI and MS pipes stacked in warehouse",
  },
  {
    id: 2,
    category: "products",
    src: "../src/assets/PVC_fittings.jpeg",
    caption: "PVC Pipe Range",
    alt: "PVC pipes in different sizes",
  },
  {
    id: 3,
    category: "products",
    src: "../src/assets/fittings.png",
    caption: "Pipe Fittings Display",
    alt: "Various pipe fittings including elbows, tees, and unions",
  },
  {
    id: 4,
    category: "products",
    src: "../src/assets/cpvc_piping_sol.png",
    caption: "CPVC Piping Solutions",
    alt: "CPVC pipes and fittings arranged for display",
  },
  {
    id: 5,
    category: "products",
    src: "../src/assets/mangalam.png",
    caption: "Welding Rods Stock",
    alt: "Mangalam welding rods packages",
  },
  {
    id: 6,
    category: "warehouse",
    src: "../src/assets/warehouse_1.jpeg",
    caption: "Main Warehouse",
    alt: "Large warehouse with organized pipe storage",
  },
  {
    id: 7,
    category: "warehouse",
    src: "../src/assets/warehouse_2.jpeg",
    caption: "Storage Facility",
    alt: "Well-organized storage area with various products",
  },
  {
    id: 8,
    category: "warehouse",
    src: "../src/assets/warehouse_3.jpeg",
    caption: "Inventory Section",
    alt: "Neatly stacked inventory of pipes and fittings",
  },
  {
    id: 9,
    category: "office",
    caption: "Office Front",
    alt: "Amba Enterprises office entrance",
  },
  {
    id: 10,
    category: "office",
    caption: "Display Area",
    alt: "Product display area at the office",
  },
  {
    id: 13,
    category: "products",
    src: "../src/assets/unik_gi_fittings.png",
    caption: "Commercial Project Supply",
    alt: "Pipe supply for commercial construction project",
  },
  {
    id: 14,
    category: "products",
    src: "../src/assets/flanges.png",
    caption: "Infrastructure Project",
    alt: "Large diameter pipes for infrastructure project",
  },
  {
    id: 15,
    category: "products",
    caption: "Ball Valves Collection",
    alt: "Various sizes of ball valves",
  },
  {
    id: 16,
    category: "warehouse",
    caption: "Fittings Section",
    alt: "Organized fittings section in warehouse",
  },
];

export const companyInfo = {
  name: "Amba Enterprises",
  tagline: "Pipes | Fittings | Solutions",
  description:
    "Your trusted distributor and supplier of pipes, fittings, and industrial products in Gurugram.",
  address: "Bada Bazar, Basai Road, Gurugram, Haryana - 122001",
  phone: ["+91 9811103866"],
  phones: ["+91 9811103866"],
  email: "ajay_amba@ymail.com",
  hours: "9:30 AM to 7:30 PM (Mon - Sat)",
  hoursShort: "Mon-Sat: 9:30 AM - 7:30 PM",
  whatsapp: "9811103866",
  social: {
    instagram: "https://www.instagram.com/amba__enterprises/",
    // facebook: '#',
    linkedin: "https://www.linkedin.com/in/amba-enterprises-5764418b/",
  },
  mapUrl:
    "https://www.google.com/maps/search/Bada+Bazar+Basai+Road+Gurugram+Haryana",
  stats: {
    experience: "10+",
    yearsExperience: "10+",
    products: "100+",
    brands: "6+",
    customers: "1000+",
  },
};
