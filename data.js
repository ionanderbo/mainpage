/* ==========================================================================
   Ion Ander Bolado — Portfolio & Lab Log Data Store
   Edit this file to add new Lab Log entries, update facts, or link live repos.
   ========================================================================== */

const PROFILE_DATA = {
  meta: {
    name: "Ion Ander Bolado",
    location: "Bilbao, Basque Country",
    institution: "University of Deusto",
    email: "ionander.bolado@opendeusto.es",
    linkedin: "https://linkedin.com/in/ionanderboladogracia",
    github: "https://github.com",
    tagline: "Biomedical Engineering · University of Deusto, Bilbao. Building towards clinical hardware, IP, and translational MedTech."
  },

  nav: [
    { href: "#about", label: "About", drawerLabel: "01 · About & Mobility", desc: "Deusto → DE / UK" },
    { href: "#projects", label: "Projects", drawerLabel: "02 · Engineering Work", desc: "CardioPatch, CT, EEG" },
    { href: "#log", label: "Lab Log", drawerLabel: "03 · Lab & Founder Log", desc: "Build-in-public notes" },
    { href: "#roadmap", label: "Roadmap", drawerLabel: "04 · Trajectory", desc: "TFG & MedTech R&D" },
    { href: "#focus", label: "Focus", drawerLabel: "05 · Core Domains", desc: "Hardware, IP & AI" }
  ],

  facts: [
    {
      label: "Home Institution",
      value: "Biomedical Engineering, University of Deusto (Bilbao, Basque Country)",
      highlight: false
    },
    {
      label: "Bachelor’s Thesis (TFG) Targets",
      value: "FAU Erlangen-Nürnberg, TUM, RWTH Aachen, or UK Golden Triangle labs",
      highlight: true
    },
    {
      label: "Languages & Discipline",
      value: "Spanish (Native) · English (C1) · German (B2/C1 Track · 6 hrs/week)",
      highlight: false
    },
    {
      label: "Campus & Outreach",
      value: "Student Representative & On-Call Open Day Speaker in Biomedical Engineering",
      highlight: false
    }
  ],

  /* Add new Lab & Founder's Log entries at the top of this array */
  labLog: [
    {
      date: "NOV 2026",
      category: "engineering",
      categoryLabel: "Hardware & Signals",
      highlight: false,
      title: "Shipping the CardioPatch Live ECG Simulator & Health 4.0 Architecture",
      body: "Built the interactive sinus-wave simulator and system comparison for CardioPatch with Group 06. Biggest clinical takeaway: cardiologists will abandon any continuous monitor that triggers false alerts during stair climbing—filtering normal sinus tachycardia on the edge is just as important as detecting ST-segment elevation."
    },
    {
      date: "NOV 2026",
      category: "mobility",
      categoryLabel: "Germany / Mobility",
      highlight: true,
      title: "6 Hours/Week German Sprint & TFG Lab Mapping",
      body: "Holding a steady six-hour weekly German study block alongside engineering coursework to hit B2/C1 readiness. Shortlisting research groups in surgical robotics, smart implants, and translational medical devices at FAU Erlangen-Nürnberg, TUM, and RWTH Aachen for my Bachelor’s Thesis."
    },
    {
      date: "OCT 2026",
      category: "engineering",
      categoryLabel: "Hardware & Signals",
      highlight: false,
      title: "Why Our CT Radiomics Mean Intensity Read −171.8 HU",
      body: "Post-mortem on our 3D Slicer lung nodule segmentation: the software output looked suspiciously low for a solid lesion until voxel-distribution checks showed 17.5% aerated lung tissue trapped along the segmentation border. Good reminder never to trust a radiomics feature table without inspecting the mask boundary first."
    },
    {
      date: "SEP 2026",
      category: "translation",
      categoryLabel: "Translation & IP",
      highlight: true,
      title: "Open-Day Speaking & Studying How Prototypes Survive Regulation",
      body: "Volunteering as an on-call speaker for University of Deusto open days while diving into EU MDR device classification, patent claim drafting, and early-stage life sciences venture mechanics—mapping what it takes to eventually build a Basque MedTech hardware company."
    }
  ],

  roadmap: [
    {
      kicker: "01 · NOW (BILBAO)",
      title: "Foundation at Deusto",
      body: "Building depth in medical imaging, biosignal processing, Python/R analytics, and patent literacy while studying German six hours every week."
    },
    {
      kicker: "02 · FOURTH YEAR ABROAD",
      title: "TFG in Germany or the UK",
      body: "Developing my Bachelor’s Thesis inside a leading biomedical research hub (FAU, TUM, RWTH Aachen, or UK Golden Triangle) to work directly on clinical hardware."
    },
    {
      kicker: "03 · LONG-TERM VENTURE",
      title: "MedTech R&D & Basque Startup",
      body: "Gain industry experience in device approval and commercialization, then build a MedTech company that creates engineering jobs and supports health-tech growth in the Basque Country."
    }
  ],

  focusPillars: [
    {
      kicker: "DOMAIN 01",
      title: "Medical Devices & Hardware",
      items: [
        "Surgical robotics & image-guided intervention",
        "Smart implants & wearable physiological sensors",
        "Biomechanics & ergonomic device enclosures"
      ]
    },
    {
      kicker: "DOMAIN 02",
      title: "Translational Medicine & IP",
      items: [
        "Moving prototypes from lab bench to hospital floor",
        "Intellectual property & patent claim architecture",
        "Life sciences venture capital & regulatory strategy"
      ]
    },
    {
      kicker: "DOMAIN 03",
      title: "AI & Diagnostic Software",
      items: [
        "Edge AI for low-false-alarm patient monitoring",
        "Medical image segmentation & radiomics",
        "Multichannel biosignal denoising & feature extraction"
      ]
    }
  ]
};
