/* ==========================================================================
   Ion Ander Bolado — Default Seed Data Store
   Used automatically before Supabase is connected and as initial seed entries.
   ========================================================================== */

const DEFAULT_DATA = {
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

  projects: [
    {
      id: "seed-proj-cardiopatch",
      status_label: "Featured Concept & Prototype",
      title: "CardioPatch: 24/7 Wearable Cardiac Patch for Silent Heart Attack Warning",
      summary: "Co-designed in a 4-person biomedical engineering team (Group 06, University of Deusto) to solve a clear clinical gap: nearly 45% of myocardial infarctions occur without classic chest pain, while retrospective Holter patches only report data days later.",
      details: "We architected a reusable IP67 shower-proof electronics hub paired with disposable hypoallergenic silicone patches. Guided by stakeholder interviews with cardiology and cardiac rehab nursing, the system runs lightweight on-device AI to suppress false alarms during stair climbing while escalating real ST-segment shifts and skin-temperature drops with a 30-second ECG strip.",
      tags: ["Edge AI", "Biosignals", "Health 4.0", "IP67 Wearable"],
      accent_color: "#d95d39",
      primary_link_url: "#ecg-demo",
      primary_link_label: "Test Live ECG Demo",
      secondary_link_url: "",
      secondary_link_label: "",
      media_url: "",
      media_name: "",
      widget_type: "cardiopatch"
    },
    {
      id: "seed-proj-ct",
      status_label: "Medical Imaging & Radiomics",
      title: "Lung Nodule Characterisation & CT-Guided Biopsy Planning",
      summary: "Segmented a solid pulmonary nodule on chest CT in 3D Slicer, reconstructed a 3D anatomical model, planned a single-pleura-crossing needle path avoiding ribs and major vessels, recovered a 10 mm simulated displacement via mutual-information rigid registration, and extracted radiomic features.",
      details: "Critical limits learned: A raw mean intensity of −171.8 HU looked artificially low for soft tissue because 17.5% of segmented voxels captured aerated lung along the boundary rim. At ~18 mm equivalent diameter, the lesion exceeds the 8 mm Fleischner threshold, justifying biopsy planning while highlighting the need for respiratory motion compensation.",
      tags: ["3D Slicer", "Python", "Radiomics", "Rigid Registration", "Chest CT"],
      accent_color: "#0d7a6d",
      primary_link_url: "",
      primary_link_label: "",
      secondary_link_url: "",
      secondary_link_label: "",
      media_url: "",
      media_name: "",
      widget_type: "ct_biopsy"
    },
    {
      id: "seed-proj-eeg",
      status_label: "Signal Processing",
      title: "EEG Signal Quality & Artifact Rejection",
      summary: "Audited sampling and aliasing, ranked 14 scalp channels by electrode contact quality, applied a 1–40 Hz bandpass filter, and isolated ocular eye-blink artifacts using synchronous accelerometer data. Removing a single noisy electrode (P7) rescued recording usability from 26.60% to over 70%.",
      details: "",
      tags: ["Python", "Signal Processing", "14-Ch EEG"],
      accent_color: "#0d7a6d",
      primary_link_url: "",
      primary_link_label: "",
      secondary_link_url: "",
      secondary_link_label: "",
      media_url: "",
      media_name: "",
      widget_type: "eeg"
    },
    {
      id: "seed-proj-alzheimers",
      status_label: "In Progress",
      title: "Alzheimer’s Disease Clinical Data Explorer",
      summary: "Cleaning, structuring, and modeling clinical and lifestyle biomarkers across 2,149 patient records in R using dplyr and ggplot2 to identify which non-invasive variables best separate diagnosed patients from controls.",
      details: "Built to explore how multivariate clinical screening tools can flag early cognitive decline before late-stage symptoms appear.",
      tags: ["R", "dplyr", "ggplot2", "Clinical Data"],
      accent_color: "#d95d39",
      primary_link_url: "https://www.kaggle.com/datasets/rabieelkharoua/alzheimers-disease-dataset",
      primary_link_label: "Dataset on Kaggle",
      secondary_link_url: "https://github.com",
      secondary_link_label: "Code on GitHub",
      media_url: "",
      media_name: "",
      widget_type: "standard"
    }
  ],

  labLog: [
    {
      id: "seed-log-1",
      date_label: "NOV 2026",
      category: "engineering",
      category_label: "Hardware & Signals",
      title: "Shipping the CardioPatch Live ECG Simulator & Health 4.0 Architecture",
      body: "Built the interactive sinus-wave simulator and system comparison for CardioPatch with Group 06. Biggest clinical takeaway: cardiologists will abandon any continuous monitor that triggers false alerts during stair climbing—filtering normal sinus tachycardia on the edge is just as important as detecting ST-segment elevation.",
      tags: ["CardioPatch", "Edge AI", "ECG"],
      accent_color: "#0d7a6d",
      link_url: "",
      link_label: "",
      media_url: "",
      media_name: ""
    },
    {
      id: "seed-log-2",
      date_label: "NOV 2026",
      category: "mobility",
      category_label: "Germany / Mobility",
      title: "6 Hours/Week German Sprint & TFG Lab Mapping",
      body: "Holding a steady six-hour weekly German study block alongside engineering coursework to hit B2/C1 readiness. Shortlisting research groups in surgical robotics, smart implants, and translational medical devices at FAU Erlangen-Nürnberg, TUM, and RWTH Aachen for my Bachelor’s Thesis.",
      tags: ["German B2/C1", "TFG", "FAU", "TUM", "RWTH"],
      accent_color: "#d95d39",
      link_url: "",
      link_label: "",
      media_url: "",
      media_name: ""
    },
    {
      id: "seed-log-3",
      date_label: "OCT 2026",
      category: "engineering",
      category_label: "Hardware & Signals",
      title: "Why Our CT Radiomics Mean Intensity Read −171.8 HU",
      body: "Post-mortem on our 3D Slicer lung nodule segmentation: the software output looked suspiciously low for a solid lesion until voxel-distribution checks showed 17.5% aerated lung tissue trapped along the segmentation border. Good reminder never to trust a radiomics feature table without inspecting the mask boundary first.",
      tags: ["3D Slicer", "Radiomics", "CT"],
      accent_color: "#0d7a6d",
      link_url: "",
      link_label: "",
      media_url: "",
      media_name: ""
    },
    {
      id: "seed-log-4",
      date_label: "SEP 2026",
      category: "translation",
      category_label: "Translation & IP",
      title: "Open-Day Speaking & Studying How Prototypes Survive Regulation",
      body: "Volunteering as an on-call speaker for University of Deusto open days while diving into EU MDR device classification, patent claim drafting, and early-stage life sciences venture mechanics—mapping what it takes to eventually build a Basque MedTech hardware company.",
      tags: ["EU MDR", "Patents", "Outreach"],
      accent_color: "#d95d39",
      link_url: "",
      link_label: "",
      media_url: "",
      media_name: ""
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
