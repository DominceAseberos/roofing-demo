export interface PlanConfig {
  id: string
  title: string
  price: number
  priceDisplay: string
  billingType: string
  badge?: string
  description: string
  features: string[]
  checkoutNote: string
}

export interface ServiceItem {
  id: string
  title: string
  subtitle: string
  description: string
  highlights: string[]
  iconName: string
  badge?: string
  startingAt?: string
  linkedPlanId?: string
}

export interface RoofingConfig {
  company: {
    name: string
    legalName: string
    tagline: string
    phone: string
    emergencyPhone: string
    email: string
    address: string
    license: string
    yearsInBusiness: number
    rating: number
    reviewsCount: number
    whopAccountId: string
    appDomain: string
  }
  plans: {
    inspection: PlanConfig
    deposit: PlanConfig
    emergencyTarp: PlanConfig
  }
  services: ServiceItem[]
  financing: {
    headline: string
    subheadline: string
    lowMonthlyPayment: string
    aprRate: string
    supportedRails: string[]
    perks: string[]
  }
  serviceAreas: {
    primaryCity: string
    metroArea: string
    counties: string[]
    cities: string[]
    emergencyResponseTime: string
  }
  testimonials: {
    name: string
    location: string
    projectType: string
    rating: number
    text: string
    date: string
    verified: boolean
  }[]
  guarantees: {
    title: string
    description: string
  }[]
}

export const ROOFING_CONFIG: RoofingConfig = {
  company: {
    name: "Apex Ridge Roofing & Restoration",
    legalName: "Apex Ridge Roofing LLC",
    tagline: "High-Performance Roofing & Rapid Storm Restoration",
    phone: "(512) 890-ROOF",
    emergencyPhone: "(512) 900-LEAK",
    email: "service@apexridgeroofing.com",
    address: "8200 Stone Ridge Blvd, Suite 400, Austin, TX 78759",
    license: "TX License #ROC-384919 • Fully Bonded & $2M Insured",
    yearsInBusiness: 18,
    rating: 4.95,
    reviewsCount: 384,
    whopAccountId: "biz_kZ6a8AY0DzKYmL",
    appDomain: "doms-roofing-demo.whop.site",
  },
  plans: {
    inspection: {
      id: "plan_nMILcy1Wzx33K",
      title: "Roof Inspection & Condition Report",
      price: 149,
      priceDisplay: "$149.00",
      billingType: "One-time",
      badge: "Credited 100% Toward Repairs",
      description: "Full 21-point physical attic and surface inspection paired with 4K drone aerial mapping and insurer-ready damage report.",
      features: [
        "21-Point attic decking, ventilation & flashing diagnosis",
        "4K aerial drone scanning for hail impact & missing granules",
        "Comprehensive photo-documented condition report",
        "Itemized repair or replacement estimate valid for 60 days",
        "100% credited toward any repair or full replacement",
      ],
      checkoutNote: "Immediate booking confirmation • Inspector dispatched within 24-48 hours",
    },
    deposit: {
      id: "plan_n0z7fGWZKkC5B",
      title: "Project Deposit & Schedule Lock",
      price: 500,
      priceDisplay: "$500.00",
      billingType: "One-time Deposit",
      badge: "Secures Installation Date",
      description: "Locks your installation crew date, locks bulk shingle pricing, and files municipal permits. Includes card-on-file setup for final balance.",
      features: [
        "Guaranteed project start date locked with our master crew",
        "Protects against asphalt shingle & lumber price fluctuations",
        "Municipal permitting & HOA architectural submittals handled",
        "Card securely saved on file via Whop for milestone/final invoicing",
        "100% credited against your final project balance invoice",
      ],
      checkoutNote: "Card saved on file for automatic or 1-click final balance billing upon job completion",
    },
    emergencyTarp: {
      id: "plan_fU1oo9o697d1g",
      title: "Emergency Tarp Service",
      price: 750,
      priceDisplay: "$750.00",
      billingType: "Flat-rate Service",
      badge: "2-Hour Rapid Dispatch",
      description: "Heavy-duty 12-mil waterproof tarping secured with wooden battens to seal active leaks immediately with zero added roof penetrations.",
      features: [
        "2-Hour rapid storm dispatch for active water intrusion",
        "Heavy-duty 12-mil reinforced waterproof poly tarp",
        "Batten-secured perimeter (prevents additional shingle damage)",
        "Pre- and post-tarp high-res photos for your insurance adjuster",
        "Official Certificate of Emergency Mitigation provided",
      ],
      checkoutNote: "Emergency crews available 24/7 • Standard coverage up to 400 sq. ft. per section",
    },
  },
  services: [
    {
      id: "roof-repair",
      title: "Precision Roof Repair",
      subtitle: "Wind, hail & persistent leak solutions",
      description: "Fast, surgical repairs for missing shingles, compromised chimney flashing, valley leaks, and ventilation pipe boot failures before water rots your decking.",
      highlights: ["Same-day emergency leak diagnosis", "Exact shingle color & texture matching", "Underlayment & rotted decking replacement"],
      iconName: "Wrench",
      startingAt: "From $350",
    },
    {
      id: "roof-replacement",
      title: "Complete Roof Replacement",
      subtitle: "Lifetime architectural shingles & standing seam metal",
      description: "Full tear-off and replacement built to Texas windstorm standards. High-definition architectural shingles with synthetic underlayment and ice & water shield.",
      highlights: ["GAF Timberline HDZ® & Owens Corning Duration®", "Class 4 Impact Resistance for insurance discounts", "50-year non-prorated manufacturer warranty"],
      iconName: "Home",
      startingAt: "From $8,500",
      linkedPlanId: "plan_n0z7fGWZKkC5B",
    },
    {
      id: "roof-inspection",
      title: "Certified 21-Point Inspection",
      subtitle: "Physical + 4K drone aerial mapping",
      description: "Thorough inspection of your complete roof system: attic moisture, structural rafters, decking deflection, shingle adhesion, and storm hail impact.",
      highlights: ["Full digital report with high-res photos", "Insurance claim documentation prepared", "$149 fee credited 100% if work is done"],
      iconName: "SearchCheck",
      badge: "$149 Flat Fee",
      startingAt: "$149",
      linkedPlanId: "plan_nMILcy1Wzx33K",
    },
    {
      id: "emergency-tarp",
      title: "Emergency Tarp & Weather Seal",
      subtitle: "2-Hour emergency dispatch for active leaks",
      description: "Immediate emergency storm response to stop rain, tree limbs, or hail breach from destroying interior ceilings, insulation, and hardwood floors.",
      highlights: ["2-Hour guaranteed dispatch radius", "Insurance-approved mitigation protocol", "Prevents secondary mold & ceiling collapse"],
      iconName: "ShieldAlert",
      badge: "24/7 Rapid Response",
      startingAt: "$750",
      linkedPlanId: "plan_fU1oo9o697d1g",
    },
    {
      id: "commercial-roofing",
      title: "Commercial & Multi-Family Systems",
      subtitle: "TPO, EPDM, PVC and standing seam metal",
      description: "Low-slope flat roof installations and coatings for commercial warehouses, retail strips, and apartment communities with minimal business disruption.",
      highlights: ["Energy Star reflective cool roof systems", "Silicone & elastomeric roof coatings", "Scheduled preventative maintenance plans"],
      iconName: "Building2",
      startingAt: "Custom Bid",
    },
    {
      id: "gutters-ventilation",
      title: "Seamless Gutters & Solar Ventilation",
      subtitle: "High-capacity drainage & attic thermal management",
      description: "Custom seamless 6-inch aluminum gutters with oversized downspouts and solar-powered attic fans that cut attic heat by up to 30 degrees.",
      highlights: ["Heavy-gauge 0.032 aluminum seamless runs", "Micro-mesh gutter guard systems", "Lowers summer AC cooling loads"],
      iconName: "Droplets",
      startingAt: "From $1,200",
    },
  ],
  financing: {
    headline: "0% APR Financing & Flexible Payment Plans",
    subheadline: "Don't let budget stand between your family and a safe, watertight roof.",
    lowMonthlyPayment: "$189/mo",
    aprRate: "0% APR Available",
    supportedRails: ["Klarna", "Splitit", "Afterpay", "Affirm", "Apple Pay", "Google Pay", "Credit Card"],
    perks: [
      "Instant soft credit inquiry with zero score impact",
      "0% APR introductory plans for qualified homeowners",
      "Fixed monthly terms from 12 up to 84 months",
      "Seamlessly powered by Whop Payments - no paperwork or waiting weeks for bank approval",
      "Pay your project deposit and final balance through the same secure platform",
    ],
  },
  serviceAreas: {
    primaryCity: "Austin, TX",
    metroArea: "Greater Austin & Central Texas",
    counties: ["Travis County", "Williamson County", "Hays County", "Bastrop County", "Caldwell County"],
    cities: [
      "Austin",
      "Round Rock",
      "Cedar Park",
      "Georgetown",
      "Pflugerville",
      "Leander",
      "Buda",
      "Kyle",
      "Lakeway",
      "Bee Cave",
      "Dripping Springs",
      "Westlake Hills",
    ],
    emergencyResponseTime: "Under 120 minutes for active leak calls",
  },
  testimonials: [
    {
      name: "Marcus & Elena Sterling",
      location: "Lakeway, TX",
      projectType: "Full Architectural Roof Replacement ($16,400)",
      rating: 5,
      text: "After baseball-sized hail hit Lakeway, three different roofers knocked on our door with high-pressure tactics. Apex Ridge was completely transparent. We paid the $500 deposit on Whop, used Splitit financing for the balance, and their crew finished the entire 3,400 sq ft roof in two days. Flawless cleanup.",
      date: "October 2026",
      verified: true,
    },
    {
      name: "David K. Henderson",
      location: "Round Rock, TX",
      projectType: "Emergency Tarp + Ridge Vent Storm Repair ($1,850)",
      rating: 5,
      text: "A huge oak branch pierced our master bedroom roof at 11 PM on a Sunday during thunderstorm winds. We booked their Emergency Tarp service directly on Whop. Crew arrived in 75 minutes, sealed the breach, and saved our ceilings. The photo documentation made the insurance claim effortless.",
      date: "September 2026",
      verified: true,
    },
    {
      name: "Sarah Jenkins-Miller",
      location: "Austin (Mueller), TX",
      projectType: "21-Point Inspection & Chimney Flashing ($149 Inspection credited)",
      rating: 5,
      text: "We were selling our home and the buyer inspection flagged mystery moisture. Booked Apex Ridge's $149 inspection. Their 4K drone spotted cracked pipe collars immediately. They credited the $149 directly to the repair bill and provided a clean certification letter that closed our sale.",
      date: "October 2026",
      verified: true,
    },
    {
      name: "Robert & Maria Vasquez",
      location: "Cedar Park, TX",
      projectType: "Class 4 Impact Shingle Replacement ($14,800)",
      rating: 5,
      text: "Financing was a breeze through Whop Payments with Klarna. We upgraded to Class 4 shingles which cut our homeowner insurance premiums by 22% annually. Professional crew, magnetic sweep found every nail, and zero surprise fees.",
      date: "August 2026",
      verified: true,
    },
  ],
  guarantees: [
    {
      title: "25-to-50 Year Manufacturer Warranty",
      description: "Direct certified manufacturer warranties covering shingle defects, wind blow-off up to 130 MPH, and algae discoloration.",
    },
    {
      title: "10-Year No-Leak Workmanship Guarantee",
      description: "If our installation leaks for any reason over 10 years, we repair the roof and any affected interior at zero cost to you.",
    },
    {
      title: "100% Price Lock & Deposit Credit",
      description: "Your $500 project deposit locks your material and labor rates against inflation and is deducted in full from the final invoice.",
    },
    {
      title: "Clean Property Magnetic Guarantee",
      description: "Triple-pass magnetic sweeps of your yard, driveway, and flowerbeds. If you find more than 5 stray nails, we pay you $100 cash.",
    },
  ],
}
