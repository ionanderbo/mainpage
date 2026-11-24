/* ==========================================================================
   Ion Ander Bolado — Default Content Store
   Used automatically before Supabase is connected and as initial seed entries.
   ========================================================================== */

const DEFAULT_DATA = {
  meta: {
    name: "Ion Ander Bolado",
    location: "Bilbao, Spain",
    institution: "University of Deusto",
    email: "ionander.bolado@opendeusto.es",
    linkedin: "https://linkedin.com/in/ionanderboladogracia",
    github: "https://github.com"
  },

  nav: [
    { href: "index.html#about", label: "About" },
    { href: "projects.html", label: "Projects" },
    { href: "index.html#updates", label: "Updates" },
    { href: "index.html#contact", label: "Contact" }
  ],

  facts: [
    {
      label: "Currently Studying",
      value: "Biomedical Engineering at the University of Deusto (Bilbao)"
    },
    {
      label: "Next Step · Bachelor’s Thesis (TFG)",
      value: "Looking at research labs at FAU Erlangen-Nürnberg, TUM, RWTH Aachen, or the UK"
    },
    {
      label: "Languages",
      value: "Spanish (Native) · English (C1) · German (B2/C1 track, 6 hrs/week)"
    },
    {
      label: "Outside Class",
      value: "Student Representative & Open Day Speaker for Biomedical Engineering"
    }
  ],

  projects: [
    {
      id: "seed-proj-cardiopatch",
      sort_order: 0,
      status_label: "Featured Prototype",
      title: "CardioPatch: 24/7 Wearable Cardiac Patch",
      summary: "Designed in a 4-person biomedical engineering team (Group 06, Deusto) to address silent myocardial infarctions—nearly 45% of heart attacks happen without classic chest pain, while standard Holter monitors only report results days later.",
      details: "We paired a reusable IP67 shower-proof electronics hub with disposable hypoallergenic silicone patches. Based on interviews with cardiology nurses, on-device AI filters out normal exertion like climbing stairs while flagging real ST-segment shifts and skin-temperature drops with a 30-second ECG strip.",
      tags: ["Edge AI", "Biosignals", "Wearable Hardware", "IP67"],
      accent_color: "#d45b38",
      primary_link_url: "#ecg-demo",
      primary_link_label: "Try live signal demo",
      secondary_link_url: "",
      secondary_link_label: "",
      media_url: "",
      media_name: "",
      widget_type: "cardiopatch"
    },
    {
      id: "seed-proj-ct",
      sort_order: 1,
      status_label: "Medical Imaging",
      title: "Lung Nodule Analysis & CT Biopsy Planning",
      summary: "Segmented a solid pulmonary nodule on chest CT in 3D Slicer, reconstructed a 3D model, planned a single-pleura-crossing needle path avoiding ribs and major vessels, and recovered a 10 mm simulated shift using rigid registration.",
      details: "Key takeaway: A raw mean intensity of −171.8 HU looked too low for solid tissue because 17.5% of mask voxels included aerated lung along the boundary. At ~18 mm diameter, the nodule exceeds the 8 mm Fleischner threshold, justifying biopsy planning.",
      tags: ["3D Slicer", "Python", "Radiomics", "Chest CT"],
      accent_color: "#0f766e",
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
      sort_order: 10,
      status_label: "Signal Processing",
      title: "EEG Signal Quality & Eye-Blink Artifact Removal",
      summary: "Checked sampling rates and aliasing, ranked 14 scalp channels by electrode contact quality, applied a 1–40 Hz bandpass filter, and isolated eye-blink spikes using synchronous accelerometer data. Removing one noisy electrode (P7) lifted usable recording time from 26.6% to over 70%.",
      details: "",
      tags: ["Python", "Signal Processing", "14-Ch EEG"],
      accent_color: "#0f766e",
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
      sort_order: 11,
      status_label: "In Progress",
      title: "Alzheimer’s Clinical Biomarker Explorer",
      summary: "Cleaning and analyzing clinical and lifestyle variables across 2,149 patient records in R (dplyr and ggplot2) to see which non-invasive markers best distinguish diagnosed patients from controls.",
      details: "Focused on simple, interpretable clinical screening variables rather than black-box models.",
      tags: ["R", "dplyr", "ggplot2", "Clinical Data"],
      accent_color: "#d45b38",
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
      date_label: "19 NOV 2026 · 19:34",
      category: "engineering",
      category_label: "Engineering & Signals",
      title: "Testing the CardioPatch ECG simulator & false-alarm filtering",
      body: "Finished the interactive sinus-wave simulator for CardioPatch with Group 06. Main lesson from talking to cardiology nurses: a continuous monitor is useless if it buzzes every time someone climbs a flight of stairs—filtering normal sinus tachycardia on the device matters just as much as catching ST elevation.",
      tags: ["CardioPatch", "ECG", "Edge AI"],
      accent_color: "#0f766e",
      link_url: "",
      link_label: "",
      media_url: "",
      media_name: ""
    },
    {
      id: "seed-log-2",
      date_label: "12 NOV 2026 · 18:15",
      category: "mobility",
      category_label: "Germany & TFG",
      title: "Keeping up 6 hours/week of German & shortlisting TFG labs",
      body: "Sticking to six hours a week of German study alongside engineering classes to reach B2/C1 level. Narrowing down research groups in surgical robotics, smart implants, and medical hardware at FAU Erlangen-Nürnberg, TUM, and RWTH Aachen for my Bachelor’s Thesis.",
      tags: ["German B2/C1", "TFG", "FAU", "TUM", "RWTH"],
      accent_color: "#d45b38",
      link_url: "",
      link_label: "",
      media_url: "",
      media_name: ""
    },
    {
      id: "seed-log-3",
      date_label: "28 OCT 2026 · 16:40",
      category: "engineering",
      category_label: "Engineering & Signals",
      title: "Why our CT lung nodule intensity read −171.8 HU",
      body: "Looked into why our 3D Slicer segmentation gave a suspiciously low Hounsfield value for a solid nodule: 17.5% of the mask voxels were catching air from surrounding lung tissue along the edge. Good reminder to always inspect the segmentation border before trusting radiomics numbers.",
      tags: ["3D Slicer", "CT", "Radiomics"],
      accent_color: "#0f766e",
      link_url: "",
      link_label: "",
      media_url: "",
      media_name: ""
    },
    {
      id: "seed-log-4",
      date_label: "15 SEP 2026 · 11:20",
      category: "translation",
      category_label: "MedTech & IP",
      title: "Deusto open-day talks & reading up on EU MDR and patents",
      body: "Helping out as a student speaker at University of Deusto open days while reading into how university medical prototypes actually get patented, certified under EU MDR, and funded.",
      tags: ["EU MDR", "Patents", "Deusto"],
      accent_color: "#d45b38",
      link_url: "",
      link_label: "",
      media_url: "",
      media_name: ""
    }
  ]
};
