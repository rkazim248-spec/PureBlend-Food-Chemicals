import { Product, IndustrySolution, B2BOffer, FAQItem, QualityBatchDoc, RFQSubmission, BannerSlide } from '@/types';

export const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 'slide-01',
    kicker: 'CERTIFIED FOOD CHEMICALS & INGREDIENT SYSTEMS',
    title: 'Reliable Ingredients for Better Food Solutions',
    description: 'PureBlend manufactures certified, high-purity food chemicals, hydrocolloids, and functional ingredient systems. From shelf-life extension to clean-label texture optimization, our batch-traceable supply chain ensures total regulatory compliance and batch-to-batch consistency.',
    ctaText: 'Explore Products',
    ctaLink: '/products',
    secondaryCtaText: 'Request a Quote',
    secondaryCtaLink: '/rfq',
    badgeText: 'LOT COMPLIANCE',
    badgeValue: '99.8% Certified',
    chemicalCode: 'PB-AC-01',
    chemicalPurity: '99.96% Purity Assay',
    active: true,
    order: 1,
    bgGradient: 'from-[#12372A] via-[#1a4a39] to-[#0D211A]',
    imageUrl: '/images/hero-facility.jpg'
  },
  {
    id: 'slide-02',
    kicker: 'CLEAN-LABEL RHEOLOGY & STABILIZATION',
    title: 'Precision Hydrocolloids & Texture Modifiers',
    description: 'Stabilize beverage suspensions, emulsify sauces, and prevent syneresis in dairy and plant-based matrices with our pharmaceutical-grade Xanthan Gum, HM/LM Pectins, and custom hydrocolloid systems.',
    ctaText: 'View Hydrocolloids',
    ctaLink: '/products?category=Hydrocolloids+%26+Stabilizers',
    secondaryCtaText: 'Download Spec Sheet',
    secondaryCtaLink: '/products/xanthan-gum-80-mesh',
    badgeText: 'VISCOSITY ASSAY',
    badgeValue: '1,520 mPa·s Guaranteed',
    chemicalCode: 'PB-HY-03',
    chemicalPurity: '100% Cold Soluble',
    active: true,
    order: 2,
    bgGradient: 'from-[#174D38] via-[#205E45] to-[#11382A]',
    imageUrl: '/images/hydrocolloid-texture.jpg'
  },
  {
    id: 'slide-03',
    kicker: 'MICROBIAL PRESERVATION & INTEGRITY',
    title: 'Broad-Spectrum Shelf-Life Extension Systems',
    description: 'Protect bakery, dairy, and liquid formulations with low-dust Potassium Sorbate, Calcium Propionate, and Sodium Benzoate. Engineered for rapid dissolution without organoleptic interference.',
    ctaText: 'Discover Preservatives',
    ctaLink: '/products?category=Preservatives',
    secondaryCtaText: 'Request Lot Samples',
    secondaryCtaLink: '/rfq',
    badgeText: 'FUNGISTATIC RATING',
    badgeValue: 'FCC XIII Compliant',
    chemicalCode: 'PB-PR-02',
    chemicalPurity: '99.6% Active Matter',
    active: true,
    order: 3,
    bgGradient: 'from-[#1B3E33] via-[#265345] to-[#0F261F]',
    imageUrl: '/images/lab-testing.jpg'
  },
  {
    id: 'slide-04',
    kicker: 'BULK INDUSTRIAL CONTRACT PROGRAMS',
    title: 'Custom Dry Blending & Guaranteed Supply Contracts',
    description: 'Secure multi-hub palletized inventory with quarterly price locks, standing purchase order buffers, and guaranteed 24-hour dispatch from our regional climate-controlled warehouses.',
    ctaText: 'View B2B Programs',
    ctaLink: '/offers',
    secondaryCtaText: 'Speak with Formulation Team',
    secondaryCtaLink: '/contact',
    badgeText: 'BUFFER INVENTORY',
    badgeValue: '12,000 MT Stored',
    chemicalCode: 'CONTRACT-Q4',
    chemicalPurity: 'Multi-Hub Dispatch',
    active: true,
    order: 4,
    bgGradient: 'from-[#143026] via-[#1E4537] to-[#0A1A14]',
    imageUrl: '/images/warehouse-logistics.jpg'
  }
];


export const PRODUCTS_DATA: Product[] = [
  {
    id: 'citric-acid-anhydrous',
    name: 'Citric Acid Anhydrous',
    code: 'PB-AC-01',
    category: 'Acidulants',
    casNumber: '77-92-9',
    insNumber: 'INS 330',
    grade: 'FCC (Food Grade)',
    shortDescription: 'Primary crystalline acidulant and pH control agent for beverages, confectionery, and dairy processing.',
    description: 'High-purity anhydrous citric acid produced via controlled submerged fermentation. Acts as an authentic flavor enhancer, natural preservative, and powerful chelating agent. Highly soluble with an immediate, sharp acidic profile.',
    appearance: 'White crystalline granules or powder, odorless',
    chemicalFormula: 'C6H8O7',
    molecularWeight: '192.12 g/mol',
    purity: '99.5% – 100.0%',
    phValue: '1.8 (5% aqueous solution @ 20°C)',
    moistureContent: '≤ 0.5%',
    meshSize: '12 – 40 Mesh (Standard Granular)',
    heavyMetals: '≤ 5 mg/kg (Lead ≤ 0.5 mg/kg, Arsenic ≤ 1.0 mg/kg)',
    shelfLife: '36 Months from production date',
    storageCondition: 'Store in cool, dry warehouse below 30°C and < 70% relative humidity. Keep containers tightly closed.',
    packagingOptions: [
      '25 kg multi-wall kraft paper bags with inner polyethylene liner',
      '1,000 kg FIBC jumbo bulk bags with discharge spout',
      'Stretch-wrapped and palletized (1,000 kg per wooden/plastic pallet)'
    ],
    minOrderQuantity: '1,000 kg (1 Metric Ton)',
    standardLeadTime: '5 – 7 Business Days',
    applications: [
      'Carbonated & still soft drinks',
      'Hard candies and sour confectionery',
      'Jams, jellies, and fruit preserves',
      'Processed cheese and dairy acidification',
      'Meat curing antioxidant stabilization'
    ],
    certifications: ['FCC 13 Compliant', 'ISO 22000:2018', 'HACCP', 'Halal Certified', 'Kosher Certified', 'Non-GMO Verified'],
    featured: true,
    stockStatus: 'In Stock',
    imageUrl: '/images/citric-acid.jpg'
  },
  {
    id: 'potassium-sorbate-granular',
    name: 'Potassium Sorbate Granular',
    code: 'PB-PR-02',
    category: 'Preservatives',
    casNumber: '24634-61-5',
    insNumber: 'INS 202',
    grade: 'FCC (Food Grade)',
    shortDescription: 'Broad-spectrum fungistatic agent inhibiting yeasts and molds across acidic to neutral food matrices.',
    description: 'Pure potassium salt of sorbic acid formulated in uniform extruded low-dust granules. Highly soluble in water compared to free sorbic acid. Effective across pH ranges up to 6.5, providing reliable microbial shelf-life extension without altering target organoleptic profiles.',
    appearance: 'Off-white to white cylindrical granules, low dusting',
    chemicalFormula: 'C6H7KO2',
    molecularWeight: '150.22 g/mol',
    purity: '99.0% – 100.0% (dry basis)',
    phValue: '8.5 – 10.5 (10% aqueous solution)',
    moistureContent: '≤ 1.0%',
    meshSize: 'Uniform 1.0 – 2.0 mm extruded granules',
    heavyMetals: '≤ 10 mg/kg (Lead ≤ 2.0 mg/kg, Arsenic ≤ 3.0 mg/kg)',
    shelfLife: '24 Months from production date',
    storageCondition: 'Protect from direct light and moisture. Store below 25°C in airtight original packaging.',
    packagingOptions: [
      '25 kg corrugated carton with inner heat-sealed PE bag',
      'Palletized: 40 cartons (1,000 kg) per shrink-wrapped export pallet'
    ],
    minOrderQuantity: '500 kg',
    standardLeadTime: '3 – 5 Business Days',
    applications: [
      'Bakery fillings, glazes, and tortillas',
      'Fruit juices, ciders, and still wines',
      'Processed cheeses, yogurts, and spreads',
      'Salad dressings, sauces, and culinary condiments'
    ],
    certifications: ['FCC 13 Compliant', 'FSSC 22000', 'Halal Certified', 'Kosher Certified', 'USP 43 Tested'],
    featured: true,
    stockStatus: 'In Stock',
    imageUrl: '/images/citric-acid.jpg'
  },
  {
    id: 'xanthan-gum-80-mesh',
    name: 'Xanthan Gum (80 & 200 Mesh)',
    code: 'PB-HC-03',
    category: 'Hydrocolloids & Stabilizers',
    casNumber: '11138-66-2',
    insNumber: 'INS 415',
    grade: 'FCC (Food Grade)',
    shortDescription: 'High-efficiency pseudoplastic polysaccharide providing emulsion stability, suspension, and freeze-thaw resilience.',
    description: 'Extracellular heteropolysaccharide produced by pure-culture fermentation of Xanthomonas campestris. Delivers outstanding pseudoplastic shear-thinning rheology with superior heat and acid stability across pH 2.0 to 12.0. Prevents syneresis in chilled and frozen formulations.',
    appearance: 'Cream-colored free-flowing powder',
    chemicalFormula: '(C35H49O29)n',
    molecularWeight: 'High Molecular Weight polymer (~2–4 MDa)',
    purity: 'Assay: 91.0% – 100.0%',
    phValue: '6.0 – 8.0 (1% aqueous solution)',
    moistureContent: '≤ 15.0%',
    meshSize: '80 Mesh (Fast dispersion) & 200 Mesh (Rapid hydration)',
    heavyMetals: 'Lead ≤ 2 mg/kg, Arsenic ≤ 3 mg/kg',
    shelfLife: '24 Months from production date',
    storageCondition: 'Store in dry ambient conditions. Prevent humidity exposure to avoid clumping.',
    packagingOptions: [
      '25 kg craft valve bags with interior polyethylene barrier',
      '900 kg pallet configuration with protective stretch hood'
    ],
    minOrderQuantity: '500 kg',
    standardLeadTime: '3 – 6 Business Days',
    applications: [
      'Pourable salad dressings and culinary sauces',
      'Gluten-free bakery structure stabilization',
      'Dairy alternatives and plant-based milks',
      'Beverage fruit pulp suspension'
    ],
    certifications: ['FCC Compliant', 'ISO 9001:2015', 'FSSC 22000', 'Halal Certified', 'Kosher Pareve'],
    featured: true,
    stockStatus: 'In Stock',
    imageUrl: '/images/hydrocolloid-texture.jpg'
  },
  {
    id: 'sodium-benzoate-prills',
    name: 'Sodium Benzoate (Prills & Powder)',
    code: 'PB-PR-04',
    category: 'Preservatives',
    casNumber: '532-32-1',
    insNumber: 'INS 211',
    grade: 'FCC (Food Grade)',
    shortDescription: 'Standard antimicrobial preservative for high-acid beverages, syrups, and preserved condiments.',
    description: 'Food-grade sodium salt of benzoic acid offered in virtually dust-free extruded prill form for rapid industrial dissolution. Optimally active below pH 4.5 against yeasts and bacterial strains in acidic food matrices.',
    appearance: 'White crystalline prills or fine powder',
    chemicalFormula: 'C7H5NaO2',
    molecularWeight: '144.11 g/mol',
    purity: '99.0% – 100.0% (dry basis)',
    phValue: '7.0 – 8.5 (10% aqueous solution)',
    moistureContent: '≤ 1.5%',
    meshSize: 'Prills (approx. 1 mm) or 60 Mesh Powder',
    heavyMetals: 'Lead ≤ 2 mg/kg, Arsenic ≤ 3 mg/kg',
    shelfLife: '24 Months',
    storageCondition: 'Store in cool, dry place. Keep closed to avoid moisture absorption.',
    packagingOptions: [
      '25 kg woven polypropylene bags with inner poly liner',
      '1,000 kg palletized (40 bags per pallet)'
    ],
    minOrderQuantity: '1,000 kg',
    standardLeadTime: '5 – 7 Business Days',
    applications: [
      'Carbonated beverages and concentrated drink bases',
      'Pickles, relishes, and acidified vegetable preserves',
      'Table syrups, dessert sauces, and fruit toppings'
    ],
    certifications: ['FCC 12 / USP 42', 'ISO 22000', 'Halal Certified', 'Kosher Certified'],
    featured: false,
    stockStatus: 'In Stock',
    imageUrl: '/images/citric-acid.jpg'
  },
  {
    id: 'calcium-propionate',
    name: 'Calcium Propionate Powder',
    code: 'PB-PR-05',
    category: 'Preservatives',
    casNumber: '4075-81-4',
    insNumber: 'INS 282',
    grade: 'FCC (Food Grade)',
    shortDescription: 'Effective antimycotic agent specifically designed for yeast-leavened bakery goods and dough systems.',
    description: 'High-purity calcium salt of propionic acid. Prevents rope-producing bacilli (Bacillus subtilis) and mold spoilage in sandwich bread, rolls, flatbreads, and baked snacks without impeding yeast fermentation activity when dosed properly.',
    appearance: 'White fine crystalline powder, faint propionic odor',
    chemicalFormula: 'C6H10CaO4',
    molecularWeight: '186.22 g/mol',
    purity: '≥ 99.0% (dry basis)',
    phValue: '7.5 – 9.0 (10% solution)',
    moistureContent: '≤ 5.0%',
    meshSize: '80 – 100 Mesh',
    heavyMetals: 'Lead ≤ 2 mg/kg, Fluoride ≤ 30 mg/kg',
    shelfLife: '24 Months',
    storageCondition: 'Dry warehouse storage below 28°C away from strong oxidizing chemicals.',
    packagingOptions: [
      '25 kg paper bags with moisture-resistant PE liner',
      'Stretch-wrapped export pallets'
    ],
    minOrderQuantity: '1,000 kg',
    standardLeadTime: '4 – 7 Business Days',
    applications: [
      'Commercial sliced pan bread and hamburger buns',
      'Tortillas and flatbread preservation',
      'Pastries, crusts, and dry cake mixes'
    ],
    certifications: ['FCC Food Grade', 'HACCP', 'Halal Certified', 'Kosher Certified'],
    featured: true,
    stockStatus: 'In Stock',
    imageUrl: '/images/hydrocolloid-texture.jpg'
  },
  {
    id: 'sodium-erythorbate',
    name: 'Sodium Erythorbate Crystalline',
    code: 'PB-AO-06',
    category: 'Antioxidants',
    casNumber: '6381-77-7',
    insNumber: 'INS 316',
    grade: 'FCC (Food Grade)',
    shortDescription: 'Industrial antioxidant and curing accelerator for meat processing, cured fish, and packaged deli products.',
    description: 'Stereoisomer of sodium ascorbate. Facilitates rapid nitric oxide formation from nitrite in meat emulsions, stabilizing cured pink color (nitrosomyoglobin) and preventing oxidation rancidity in processed proteins.',
    appearance: 'White to slightly yellow-white crystalline powder',
    chemicalFormula: 'C6H7NaO6·H2O',
    molecularWeight: '216.12 g/mol',
    purity: '98.0% – 100.0%',
    phValue: '5.5 – 8.0 (10% aqueous solution)',
    moistureContent: '≤ 0.25%',
    meshSize: '20 – 60 Mesh',
    heavyMetals: 'Lead ≤ 2 mg/kg, Arsenic ≤ 3 mg/kg',
    shelfLife: '24 Months from production date',
    storageCondition: 'Store in airtight containers protected from light, warmth, and humidity.',
    packagingOptions: [
      '25 kg cartons with double vacuum-sealed poly inner bags',
      'Palletized: 800 kg per wooden pallet'
    ],
    minOrderQuantity: '500 kg',
    standardLeadTime: '5 – 8 Business Days',
    applications: [
      'Frankfurters, sausages, and deli cold cuts',
      'Cured ham and bacon brine formulations',
      'Frozen seafood glazing antioxidant treatment'
    ],
    certifications: ['FCC 12 Compliant', 'ISO 22000', 'Halal Certified', 'Kosher Certified'],
    featured: false,
    stockStatus: 'In Stock',
    imageUrl: '/images/citric-acid.jpg'
  },
  {
    id: 'ascorbic-acid-fcc',
    name: 'Ascorbic Acid (Vitamin C)',
    code: 'PB-AO-07',
    category: 'Antioxidants',
    casNumber: '50-81-7',
    insNumber: 'INS 300',
    grade: 'FCC (Food Grade)',
    shortDescription: 'Multi-functional antioxidant, dough rheology improver, and vitamin fortifier for food processing.',
    description: 'High-purity crystalline L-ascorbic acid. Functions as an oxygen scavenger preventing enzymatic browning in fruit juices and processed cut fruits. In automated baking, acts as a rapid dough strengthener improving gas retention.',
    appearance: 'White crystalline powder or fine needles',
    chemicalFormula: 'C6H8O6',
    molecularWeight: '176.12 g/mol',
    purity: '99.0% – 100.0%',
    phValue: '2.1 – 2.6 (5% solution)',
    moistureContent: '≤ 0.1%',
    meshSize: '40 – 80 Mesh & 100 Mesh Ultra-fine',
    heavyMetals: 'Lead ≤ 0.5 mg/kg, Arsenic ≤ 1.0 mg/kg',
    shelfLife: '36 Months',
    storageCondition: 'Tight closure in light-resistant packaging. Moisture-free warehouse environment.',
    packagingOptions: [
      '25 kg cardboard drums or cartons with PE inner liner',
      'Palletized: 500 kg / 1,000 kg configurations'
    ],
    minOrderQuantity: '500 kg',
    standardLeadTime: '3 – 5 Business Days',
    applications: [
      'Flour treatment and commercial dough conditioners',
      'Fruit beverages, purées, and wine stabilization',
      'Nutritional vitamin C fortification in infant and adult foods'
    ],
    certifications: ['FCC 13', 'USP / Ph. Eur.', 'ISO 22000', 'Non-GMO', 'Halal', 'Kosher'],
    featured: true,
    stockStatus: 'In Stock',
    imageUrl: '/images/citric-acid.jpg'
  },
  {
    id: 'sapp-28-leavening',
    name: 'Sodium Acid Pyrophosphate (SAPP 28)',
    code: 'PB-LB-08',
    category: 'Leavening & Buffering Agents',
    casNumber: '7758-16-9',
    insNumber: 'INS 450(i)',
    grade: 'FCC (Food Grade)',
    shortDescription: 'Controlled-rate leavening acidulant with rate-of-reaction (ROR 28) for commercial refrigerated doughs and cakes.',
    description: 'Medium-reaction food-grade leavening phosphate. Releases gas steadily during dough mixing and upon heat activation in oven zones. Also acts as an anti-graying chelator for processed potato strips and seafood.',
    appearance: 'White fine powder',
    chemicalFormula: 'Na2H2P2O7',
    molecularWeight: '221.94 g/mol',
    purity: 'Assay (Na2H2P2O7): ≥ 95.0%',
    phValue: '3.8 – 4.4 (1% solution)',
    moistureContent: '≤ 0.5%',
    meshSize: '95% passes through 100 Mesh',
    heavyMetals: 'Fluoride ≤ 50 mg/kg, Lead ≤ 2 mg/kg',
    shelfLife: '24 Months',
    storageCondition: 'Store in dry surroundings. Tightly sealed to prevent hydrolysis into orthophosphate.',
    packagingOptions: [
      '25 kg multi-wall polyethylene-lined bags',
      '1,000 kg pallets shrink-wrapped'
    ],
    minOrderQuantity: '1,000 kg',
    standardLeadTime: '4 – 7 Business Days',
    applications: [
      'Chemical leavening in packaged cake mixes and donuts',
      'Canned refrigerated biscuit and roll doughs',
      'Color stabilization in par-fried French fry processing'
    ],
    certifications: ['FCC Food Grade', 'HACCP', 'Halal Certified', 'Kosher Certified'],
    featured: false,
    stockStatus: 'In Stock',
    imageUrl: '/images/hydrocolloid-texture.jpg'
  },
  {
    id: 'malic-acid-dl',
    name: 'DL-Malic Acid Granular',
    code: 'PB-AC-09',
    category: 'Acidulants',
    casNumber: '6915-15-7',
    insNumber: 'INS 296',
    grade: 'FCC (Food Grade)',
    shortDescription: 'Smooth lingering acidulant delivering rounded tartness and prolonged fruit flavor release.',
    description: 'Synthetic DL-malic acid providing a persistent, mellow tartness with a lower melting point and high solubility. Extensively paired with citric acid to smooth out harsh top-notes in apple, citrus, and berry formulations.',
    appearance: 'White crystalline powder or granular',
    chemicalFormula: 'C4H6O5',
    molecularWeight: '134.09 g/mol',
    purity: '≥ 99.5%',
    phValue: '2.2 (1% aqueous solution)',
    moistureContent: '≤ 0.3%',
    meshSize: '20 – 60 Mesh Granular',
    heavyMetals: 'Lead ≤ 2 mg/kg, Maleic Acid ≤ 0.05%',
    shelfLife: '24 Months',
    storageCondition: 'Cool, well-ventilated dry area. Reseal liners after sampling.',
    packagingOptions: [
      '25 kg craft bags with interior moisture protection',
      'Palletized: 1,000 kg'
    ],
    minOrderQuantity: '1,000 kg',
    standardLeadTime: '5 – 7 Business Days',
    applications: [
      'Low-calorie powdered drink mixes',
      'Fruit-flavored gummy candies and jellies',
      'Wine and cider acidity harmonization',
      'Fruit dessert glazes and pie fillings'
    ],
    certifications: ['FCC 12', 'USP Tested', 'Halal Certified', 'Kosher Certified'],
    featured: false,
    stockStatus: 'In Stock',
    imageUrl: '/images/citric-acid.jpg'
  },
  {
    id: 'monosodium-glutamate-fcc',
    name: 'Monosodium Glutamate (MSG 60 Mesh)',
    code: 'PB-FE-10',
    category: 'Flavor Enhancers & Sweeteners',
    casNumber: '142-47-2',
    insNumber: 'INS 621',
    grade: 'FCC (Food Grade)',
    shortDescription: 'Pure crystalline umami enhancer derived from fermented agricultural starch hydrolysates.',
    description: 'High-purity sodium salt of L-glutamic acid. Amplifies savory depth, meatiness, and brothy flavors in culinary preparations, enabling substantial dietary sodium reduction without sensory loss.',
    appearance: 'White columnar crystals, odorless',
    chemicalFormula: 'C5H8NNaO4·H2O',
    molecularWeight: '187.13 g/mol',
    purity: '≥ 99.0%',
    phValue: '6.7 – 7.2 (5% solution)',
    moistureContent: '≤ 0.5%',
    meshSize: '60 Mesh Standard Crystal',
    heavyMetals: 'Lead ≤ 1 mg/kg, Arsenic ≤ 0.5 mg/kg',
    shelfLife: '36 Months',
    storageCondition: 'Store in moisture-controlled warehouse environment.',
    packagingOptions: [
      '25 kg bags with poly liner',
      '1,000 kg jumbo tote bags'
    ],
    minOrderQuantity: '1,000 kg',
    standardLeadTime: '3 – 5 Business Days',
    applications: [
      'Bouillons, soups, and dehydrated soup bases',
      'Seasoning blends for potato chips and extruded snacks',
      'Processed poultry and meat injectables',
      'Ready-to-eat microwave culinary meals'
    ],
    certifications: ['FCC Food Grade', 'ISO 22000', 'Halal Certified', 'Kosher Certified'],
    featured: false,
    stockStatus: 'In Stock',
    imageUrl: '/images/citric-acid.jpg'
  },
  {
    id: 'pectin-hm-slow-set',
    name: 'Pectin (High Methoxyl - Slow Set)',
    code: 'PB-HC-11',
    category: 'Hydrocolloids & Stabilizers',
    casNumber: '9000-69-5',
    insNumber: 'INS 440',
    grade: 'FCC (Food Grade)',
    shortDescription: 'Standardized citrus-derived gelling agent for high-soluble solids jams, jellies, and confectionery.',
    description: 'Purified citrus peel pectin standardized with food-grade sucrose to guarantee uniform gel strength. Gels reliably in high-sugar matrices (SS > 60%) at acidic pH 2.8 – 3.4 with clean mouthfeel and brilliant optical clarity.',
    appearance: 'Off-white to light brown powder',
    chemicalFormula: 'Polygalacturonic acid methyl ester polymer',
    molecularWeight: 'Variable biopolymer (~100–200 kDa)',
    purity: 'Galacturonic Acid content ≥ 65%',
    phValue: '3.0 – 3.8 (1% aqueous solution)',
    moistureContent: '≤ 12.0%',
    meshSize: '60 – 80 Mesh Powder',
    heavyMetals: 'Lead ≤ 5 mg/kg, Arsenic ≤ 3 mg/kg',
    shelfLife: '24 Months',
    storageCondition: 'Cool, dry location away from moisture and heat sources.',
    packagingOptions: [
      '25 kg paper bags with moisture-proof polyethylene liner',
      '500 kg / 1,000 kg export pallets'
    ],
    minOrderQuantity: '250 kg',
    standardLeadTime: '5 – 8 Business Days',
    applications: [
      'Industrial fruit preserves and bakery deposit jams',
      'Fruit gummy pectin drops and jellied confectionery',
      'Acidified dairy and protein beverage stabilization'
    ],
    certifications: ['FCC 12', 'ISO 9001', 'Halal Certified', 'Kosher Certified'],
    featured: false,
    stockStatus: 'Limited Stock',
    imageUrl: '/images/hydrocolloid-texture.jpg'
  },
  {
    id: 'potassium-citrate-monohydrate',
    name: 'Tripotassium Citrate Monohydrate',
    code: 'PB-LB-12',
    category: 'Leavening & Buffering Agents',
    casNumber: '866-84-2',
    insNumber: 'INS 332(ii)',
    grade: 'FCC (Food Grade)',
    shortDescription: 'High-solubility buffering agent and potassium mineral nutrient for dairy and beverage stabilization.',
    description: 'Tribasic potassium salt of citric acid. Used to buffer acidic beverage systems, regulate acidity in dairy and soy beverages, and serve as an electrolyte source with lower sodium contribution.',
    appearance: 'White crystalline powder or granular crystals',
    chemicalFormula: 'C6H5K3O7·H2O',
    molecularWeight: '324.41 g/mol',
    purity: '99.0% – 100.0% (anhydrous basis)',
    phValue: '7.5 – 9.0 (5% aqueous solution)',
    moistureContent: '3.0% – 6.0%',
    meshSize: '20 – 60 Mesh Granular',
    heavyMetals: 'Lead ≤ 1 mg/kg, Arsenic ≤ 1 mg/kg',
    shelfLife: '36 Months',
    storageCondition: 'Store in dry place. Extremely deliquescent in damp air; reseal bag promptly.',
    packagingOptions: [
      '25 kg moisture-barrier multi-ply paper bags',
      '1,000 kg pallets'
    ],
    minOrderQuantity: '1,000 kg',
    standardLeadTime: '4 – 6 Business Days',
    applications: [
      'Dairy stability and milk evaporation heat resistance',
      'Low-sodium sports drinks and mineral waters',
      'Powdered nutritional supplements and meal replacements'
    ],
    certifications: ['FCC Food Grade', 'USP Grade', 'Halal Certified', 'Kosher Certified'],
    featured: false,
    stockStatus: 'In Stock',
    imageUrl: '/images/citric-acid.jpg'
  }
];

export const CATEGORIES_DATA: { name: Product['category']; count: number; description: string }[] = [
  { name: 'Acidulants', count: 2, description: 'High-purity organic acids for flavor sharpening, pH regulation, and preservation synergy.' },
  { name: 'Preservatives', count: 3, description: 'Food-grade antimycotics and broad-spectrum inhibitors for microbial shelf-life extension.' },
  { name: 'Hydrocolloids & Stabilizers', count: 2, description: 'Natural bio-polymers providing viscosity, texture suspension, and freeze-thaw durability.' },
  { name: 'Antioxidants', count: 2, description: 'Active oxygen scavengers preventing lipid rancidity and oxidative color deterioration.' },
  { name: 'Leavening & Buffering Agents', count: 2, description: 'Functional phosphates and citrate buffers for precise rate leavening and pH maintenance.' },
  { name: 'Flavor Enhancers & Sweeteners', count: 1, description: 'Crystalline umami stimulants and savory flavor enhancers for reduced-sodium recipes.' }
];

export const SOLUTIONS_DATA: IndustrySolution[] = [
  {
    id: 'beverage-systems',
    title: 'Beverage Formulation & Acid-Buffer Systems',
    subtitle: 'Stable pH curves, prolonged freshness, and clean tartness profiles for industrial beverage production.',
    description: 'In industrial beverage manufacturing, flavor perception hinges on the interplay between acidulants, buffering minerals, and microbial stabilizers. PureBlend supplies high-clarity citric acid, DL-malic acid, potassium citrate, and potassium sorbate engineered for automated continuous blending tanks without nozzle clogging or crystallization precipitation.',
    categoryTag: 'Beverage Manufacturing',
    functionalBenefits: [
      'Tailored tartness release curves balancing immediate bite and lingering finish',
      'Precise buffering prevents phase separation and off-flavor protein precipitation',
      'Sub-micron dissolved clarity avoiding turbidity in transparent packaging',
      'Fungistatic protection validated across cold-fill and pasteurized systems'
    ],
    keyProducts: ['citric-acid-anhydrous', 'malic-acid-dl', 'potassium-sorbate-granular', 'potassium-citrate-monohydrate'],
    recommendedIngredients: [
      { productId: 'citric-acid-anhydrous', productName: 'Citric Acid Anhydrous', role: 'Immediate tartness and pH reduction to ≤ 3.8' },
      { productId: 'malic-acid-dl', productName: 'DL-Malic Acid Granular', role: 'Lingering fruit note amplification and smoothing' },
      { productId: 'potassium-sorbate-granular', productName: 'Potassium Sorbate Granular', role: 'Low-dust antifungal preservation' }
    ],
    processConsiderations: 'Dissolve acidulants prior to preservative additions in high-shear blending tanks to ensure uniform dispersion before carbonation or bottling.',
    imageUrl: '/images/lab-testing.jpg'
  },
  {
    id: 'bakery-preservation',
    title: 'Bakery Preservation & Texture Stability',
    subtitle: 'Inhibit mold growth, optimize leavening reaction rates, and retain crumb softness.',
    description: 'High-speed industrial bakeries face strict shelf-life requirements while operating under tight oven cycles. PureBlend supplies mold-inhibiting calcium propionate and potassium sorbate alongside controlled-reaction Sodium Acid Pyrophosphate (SAPP 28) and dough-strengthening ascorbic acid.',
    categoryTag: 'Commercial Bakery',
    functionalBenefits: [
      'Extends commercial sliced bread shelf life up to 21+ days without flavor defect',
      'SAPP 28 provides predictable oven spring without premature bench leavening',
      'Ascorbic acid oxidizes sulfhydryl bonds to improve gluten dough elasticity',
      'Low-dust granular presentations protect factory operators during batch scaling'
    ],
    keyProducts: ['calcium-propionate', 'sapp-28-leavening', 'ascorbic-acid-fcc', 'xanthan-gum-80-mesh'],
    recommendedIngredients: [
      { productId: 'calcium-propionate', productName: 'Calcium Propionate Powder', role: 'Anti-mold and anti-rope protection in bread loaves' },
      { productId: 'sapp-28-leavening', productName: 'SAPP 28', role: 'Controlled rate-of-reaction leavening in baked goods' },
      { productId: 'ascorbic-acid-fcc', productName: 'Ascorbic Acid FCC', role: 'Gluten network strengthener and dough conditioner' }
    ],
    processConsiderations: 'Dose calcium propionate relative to flour weight (typically 0.2% – 0.5%) to maintain vigorous yeast fermentation while maximizing anti-mold longevity.',
    imageUrl: '/images/citric-acid.jpg'
  },
  {
    id: 'meat-processing',
    title: 'Meat & Seafood Curing and Color Stabilization',
    subtitle: 'Rapid cure acceleration, water binding, and oxidation prevention in commercial charcuterie.',
    description: 'In meat curing and vacuum-packaged poultry processing, color stability and lipid oxidation are critical quality benchmarks. PureBlend offers Sodium Erythorbate and Ascorbic Acid to rapidly reduce nitrite to nitric oxide, locking in the characteristic pink nitrosyl-hemochrome cure color and preventing rancidity.',
    categoryTag: 'Meat & Poultry Processing',
    functionalBenefits: [
      'Accelerates cured color development by up to 40% in smokehouse schedules',
      'Inhibits carcinogenic nitrosamine formation during high-temperature frying',
      'Antioxidant protection against rancid lipid notes in frozen storage',
      'Clean dissolving grade suitable for automated multi-needle brine injectors'
    ],
    keyProducts: ['sodium-erythorbate', 'ascorbic-acid-fcc', 'monosodium-glutamate-fcc'],
    recommendedIngredients: [
      { productId: 'sodium-erythorbate', productName: 'Sodium Erythorbate', role: 'Nitrite curing accelerator and antioxidant' },
      { productId: 'monosodium-glutamate-fcc', productName: 'MSG 60 Mesh', role: 'Deep umami reinforcement in low-sodium cured meat' }
    ],
    processConsiderations: 'Never mix sodium erythorbate directly with pure nitrites in dry form; dissolve into cold brine tank with continuous agitation.',
    imageUrl: '/images/warehouse-logistics.jpg'
  },
  {
    id: 'sauces-dressings',
    title: 'Dressings, Sauces & Culinary Emulsions',
    subtitle: 'Shear-thinning rheology, freeze-thaw durability, and microbiologically stable emulsification.',
    description: 'Pourable culinary dressings, mayonnaise variants, and ambient pasta sauces demand high emulsion stability under shipping vibrations and fluctuating warehouse temperatures. PureBlend supplies high-purity Xanthan Gum and food-grade acidulant blends that stabilize emulsions while providing ideal cling.',
    categoryTag: 'Culinary Sauces & Dressings',
    functionalBenefits: [
      'Outstanding pseudoplasticity: thins under shear for easy pouring, recovers thickness instantly on food',
      'Stable emulsion across severe pH drops and thermal hot-fill cycles',
      'Effective suspension of particulate spices, herbs, and garlic granules',
      'Dual preservative synergy using potassium sorbate and sodium benzoate'
    ],
    keyProducts: ['xanthan-gum-80-mesh', 'potassium-sorbate-granular', 'sodium-benzoate-prills', 'citric-acid-anhydrous'],
    recommendedIngredients: [
      { productId: 'xanthan-gum-80-mesh', productName: 'Xanthan Gum (80 & 200 Mesh)', role: 'Continuous phase viscosifier and spice suspension' },
      { productId: 'potassium-sorbate-granular', productName: 'Potassium Sorbate Granular', role: 'Mold/yeast barrier in ambient sauces' },
      { productId: 'citric-acid-anhydrous', productName: 'Citric Acid Anhydrous', role: 'pH depression below critical pathogen growth threshold' }
    ],
    processConsiderations: 'Pre-blend xanthan gum with oil or dry sugar before water hydration, or use high-shear eductors to prevent fish-eye agglomerations.',
    imageUrl: '/images/hydrocolloid-texture.jpg'
  }
];

export const OFFERS_DATA: B2BOffer[] = [
  {
    id: 'q4-annual-volume-contract',
    title: 'Annual Volume Contract Price Lock Program',
    badge: 'Supply Security',
    description: 'Commit to full containerload (FCL) quarterly allocations of primary acidulants and preservatives with guaranteed warehouse buffer stock and index-stabilized pricing.',
    volumeTier: 'Minimum 20 Metric Tons annual commitment',
    terms: [
      'Fixed baseline price protected against ocean freight spikes for 12 months',
      'Dedicated 30-day safety stock reserved in regional distribution hub',
      'Net 45 payment terms available upon completed credit assessment',
      'Free full-lot Certificate of Analysis (COA) testing package with every release'
    ],
    validityDate: 'Valid for supply contracts finalized through Q4 2026',
    status: 'Active',
    targetProducts: ['citric-acid-anhydrous', 'potassium-sorbate-granular', 'sodium-benzoate-prills'],
    inquiryCode: 'OFFER-VOL-2026'
  },
  {
    id: 'trial-evaluation-batch-program',
    title: 'Industrial Pilot Evaluation Batch Program',
    badge: 'R&D Pilot Support',
    description: 'Qualified food manufacturing plants and R&D facilities can request 50 kg – 100 kg pilot production batches at bulk pallet baseline rates with comprehensive technical support.',
    volumeTier: '50 kg to 250 kg evaluation quantities',
    terms: [
      'Complete analytical dossier included (Heavy metals, microbiological screen, FCC monograph)',
      '1-on-1 virtual formulation consultation with PureBlend food science specialists',
      'Credited back 100% against first commercial full-pallet order'
    ],
    validityDate: 'Ongoing qualification program',
    status: 'Active',
    targetProducts: ['xanthan-gum-80-mesh', 'pectin-hm-slow-set', 'sapp-28-leavening'],
    inquiryCode: 'OFFER-PILOT-LAB'
  },
  {
    id: 'consignment-buffer-stock-agreement',
    title: 'Vendor-Managed Inventory (VMI) Consignment',
    badge: 'Enterprise VMI',
    description: 'For certified production plants operating continuous multi-shift lines, PureBlend places on-site consignment buffer stock with payment upon inventory scan.',
    volumeTier: 'Tier 1 Food Producers (> 50 MT / month aggregate)',
    terms: [
      'Zero balance sheet carrying cost until lot consumption',
      'Automated replenishment triggers based on barcode consumption logs',
      'Zero stock-out guarantee backed by secondary regional warehouse redundant stock'
    ],
    validityDate: 'Subject to quarterly technical and credit review',
    status: 'Limited Availability',
    targetProducts: ['citric-acid-anhydrous', 'calcium-propionate', 'ascorbic-acid-fcc'],
    inquiryCode: 'OFFER-VMI-TIER1'
  }
];

export const FAQS_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Product Specifications',
    question: 'Are PureBlend food chemical ingredients compliant with FCC and USP standards?',
    answer: 'Yes. All ingredients designated as Food Grade adhere strictly to the current Food Chemicals Codex (FCC 12 / FCC 13) monographs and relevant USP/NF guidelines. Each production lot is assayed for active purity, heavy metals, microbial limits, and moisture prior to release.'
  },
  {
    id: 'faq-2',
    category: 'Product Specifications',
    question: 'What documentation accompanies each commercial shipment?',
    answer: 'Every delivery is accompanied by a batch-specific Certificate of Analysis (COA) referencing lot number, manufacturing date, and verified analytical test results. Technical Data Sheets (TDS), Safety Data Sheets (SDS), Non-GMO Declarations, Allergen Statements, and Kosher/Halal certificates are readily available via our client portal or upon request.'
  },
  {
    id: 'faq-3',
    category: 'Ordering & MOQs',
    question: 'What is the standard Minimum Order Quantity (MOQ) for commercial orders?',
    answer: 'Our standard commercial MOQ is 500 kg to 1,000 kg (1 pallet) for standard stocked items like Citric Acid and Potassium Sorbate. For pilot trials, qualified manufacturers can access our Evaluation Batch Program with lower MOQs of 50 kg to 250 kg.'
  },
  {
    id: 'faq-4',
    category: 'Ordering & MOQs',
    question: 'How do I request a formal quotation or contract price lock?',
    answer: 'You can submit an inquiry through our Request for Quotation (RFQ) tool on any product page or via the dedicated RFQ form. Provide your target volume, delivery port/incoterm, and packaging preference. Our commercial sales desk typically responds with a detailed quotation within 24 business hours.'
  },
  {
    id: 'faq-5',
    category: 'Logistics & Packaging',
    question: 'What packaging configurations and palletization options are available?',
    answer: 'Standard packaging consists of 25 kg multi-wall kraft paper bags with inner high-barrier polyethylene liners, palletized at 1,000 kg per pallet and heat-shrink wrapped for moisture protection. For high-volume automated plants, 900 kg – 1,000 kg FIBC jumbo bulk totes with discharge spouts are available.'
  },
  {
    id: 'faq-6',
    category: 'Quality & Compliance',
    question: 'Do your products carry Halal and Kosher certifications?',
    answer: 'Yes. The vast majority of PureBlend food chemicals carry recognized Halal and Kosher certifications issued by authorized international religious certification agencies. Specific certificates are provided with your lot documentation.'
  },
  {
    id: 'faq-7',
    category: 'Quality & Compliance',
    question: 'How are production lots traced in the event of an audit or recall verification?',
    answer: 'PureBlend operates an end-to-end barcode lot-tracking system conforming to ISO 22000 and FSMA standards. Every outgoing pallet displays a GS1-compliant lot identifier linked to raw material fermentation batches, internal lab testing logs, and carrier shipping bills.'
  },
  {
    id: 'faq-8',
    category: 'Logistics & Packaging',
    question: 'What standard Incoterms do you support for domestic and international shipments?',
    answer: 'We routinely execute contracts under EXW (Ex Works), FOB (Free on Board), CIF (Cost, Insurance, and Freight), and DDP (Delivered Duty Paid) to your manufacturing plant receiving dock.'
  }
];

export const INITIAL_RFQS: RFQSubmission[] = [
  {
    id: 'RFQ-8821',
    createdAt: '2026-10-08',
    companyName: 'Apex Beverage Bottlers Ltd.',
    contactName: 'Marcus Vance',
    email: 'm.vance@apexbev.com',
    phone: '+1 (555) 234-8901',
    country: 'United States',
    productId: 'citric-acid-anhydrous',
    productName: 'Citric Acid Anhydrous',
    requiredVolume: '40',
    volumeUnit: 'Metric Tons (MT)',
    preferredPackaging: '1,000 kg FIBC jumbo bulk bags',
    targetDeliveryDate: '2026-11-15',
    deliveryLocation: 'Atlanta Distribution Terminal, GA',
    incoterm: 'DDP',
    specialRequirements: 'Must include full heavy metals ICP-MS screen on COA. Weekly split deliveries of 10 MT.',
    status: 'Technical Review',
    estimatedValue: '$68,000'
  },
  {
    id: 'RFQ-8819',
    createdAt: '2026-10-07',
    companyName: 'Sunrise Commercial Bakeries',
    contactName: 'Elena Rostova',
    email: 'erostova@sunrisebakery.net',
    phone: '+1 (555) 872-4411',
    country: 'Canada',
    productId: 'calcium-propionate',
    productName: 'Calcium Propionate Powder',
    requiredVolume: '10',
    volumeUnit: 'Metric Tons (MT)',
    preferredPackaging: '25 kg bags palletized',
    targetDeliveryDate: '2026-11-01',
    deliveryLocation: 'Mississauga Facility, ON',
    incoterm: 'CIF',
    specialRequirements: 'Low-odor specification for sourdough bread line.',
    status: 'Quote Issued',
    estimatedValue: '$24,500'
  },
  {
    id: 'RFQ-8815',
    createdAt: '2026-10-06',
    companyName: 'Pacific Rim Culinary Foods',
    contactName: 'David Chen',
    email: 'd.chen@pacificrimculinary.com',
    phone: '+1 (555) 609-3382',
    country: 'United States',
    productId: 'xanthan-gum-80-mesh',
    productName: 'Xanthan Gum (80 & 200 Mesh)',
    requiredVolume: '3',
    volumeUnit: 'Pallets',
    preferredPackaging: '25 kg bags',
    targetDeliveryDate: '2026-10-25',
    deliveryLocation: 'Los Angeles, CA',
    incoterm: 'FOB',
    specialRequirements: 'Require 200 Mesh variant for fast dispersion salad dressing line.',
    status: 'Pending Review',
    estimatedValue: '$18,900'
  }
];

export const QUALITY_BATCH_DOCS: QualityBatchDoc[] = [
  {
    id: 'COA-2026-8910',
    batchNumber: 'LOT-PB-2610-014',
    productId: 'citric-acid-anhydrous',
    productName: 'Citric Acid Anhydrous',
    manufacturingDate: '2026-09-12',
    expiryDate: '2029-09-11',
    releaseDate: '2026-09-16',
    testingLab: 'PureBlend Central Analytical Lab (ISO 17025 Accredited)',
    assayResult: '99.88% (FCC Limit 99.5 – 100.0%)',
    status: 'Released'
  },
  {
    id: 'COA-2026-8911',
    batchNumber: 'LOT-PB-2609-082',
    productId: 'potassium-sorbate-granular',
    productName: 'Potassium Sorbate Granular',
    manufacturingDate: '2026-09-20',
    expiryDate: '2028-09-19',
    releaseDate: '2026-09-24',
    testingLab: 'PureBlend Quality Assurance QA-3',
    assayResult: '99.64% (FCC Limit 99.0 – 100.0%)',
    status: 'Released'
  },
  {
    id: 'COA-2026-8912',
    batchNumber: 'LOT-PB-2610-003',
    productId: 'xanthan-gum-80-mesh',
    productName: 'Xanthan Gum (80 Mesh)',
    manufacturingDate: '2026-09-28',
    expiryDate: '2028-09-27',
    releaseDate: '2026-10-02',
    testingLab: 'Microbial & Rheology Testing Center',
    assayResult: 'Viscosity: 1,520 mPa·s (1% KCl solution)',
    status: 'Released'
  },
  {
    id: 'COA-2026-8913',
    batchNumber: 'LOT-PB-2610-044',
    productId: 'calcium-propionate',
    productName: 'Calcium Propionate Powder',
    manufacturingDate: '2026-10-02',
    expiryDate: '2028-10-01',
    releaseDate: '2026-10-06',
    testingLab: 'PureBlend Analytical Microbiology Lab',
    assayResult: '99.40% (FCC Limit ≥ 99.0%)',
    status: 'Released'
  }
];
