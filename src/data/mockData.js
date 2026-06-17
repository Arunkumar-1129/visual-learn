export const subjects = [
  {
    name: "Physics",
    chapters: ["Electromagnetic Induction", "Optics", "Thermodynamics"]
  },
  {
    name: "Biology",
    chapters: ["Human Heart & Circulation", "Cell Structure", "Photosynthesis"]
  },
  {
    name: "Chemistry",
    chapters: ["Periodic Table Trends", "Chemical Bonding", "Acids & Bases"]
  }
];

export const marketplaceModels = [
  {
    id: "animal-cell-001",
    name: "Animal Cell 3D",
    subject: "Biology",
    chapter: "Cell Structure",
    creator: "You",
    price: 399,
    purchases: 0,
    views: 0,
    description: "An interactive 3D model of an animal cell, showcasing the complex organelles suspended in cytoplasm. The cell membrane encases the cell, while the nucleus houses the genetic material. Other key organelles include mitochondria for energy production, endoplasmic reticulum, and golgi apparatus for protein packaging.",
    fileUrl: "/models/animal_cell.glb",
    parts: [] 
  },
  {
    id: "gen-001",
    name: "Electric Generator",
    subject: "Physics",
    chapter: "Electromagnetic Induction",
    creator: "Rohan Mehta",
    price: 499,
    purchases: 12,
    views: 340,
    description: "An electric generator converts mechanical energy into electrical energy using the principle of electromagnetic induction. The rotating rotor creates a changing magnetic flux through the stator coil, inducing an alternating current (AC) in the external circuit.",
    parts: [
      { name: "Rotor", color: "#5EEAD4", description: "Spins inside the magnetic field, generating EMF via electromagnetic induction." },
      { name: "Stator Coil", color: "#FBBF24", description: "Stationary coil that creates the magnetic field surrounding the rotor." },
      { name: "Carbon Brushes", color: "#94A3B8", description: "Conduct current from the spinning rotor to the external circuit." },
      { name: "Shaft", color: "#F5F5F0", description: "Connects to external power source and rotates the rotor at high speed." }
    ]
  },
  {
    id: "heart-001",
    name: "Human Heart",
    subject: "Biology",
    chapter: "Human Heart & Circulation",
    creator: "Ananya Iyer",
    price: 399,
    purchases: 8,
    views: 210,
    description: "The human heart is a muscular organ that acts as a double pump. It circulates oxygenated blood to the body through the left side and deoxygenated blood to the lungs through the right side, completing the systemic and pulmonary circulation loops.",
    fileUrl: "/models/human_heart.glb",
    parts: [
      { name: "Left Atrium", color: "#F472B6", description: "Receives oxygenated blood from the pulmonary veins coming from the lungs." },
      { name: "Right Atrium", color: "#60A5FA", description: "Receives deoxygenated blood returning from the body via the vena cava." },
      { name: "Left Ventricle", color: "#EF4444", description: "Pumps oxygenated blood through the aorta to supply the entire body." },
      { name: "Right Ventricle", color: "#3B82F6", description: "Pumps deoxygenated blood through the pulmonary artery to the lungs." }
    ]
  },
  {
    id: "motor-001",
    name: "DC Motor",
    subject: "Physics",
    chapter: "Electromagnetic Induction",
    creator: "Rohan Mehta",
    price: 449,
    purchases: 5,
    views: 120,
    description: "A DC motor converts electrical energy into mechanical (rotational) energy. When current flows through the armature coil inside the magnetic field of the field magnets, the Lorentz force causes the armature to rotate. The commutator reverses current every half rotation to maintain continuous spin.",
    parts: [
      { name: "Armature", color: "#5EEAD4", description: "Rotating coil that experiences electromagnetic force inside the magnetic field." },
      { name: "Field Magnet", color: "#FBBF24", description: "Produces the static magnetic field the armature rotates within." },
      { name: "Commutator", color: "#A1A1AA", description: "Reverses current direction every half rotation to maintain continuous spin." },
      { name: "Brushes", color: "#94A3B8", description: "Maintain sliding electrical contact with the rotating commutator segments." }
    ]
  },
  {
    id: "cell-001",
    name: "Plant Cell Structure",
    subject: "Biology",
    chapter: "Cell Structure",
    creator: "Priya Sharma",
    price: 349,
    purchases: 15,
    views: 480,
    fileUrl: "/models/plantcell/scene.gltf",
    parts: [
      { name: "Cell Wall", color: "#86EFAC", description: "Rigid outer layer providing structural support and protection to the plant cell." },
      { name: "Nucleus", color: "#C084FC", description: "Control center of the cell containing genetic material (DNA)." },
      { name: "Chloroplast", color: "#4ADE80", description: "Site of photosynthesis, converting sunlight into glucose energy." },
      { name: "Vacuole", color: "#67E8F9", description: "Large central vacuole storing water, nutrients, and waste products." }
    ]
  },
  {
    id: "optics-001",
    name: "Convex Lens & Optics",
    subject: "Physics",
    chapter: "Optics",
    creator: "Vikram Singh",
    price: 299,
    purchases: 20,
    views: 590,
    parts: [
      { name: "Convex Lens", color: "#7DD3FC", description: "Converging lens that bends parallel rays of light to a focal point." },
      { name: "Principal Axis", color: "#F5F5F0", description: "The central horizontal axis passing through the optical center of the lens." },
      { name: "Focal Point", color: "#FDE68A", description: "The point where parallel light rays converge after passing through the lens." },
      { name: "Ray Path", color: "#FCA5A5", description: "Demonstrates the path of light as it refracts through the curved lens surface." }
    ]
  },
  {
    id: "bond-001",
    name: "Chemical Bonding",
    subject: "Chemistry",
    chapter: "Chemical Bonding",
    creator: "Meera Nair",
    price: 379,
    purchases: 9,
    views: 260,
    parts: [
      { name: "Hydrogen Atom", color: "#FDE68A", description: "Simplest element with one proton and one electron, forms covalent bonds." },
      { name: "Oxygen Atom", color: "#F87171", description: "Has 6 valence electrons, needs 2 more to complete its outer shell." },
      { name: "Covalent Bond", color: "#5EEAD4", description: "Formed by sharing electron pairs between two non-metal atoms." },
      { name: "Electron Cloud", color: "#A78BFA", description: "Region around nucleus where electrons are most likely to be found." }
    ]
  }
];

export const initialClassrooms = [
  {
    id: "class-1",
    name: "Class 12-A Physics",
    code: "PHY12A-7X9",
    studentCount: 34,
    assignedModelIds: []
  },
  {
    id: "class-2",
    name: "Class 11-B Biology",
    code: "BIO11B-3K2",
    studentCount: 29,
    assignedModelIds: []
  }
];

export const creatorModelsInitial = [
  {
    id: "gen-001",
    name: "Electric Generator",
    subject: "Physics",
    chapter: "Electromagnetic Induction",
    price: 499,
    purchases: 12,
    views: 340,
    autoTagged: true
  },
  {
    id: "motor-001",
    name: "DC Motor",
    subject: "Physics",
    chapter: "Electromagnetic Induction",
    price: 449,
    purchases: 5,
    views: 120,
    autoTagged: true
  },
  {
    id: "optics-001",
    name: "Convex Lens & Optics",
    subject: "Physics",
    chapter: "Optics",
    price: 299,
    purchases: 20,
    views: 590,
    autoTagged: true
  }
];

export const earningsData = [
  { week: "Week 1", amount: 3480 },
  { week: "Week 2", amount: 5970 },
  { week: "Week 3", amount: 4290 },
  { week: "Week 4", amount: 7840 }
];

export const studentFeedback = [
  { student: "Aarav Patel", model: "Electric Generator", emoji: "🤩", comment: "Rotating parts made it so clear!" },
  { student: "Diya Krishnan", model: "DC Motor", emoji: "😊", comment: "Finally understand commutator action." },
  { student: "Rahul Verma", model: "Electric Generator", emoji: "🔥", comment: "Way better than textbook diagrams." },
  { student: "Sneha Gupta", model: "DC Motor", emoji: "💡", comment: "The 3D view helped me visualize the field." }
];
