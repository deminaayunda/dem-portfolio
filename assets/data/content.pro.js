/*
  KONTEN SITUS
  Semua teks di situs diambil dari file ini. Edit di sini, jangan di index.html.
  Aturan: field yang dikosongkan ("" atau []) otomatis tidak ditampilkan.
  Tulis *kata* untuk highlight kuning (butter).
*/
window.CONTENT = {
  lang: "en",
  meta: {
    title: "Demina Ayunda Chesara | Data & Analytics",
    description:
      "Informatics graduate (GPA 3.85, cum laude) from Universitas Diponegoro. Work and project experience in data analysis, machine learning, and process improvement.",
  },

  nav: [
    { label: "About", href: "#about" },
    { label: "Work Experience", href: "#work" },
    { label: "Project Experience", href: "#projects" },
    { label: "Contacts", href: "#contact" },
  ],

  // Ganti tanggal ini tiap kali update isi situs
  lastUpdated: { label: "Last updated", date: "2026-11-01" },

  hero: {
    name: "Demina Ayunda Chesara, S.Kom",
    role: "Data & Analytics",
    lines: ["Informatics graduate, GPA 3.85 (cum laude)", "Universitas Diponegoro"],
    photo: "assets/img/_ABC0181.JPG",
    initials: "DA",
  },

  // Ditampilkan di kartu profil, di bawah foto + nama. tags: true = tampil sebagai pil.
  // Grup dengan items kosong otomatis tidak ditampilkan.
  // Di desktop: grup ke-1 s/d ke-3 jadi tiga kolom, grup ke-4 jadi baris penuh di bawahnya.
  about: [
    { label: "Skills", tags: true, items: ["Python", "SQL", "Excel", "Power BI", "Machine learning", "Computer vision", "Laravel", "MySQL"] },
    {
      label: "Achievements",
      items: ["1st Place, PPL Capstone Project (Software Engineering)"],
    },
    { label: "English certificate", items: ["CEFR B2 (Upper Intermediate), British Council EnglishScore"] },
    {
      label: "Certifications",
      items: [
        "Karirnex Data Analyst Bootcamp (Sept 2026, Intermediate): Excel, SQL, Python, Power BI",
        "IBM Cognitive Class: Data Science and Data Science Methodology (2025)",
        "Oracle Academy: Java Programming (2024), Database Programming (2024), Database Design (2023)",
      ],
    },
  ],

  work: {
    heading: "Work experience",
    didLabel: "What I did",
    items: [
      {
        role: "Freelance MCU Administrator",
        org: "Prodia Widyahusada, Karawang",
        logo: "assets/img/logo_prodia_crop.png",
        period: "Aug – Oct 2026",
        summary: "Medical check-up files were sorted slowly because of two vendor data patterns and overlapping schedules.",
        did: [
          "Traced the sorting delays to their root cause.",
          "Designed an alphabetical grouping system for 3,400+ files, cutting sorting time from *about 120 to 60 minutes* per batch. Applied it to Syngenta MCU batches.",
          "Built an XLOOKUP tracking template to check data accuracy and completeness against MR checklists, keeping medical data confidential.",
          "Rated 5/5 for learning speed by all 3 mentors.",
        ],
        skills: ["Excel", "XLOOKUP", "Root cause analysis", "Workflow design"],
      },
      {
        role: "Web Developer Intern",
        org: "BPJS Ketenagakerjaan Kanwil Jateng & DIY",
        logo: "assets/img/logo_bpjs_clean.png",
        period: "Jan – May 2025",
        summary: "Vehicle loans were handled manually, without one place to track bookings.",
        did: [
          "Digitised vehicle loans into *4 complete workflows* (submission, extension, cancellation, return) with role-based approval in an internal reservation system (demo stage).",
          "Found a gap outside the spec: users could extend a vehicle booked by someone else. Built schedule validation to block it and demonstrated it to my mentor.",
        ],
        skills: ["Laravel", "MySQL"],
      },
    ],
  },

  projects: {
    heading: "Project experience",
    detailLabel: "Detail",
    howLabel: "How",
    resultLabel: "Result",
    comingSoon: { title: "Another project coming soon", text: "Currently in the works. Check back later." },
    tabs: [
      {
        id: "ai-data",
        label: "AI & Data",
        // image: path gambar di kartu, mis. "assets/img/thesis.jpg". Kalau kosong, tampil huruf pertama judul;
        // kalau field image tidak ditulis sama sekali, kartu tanpa kotak gambar.
        items: [
          {
            title: "Class imbalance in skin lesion classification",
            kind: "Undergraduate thesis · Deep learning · 2026",
            summary:
              "In HAM10000 (10,015 images, 7 classes) a few classes dominate, so a model can look accurate while failing on rare lesion types.",
            approach:
              "Used one architecture (EfficientNetB0) to compare 16 combinations of data-level methods (oversampling, undersampling) and model-level methods (loss functions). Split the data by lesion_id to prevent patient data leakage.",
            results: [
              "Raised validation balanced accuracy from 0.6343 to 0.7126 (*+12.3% relative*), and scored 0.7116 on the test set.",
            ],
            stack: ["Python", "EfficientNetB0", "Transfer learning", "Focal loss"],
            links: [
              // { label: "Repository", href: "https://github.com/..." },
            ],
          },
          {
            title: "ASEAN under-five mortality (U5MR) analysis",
            kind: "Data science project · June 2025",
            summary:
              "Under-five mortality differs widely across ASEAN. Which factors explain most of the difference?",
            approach:
              "Cleaned and merged 5+ public datasets for 10 ASEAN countries (health, economy, environment, education, demographics, gender inequality, nutrition) into one dataset with Python. Ran EDA on U5MR trends from 2000 to 2023 against the SDG 3.2 target (<25 per 1,000 live births).",
            results: [
              "A Random Forest on 15 features ranked *clean water access*, health spending per capita, and GDP per capita as the strongest predictors.",
              "Points to water and health spending as priority areas.",
            ],
            stack: ["Python", "EDA", "Random Forest", "Data cleaning"],
            links: [],
          },
        ],
      },
      {
        id: "web",
        label: "Web",
        // popup: kartu cuma gambar + judul, sisanya di popup Detail.
        popup: true,
        items: [
          {
            title: "SiGMA (Sistem Informasi Genuine Manajemen Akademik)",
            image: "assets/img/sigma.png",
            kind: "Web development project · Aug – Dec 2024",
            summary: "Team of 5 building an academic system; I developed the student course registration (IRS) module.",
            approach: "Built the flow from registration to course selection using Laravel, MySQL, and Git.",
            results: [
              "Implemented *4 validations*: schedule conflicts, credit limits, courses filtered by semester, and full classes blocked.",
            ],
            stack: ["Laravel", "MySQL", "Git", "Teamwork"],
            links: [],
          },
          {
            title: "Stunting calculator for Desa Kaliprau",
            image: "assets/img/stunting.jpeg",
            kind: "KKN community service · Pemalang · July – Aug 2025",
            summary:
              "Village health cadres and residents had no simple way to check a child's growth status.",
            approach:
              "Built a stunting screening calculator, then presented it to health cadres and residents in a socialisation session.",
            results: [
              "*19 participants* tried it to check their children's growth status.",
              "A village health cadre cited the calculator's impact in a YouTube video.",
            ],
            stack: ["Web", "Public health", "User training"],
            links: [{ label: "Try the calculator", href: "https://kalkulator-stunting-kaliprau.netlify.app/" }],
          },
          {
            title: "Desa Kaliprau village website",
            image: "assets/img/webdesa.jpeg",
            kind: "KKN community service · Pemalang · July – Aug 2025",
            summary:
              "Official website for Desa Kaliprau (Jasmine Village): a digital hub for village governance, tourism, and local UMKM.",
            approach: "Led a team of two, working with a partner who had no IT background.",
            results: [
              "Features a village profile, *administrative transparency*, news, and a cultural gallery to promote local potential and support village digitalization.",
            ],
            stack: ["Web", "Team lead", "Village digitalization"],
            links: [{ label: "Visit website", href: "https://kaliprau.netlify.app/" }],
          },
        ],
      },
      {
        id: "organizations",
        label: "Organizations",
        resultLabel: "What I did",
        comingSoon: false,
        // image: path foto organisasi, mis. "assets/img/anforcom-2024.jpg". Kalau kosong, tampil huruf pertama judul.
        items: [
          {
            title: "ANFORCOM 2024",
            image: "assets/img/anfor2024.JPG",
            kind: "Event Division · May – Sep 2024",
            summary: "Annual Informatics Competition, a national event with 50+ participants from 5+ universities.",
            results: [
              "Ran the webinar: designed the concept and operational flow, and wrote the SOPs and timelines.",
              "Worked with other divisions on event day to resolve issues and keep every session *on schedule*.",
            ],
            stack: ["Event planning", "SOP", "Coordination"],
          },
          {
            title: "I-GATE 2023",
            image: "assets/img/i-gate2023.jpeg",
            kind: "Public Relations Division · Sep – Dec 2023",
            summary: "Informatics Gathering.",
            results: [
              "Raised *more than Rp4,000,000* in donor funds for event operations through personal outreach and proposal writing.",
            ],
            stack: ["Fundraising", "Proposal writing"],
          },
          {
            title: "ANFORCOM 2023",
            image: "assets/img/anfor2023.jpeg",
            kind: "UI/UX Competition Division · July – Sep 2023",
            summary: "National UI/UX competition with 40 participants.",
            results: [
              "Wrote the rules, guidelines, and scoring matrix (originality, functionality, visual).",
              "Main contact for participants' technical questions and reminders; *100% of entries* were collected on time.",
            ],
            stack: ["Competition design", "Communication"],
          },
          {
            title: "ICONSOLE 2023",
            image: "assets/img/iconsole.jpeg",
            kind: "Student Mentor · July 2023 – Mar 2024",
            summary: "Informatics Concept Socialization.",
            results: [
              "Guided *11 new Informatics students* through academic adaptation and campus life for 8 months.",
            ],
            stack: ["Mentoring"],
          },
        ],
      },
    ],
  },

  contact: {
    heading: "Let's *talk*",
    text: "I'm open to data and analytics roles in any industry, and keen to keep learning on the job. Email is the best way to reach me.",
    // Yang kosong tidak ditampilkan.
    links: [
      { label: "Email", href: "mailto:deminaayunda21@gmail.com" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/demina-ayunda-chesara/" },
      { label: "GitHub", href: "" },
    ],
  },

  footer: "© " + new Date().getFullYear() + " Demina Ayunda Chesara",
};
