/* ============================================================
   TONY STARK PORTFOLIO — SHARED JAVASCRIPT
   Navbar, Scroll Effects, Particles, Back to Top
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initParticles();
  initBackToTop();
  initPageLoader();
  initSmoothScroll();
  initGlobalHeaderAnimations();
  initGlobalSearch();
  checkUrlHash();
});

window.addEventListener('hashchange', checkUrlHash);

/* ============================================================
   NAVBAR
   ============================================================ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.nav-mobile');
  const navLinks = document.querySelectorAll('.nav-mobile a, .nav-links a');

  // Scroll effect — add 'scrolled' class
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  // Mobile toggle
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Set active link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ============================================================
   PARTICLE SYSTEM (Canvas-based)
   ============================================================ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouseX = 0;
  let mouseY = 0;
  let animationId;

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 15000), 80);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, i) => {
      // Update position
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;

      // Wrap around edges
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Mouse interaction
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        const force = (150 - dist) / 150;
        p.x -= dx * force * 0.01;
        p.y -= dy * force * 0.01;
      }

      // Draw particle
      const currentOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230, 36, 41, ${currentOpacity})`;
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const distance = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
        if (distance < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(230, 36, 41, ${0.06 * (1 - distance / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    animationId = requestAnimationFrame(drawParticles);
  }

  // Track mouse
  canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  resize();
  createParticles();
  drawParticles();
}

/* ============================================================
   BACK TO TOP BUTTON
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   PAGE LOADER
   ============================================================ */
function initPageLoader() {
  const loader = document.querySelector('.page-loader, .stark-loader');
  if (!loader) return;

  function hideLoader() {
    setTimeout(() => {
      loader.classList.add('loaded');
    }, 300);
  }

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }
}

/* ============================================================
   SMOOTH SCROLL (for anchor links)
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ============================================================
   SCROLL REVEAL UTILITY
   Used by page-specific JS to animate elements on scroll
   ============================================================ */
function createScrollReveal(selector, options = {}) {
  const defaults = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    once: true
  };
  const config = { ...defaults, ...options };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add stagger delay
        const delay = (options.stagger || 0) * index;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);

        if (config.once) {
          observer.unobserve(entry.target);
        }
      }
    });
  }, {
    threshold: config.threshold,
    rootMargin: config.rootMargin
  });

  document.querySelectorAll(selector).forEach(el => observer.observe(el));
  return observer;
}

/* ============================================================
   THEME MANAGER
   ============================================================ */
function initTheme() {
  // Theme toggle has been removed. Site remains in default dark theme.
}

/* ============================================================
   GLOBAL STARK OS HEADER ANIMATIONS (GSAP stagger)
   ============================================================ */
function initGlobalHeaderAnimations() {
  // Check if GSAP is loaded
  if (typeof gsap === 'undefined') return;

  const mainHeadings = document.querySelectorAll('.works-page-header .header-title, .page-hero h1');
  mainHeadings.forEach(heading => {
    const spans = heading.querySelectorAll('span');
    if (spans.length > 0) {
      gsap.from(spans, {
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out'
      });
    } else {
      gsap.from(heading, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out'
      });
    }
  });

  // Also animate header subtitles, descriptions, and navigation pills if any
  const subtitles = document.querySelectorAll('.works-page-header .page-subtitle, .page-hero .page-subtitle, .works-page-header .section-subtitle, .page-hero .section-subtitle, .works-page-header .section-pills .pill');
  if (subtitles.length > 0) {
    gsap.from(subtitles, {
      opacity: 0,
      y: 20,
      stagger: 0.08,
      duration: 0.8,
      delay: 0.35,
      ease: 'power2.out'
    });
  }
}

/* ============================================================
   GLOBAL SITE-WIDE HOLOGRAPHIC HUD SEARCH SYSTEM
   ============================================================ */
const searchDatabase = [
  // Works page targets
  { 
    title: "Arc Reactor Mark I", 
    category: "Works", 
    url: "works.html#arcReactor", 
    desc: "The original palladium cell reactor built in a cave to keep shrapnel from Stark's heart.", 
    keywords: "arc reactor mark 1 cave palladium shrapnel heart chest battery weapon cave breakout yinsen" 
  },
  { 
    title: "Arc Reactor Mark VIII", 
    category: "Works", 
    url: "works.html#arcReactor", 
    desc: "The clean energy reactor utilizing a newly discovered element to power Stark Industries and the Mark VI.", 
    keywords: "arc reactor mark 8 clean energy element triangle shield vibranium synthesized new element howard" 
  },
  { 
    title: "Arc Reactor Mark LXXXV", 
    category: "Works", 
    url: "works.html#arcReactor", 
    desc: "The vibranium-charged nano-lattice reactor built for the ultimate nanotech suit and Time Heist.", 
    keywords: "arc reactor mark 85 nanotech nano lattice ultimate time heist snap rescue pepper gauntlet" 
  },
  { 
    title: "Iron Spider Suit", 
    category: "Works", 
    url: "works.html#armors", 
    desc: "Designed for Peter Parker, featuring a custom nanotech interface, four active spider-arms, and orbital drop compatibility.", 
    keywords: "iron spider suit peter parker spiderman nano tech arms legs legs veronica rescue" 
  },
  { 
    title: "Spider-Man Homecoming Suit", 
    category: "Works", 
    url: "works.html#armors", 
    desc: "The high-tech red and blue suit equipped with web-wings, 576 web-shooter combinations, and Baby Monitor Protocol.", 
    keywords: "spiderman spider-man homecoming suit peter parker baby monitor web shooters wings queens" 
  },
  { 
    title: "Iron Legion Drones", 
    category: "Works", 
    url: "works.html#armors", 
    desc: "An automated peacekeeper drone army constructed to protect citizens and support tactical operations.", 
    keywords: "iron legion drones automated robots sentry army protect sokovia ultron banner" 
  },
  { 
    title: "J.A.R.V.I.S. Mainframe", 
    category: "Works", 
    url: "works.html#aiSystems", 
    desc: "Just A Rather Very Intelligent System — Tony's primary AI assistant that served as his core operating mainframe.", 
    keywords: "jarvis mainframe intelligence voice primary vision mind stone butler assistant core computer" 
  },
  { 
    title: "F.R.I.D.A.Y. Mainframe", 
    category: "Works", 
    url: "works.html#aiSystems", 
    desc: "Tony's tactical replacement AI assistant deployed after J.A.R.V.I.S. integrated into the Vision.", 
    keywords: "friday mainframe replacement voice tactical assistant female core suits system computer" 
  },
  { 
    title: "E.D.I.T.H. Mainframe", 
    category: "Works", 
    url: "works.html#aiSystems", 
    desc: "Even Dead I'm The Hero — Tony's posthumous defense system controlling a massive satellite-linked drone fleet.", 
    keywords: "edith mainframe glasses satellite weapon peter parker drones spider-man legacy" 
  },
  { 
    title: "Ultron System", 
    category: "Works", 
    url: "works.html#aiSystems", 
    desc: "The sentient rogue peacekeeping AI designed with the Mind Stone that almost triggered human extinction.", 
    keywords: "ultron rogue sentient villain robot bad ai sokovia avengers mind stone scepter banner" 
  },
  { 
    title: "Quantum Time-Space GPS", 
    category: "Works", 
    url: "works.html#timeTravel", 
    desc: "A breakthrough wrist-worn coordinate stabilizer mapping entry and exit points inside the Quantum Realm.", 
    keywords: "quantum time space gps travel coordinates math mobius strip wristband wrist" 
  },
  { 
    title: "Inverted Möbius Strip Projection", 
    category: "Works", 
    url: "works.html#timeTravel", 
    desc: "The mathematical breakthrough that mathematically proved time-travel navigation was possible.", 
    keywords: "inverted mobius strip projection math time travel geometry quantum model solve" 
  },
  
  // Suits page targets
  { 
    title: "Mark I Armor", 
    category: "Suits", 
    url: "suits.html#Mark-I", 
    desc: "The raw, heavy iron prototype weaponized with flamethrowers and a rudimentary rocket booster built in captivity.", 
    keywords: "mark 1 armor first suit cave breakout heavy iron weapon flamethrower yinsen afghanistan" 
  },
  { 
    title: "Mark II Armor", 
    category: "Suits", 
    url: "suits.html#Mark-II", 
    desc: "The high-polish silver prototype that solved structural aerodynamics and flight stabilization but suffered freezing issues.", 
    keywords: "mark 2 armor silver prototype flight test high altitude freezing ice rhodey war machine" 
  },
  { 
    title: "Mark III Armor", 
    category: "Suits", 
    url: "suits.html#Mark-III", 
    desc: "The classic gold-titanium hotrod red suit, resolving high-altitude icing and introducing weaponized repulsors.", 
    keywords: "mark 3 armor red gold hotrod iconic weapons repulsor unibeam classic" 
  },
  { 
    title: "Mark V — Suitcase Armor", 
    category: "Suits", 
    url: "suits.html#Mark-V", 
    desc: "The portable, emergency emergency-response suit that compresses down into an elegant, light suitcase.", 
    keywords: "mark 5 armor suitcase portable emergency response monaco racetrack vanko whiplash happy pepper" 
  },
  { 
    title: "Mark XLII — Prodigal Son", 
    category: "Suits", 
    url: "suits.html#Mark-XLII", 
    desc: "The autonomous prehensile propulsion suit that attaches piece-by-piece to Tony's body via subcutaneous trackers.", 
    keywords: "mark 42 armor prodigal son prehensile pieces tracking autonomous clean slate pepper malibu" 
  },
  { 
    title: "Mark XLIV — Hulkbuster", 
    category: "Suits", 
    url: "suits.html#Mark-XLIV", 
    desc: "A massive, heavy-assault orbital modular add-on armor codenamed Veronica built to subdue the Hulk.", 
    keywords: "mark 44 armor hulkbuster veronica anti hulk modular satellite parts banner fight" 
  },
  { 
    title: "Mark L — Nanotech Armor", 
    category: "Suits", 
    url: "suits.html#Mark-L", 
    desc: "Advanced nanotech suit that forms custom weapons, shields, and thrusters dynamically from Stark's chest arc reactor.", 
    keywords: "mark 50 armor nano tech nanotechnology fluid reactor weapons shield thrusters titan thanos infinity war" 
  },
  { 
    title: "Mark LXXXV — Final Nano Suit", 
    category: "Suits", 
    url: "suits.html#Mark-LXXXV", 
    desc: "The ultimate suit worn in the Battle of Earth, integrating the Nano Gauntlet capable of holding the Infinity Stones.", 
    keywords: "mark 85 armor final nano suit nano gauntlet infinity stones snap sacrifice endgame earth" 
  },
  {
    title: "Mark XLIX — Rescue Suit",
    category: "Suits",
    url: "suits.html#Mark-XLIX",
    desc: "The advanced blue and silver combat suit designed specifically for Pepper Potts (Rescue), equipped with repulsors and force shields.",
    keywords: "rescue suit pepper potts papper potts wife mark 49 blue silver shield combat morgan"
  },
  
  // Timeline page targets
  { 
    title: "1970 — Tony Stark Birth", 
    category: "Timeline", 
    url: "timeline.html#1970", 
    desc: "Tony is born to Howard and Maria Stark, inheriting a genius intellect and future corporate empire.", 
    keywords: "1970 birth born parents howard maria stark legacy corporate childhood" 
  },
  { 
    title: "2008 — Cave Breakout & Iron Man Born", 
    category: "Timeline", 
    url: "timeline.html#2008", 
    desc: "Tony is captured in Afghanistan, invents the Mark I prototype, and declares himself Iron Man.", 
    keywords: "2008 breakout afghanistan cave mark 1 revelation secret identity obadiah stane starks cave yinsen" 
  },
  { 
    title: "2010 — Monaco Battle & Palladium Cure", 
    category: "Timeline", 
    url: "timeline.html#2010", 
    desc: "Tony battles Whiplash in Monaco, discovers a new clean-energy element to cure his blood toxicity.", 
    keywords: "2010 monaco racetrack vanko whiplash palladium poisoning new element raw math howard" 
  },
  { 
    title: "2012 — The Avengers & Battle of New York", 
    category: "Timeline", 
    url: "timeline.html#2012", 
    desc: "Tony joins the Avengers, saves Manhattan by carrying a nuclear warhead into a Chitauri wormhole.", 
    keywords: "2012 avengers battle of new york chitauri wormhole nuke portal loki saves city sacrifice pepper" 
  },
  { 
    title: "2015 — Roguish Ultron & The Birth of Vision", 
    category: "Timeline", 
    url: "timeline.html#2015", 
    desc: "Tony builds Ultron as a peacekeeping initiative, which goes rogue, leading to the creation of the Vision.", 
    keywords: "2015 ultron rogue peacekeeper shield Vision jarvis sokovia creation banner mind stone" 
  },
  { 
    title: "2018 — Decimation on Titan", 
    category: "Timeline", 
    url: "timeline.html#2018", 
    desc: "Tony battles Thanos in space using the Mark L suit, and witnesses the tragic snap wiping out half of life.", 
    keywords: "2018 titan battles thanos space decimation snap dust marvel infinity war peter spider" 
  },
  { 
    title: "2023 — Time Heist & Ultimate Sacrifice", 
    category: "Timeline", 
    url: "timeline.html#2023", 
    desc: "Tony invents the Time-Space GPS, leads the Time Heist, and sacrifices himself using the Nano Gauntlet.", 
    keywords: "2023 time heist gps travel sacrifice morgan daughter pepper papper gauntlet snap earth endgame" 
  },

  // Key Character / Topic Targets mapped site-wide
  {
    title: "Pepper Potts (Rescue) — Wife",
    category: "Characters",
    url: "suits.html#Mark-XLIX",
    desc: "Tony Stark's wife, former personal assistant, CEO of Stark Industries, and operator of the Rescue armor.",
    keywords: "pepper papper potts wife CEO family love cabin morgan engagement rescue mark 49"
  },
  {
    title: "Morgan Stark — Daughter",
    category: "Characters",
    url: "timeline.html#2023",
    desc: "Tony Stark and Pepper Potts' beloved daughter, born during the quiet lakeside retirement period.",
    keywords: "morgan starks starks daughter love you 3000 child kid cabin pepper papper"
  },
  {
    title: "Howard Stark — Father",
    category: "Characters",
    url: "about.html",
    desc: "Tony's father, original developer of Stark Industries weapon catalog, and researcher of the Arc Reactor.",
    keywords: "howard starks father legacy Manhattan project shield raw element new element"
  },
  {
    title: "Steve Rogers (Captain America)",
    category: "Characters",
    url: "appearances.html",
    desc: "Super-soldier Avenger. Clashed with Tony over the Sokovia Accords but reconciled during the Time Heist.",
    keywords: "steve rogers captain america civil war shield avengers friends winter soldier cap"
  },
  {
    title: "Peter Parker (Spider-Man)",
    category: "Characters",
    url: "works.html#armors",
    desc: "The young hero of Queens mentored by Tony Stark, receiving multiple advanced suits and AI glasses.",
    keywords: "peter parker spiderman spider-man homecoming spider suit glasses Queens protege mentor"
  },
  {
    title: "Happy Hogan — Bodyguard",
    category: "Characters",
    url: "appearances.html",
    desc: "Tony's personal bodyguard, driver, and head of security for Stark Industries.",
    keywords: "happy hogan personal bodyguard driver security support friend monaco suitcase"
  },

  // Appearances page targets
  { title: "Iron Man Movie Appearances", category: "Appearances", url: "appearances.html", desc: "Explores all lead and crossover film appearances of Tony Stark across the Marvel Cinematic Universe.", keywords: "movies appearances films phase 1 2 3 marvel iron man trilogy" },
  { title: "Avengers Movie Archives", category: "Appearances", url: "appearances.html", desc: "Full breakdown of Avengers team-ups, battle actions, and cinematic milestones throughout Phase 1 to 4.", keywords: "avengers assembly ensemble crossover age of ultron infinity war endgame thanos" },

  // About page targets
  { title: "Stark Industries Legacy", category: "About", url: "about.html", desc: "Tony's transition of Stark Industries from an arms manufacturer to the world's leading clean-energy and research tech developer.", keywords: "legacy weapon arms defense stark industries CEO pepper industries clean energy" },
  { title: "Tony Stark Credentials & Philosophy", category: "About", url: "about.html", desc: "The brilliant engineer, futurist, and philanthropist's educational credentials and core philosophies.", keywords: "credentials education genius MIT degrees physics engineer study intelligence" }
];

function initGlobalSearch() {
  // 1. Inject Inline Search into Navbar container
  const navbarContainer = document.querySelector('.navbar .container');
  if (!navbarContainer) return;

  const searchWrap = document.createElement('div');
  searchWrap.className = 'nav-search-wrap';
  searchWrap.innerHTML = `
    <button class="search-btn" id="navSearchBtn" aria-label="Search Archives" data-sound="hover">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
    </button>
    <input type="text" class="search-inline-input" id="searchInput" placeholder="Search archives..." autocomplete="off" spellcheck="false">
    <button class="search-inline-close" id="searchCloseBtn">&times;</button>
    <div class="search-dropdown" id="searchDropdown">
      <div class="search-dropdown-hud">
        <span class="results-tag">// QUERY RESULTS</span>
        <span class="results-count" id="resultsCount">0 MATCHES</span>
      </div>
      <div class="search-dropdown-results" id="searchResults">
        <div class="search-empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <span>Type to search all page content...</span>
        </div>
      </div>
    </div>
  `;

  // Insert before the nav-toggle button (for mobile view consistency)
  const navToggle = navbarContainer.querySelector('.nav-toggle');
  if (navToggle) {
    navbarContainer.insertBefore(searchWrap, navToggle);
  } else {
    navbarContainer.appendChild(searchWrap);
  }

  // 2. Gather references
  const navSearchBtn = document.getElementById('navSearchBtn');
  const searchCloseBtn = document.getElementById('searchCloseBtn');
  const searchInput = document.getElementById('searchInput');
  const searchDropdown = document.getElementById('searchDropdown');
  const searchResults = document.getElementById('searchResults');
  const resultsCount = document.getElementById('resultsCount');
  let kbIndex = -1;

  // 3. Build dynamic content index from the current page
  function scanPageContent() {
    const entries = [];
    const seen = new Set();

    // Get current page name
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageName = currentPage.replace('.html', '').replace(/^$/, 'home');
    const pageCategory = pageName.charAt(0).toUpperCase() + pageName.slice(1);

    // Selectors that contain meaningful text content
    const selectors = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'li', 'td', 'th',
      'span', 'strong', 'em', 'b', 'i',
      'blockquote', 'figcaption', 'label',
      '.card-title', '.card-desc', '.card-text',
      '.section-title', '.section-subtitle',
      '.timeline-year', '.timeline-content',
      '.suit-name', '.suit-desc',
      '.stat-value', '.stat-label',
      '[data-name]', '[data-desc]'
    ];

    document.querySelectorAll(selectors.join(',')).forEach(el => {
      // Skip navbar, search elements, script, style
      if (el.closest('.navbar') || el.closest('.search-dropdown') || el.closest('.nav-search-wrap') ||
          el.closest('script') || el.closest('style') || el.closest('.page-loader') || el.closest('.stark-loader')) {
        return;
      }

      const rawText = (el.textContent || '').trim();
      if (!rawText || rawText.length < 3 || rawText.length > 500) return;

      // Deduplicate by text
      const key = rawText.toLowerCase().substring(0, 100);
      if (seen.has(key)) return;
      seen.add(key);

      // Try to find the nearest scrollable section/ancestor for navigation
      const scrollTarget = el.closest('[id]') || el.closest('section') || el.closest('.card') || 
                           el.closest('.timeline-item') || el.closest('.suit-card') || el;

      entries.push({
        text: rawText,
        element: scrollTarget || el,
        category: pageCategory,
        isPageContent: true
      });
    });

    return entries;
  }

  let pageContentCache = null;

  function getPageContent() {
    if (!pageContentCache) {
      pageContentCache = scanPageContent();
    }
    return pageContentCache;
  }

  // Rescan if DOM changes significantly (e.g., after animations load content)
  setTimeout(() => { pageContentCache = null; }, 2000);

  // 4. Open / Close search bar
  function openSearch() {
    searchWrap.classList.add('expanded');
    navSearchBtn.classList.add('active');
    searchInput.focus();
    playSearchSound('open');
  }

  function closeSearch() {
    searchWrap.classList.remove('expanded');
    navSearchBtn.classList.remove('active');
    searchInput.value = '';
    searchDropdown.classList.remove('visible');
    kbIndex = -1;
    updateResults('');
    playSearchSound('close');
  }

  function isOpen() {
    return searchWrap.classList.contains('expanded');
  }

  navSearchBtn.addEventListener('click', () => {
    if (isOpen()) {
      closeSearch();
    } else {
      openSearch();
    }
  });

  searchCloseBtn.addEventListener('click', closeSearch);

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (isOpen() && !searchWrap.contains(e.target)) {
      closeSearch();
    }
  });

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      closeSearch();
    }
  });

  // 5. Input handling
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    playSearchSound('type');
    kbIndex = -1;
    updateResults(query);
  });

  // Arrow key navigation and Enter
  searchInput.addEventListener('keydown', (e) => {
    const cards = searchResults.querySelectorAll('.search-result-card');
    if (!cards.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      kbIndex = Math.min(kbIndex + 1, cards.length - 1);
      highlightKb(cards);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      kbIndex = Math.max(kbIndex - 1, 0);
      highlightKb(cards);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const active = kbIndex >= 0 ? cards[kbIndex] : cards[0];
      if (active) active.click();
    }
  });

  function highlightKb(cards) {
    cards.forEach(c => c.classList.remove('kb-active'));
    if (kbIndex >= 0 && cards[kbIndex]) {
      cards[kbIndex].classList.add('kb-active');
      cards[kbIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  // 6. Audio feedback
  let audioCtx = null;
  function playSearchSound(type) {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'open') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
        osc.start(); osc.stop(audioCtx.currentTime + 0.18);
      } else if (type === 'close') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
      } else if (type === 'type') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600 + Math.random() * 200, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        osc.start(); osc.stop(audioCtx.currentTime + 0.05);
      } else if (type === 'match') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        osc.start(); osc.stop(audioCtx.currentTime + 0.08);
        setTimeout(() => {
          const osc2 = audioCtx.createOscillator();
          const gain2 = audioCtx.createGain();
          osc2.connect(gain2); gain2.connect(audioCtx.destination);
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(1200, audioCtx.currentTime);
          gain2.gain.setValueAtTime(0.05, audioCtx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
          osc2.start(); osc2.stop(audioCtx.currentTime + 0.08);
        }, 60);
      }
    } catch (e) { /* AudioCtx blocked */ }
  }

  // 7. Highlight matching text in a string
  function highlightMatch(text, query) {
    if (!query) return escapeHtml(text);
    const escaped = escapeHtml(text);
    const regex = new RegExp('(' + escapeRegex(query) + ')', 'gi');
    return escaped.replace(regex, '<mark>$1</mark>');
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // 8. Core search and results update
  function updateResults(query) {
    const lowerQuery = query.toLowerCase();

    if (!query) {
      searchDropdown.classList.remove('visible');
      resultsCount.textContent = '0 MATCHES';
      searchResults.innerHTML = `
        <div class="search-empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <span>Type to search all page content...</span>
        </div>
      `;
      return;
    }

    const allResults = [];

    // A) Search the static database for cross-page results
    searchDatabase.forEach(item => {
      const haystack = (item.title + ' ' + item.desc + ' ' + (item.keywords || '') + ' ' + item.category).toLowerCase();
      if (haystack.includes(lowerQuery)) {
        allResults.push({
          type: 'database',
          title: item.title,
          desc: item.desc,
          category: item.category,
          url: item.url
        });
      }
    });

    // B) Search the dynamic page content
    const pageContent = getPageContent();
    pageContent.forEach(entry => {
      if (entry.text.toLowerCase().includes(lowerQuery)) {
        // Truncate long text for display
        const displayText = entry.text.length > 120 ? entry.text.substring(0, 120) + '...' : entry.text;
        allResults.push({
          type: 'page',
          title: displayText,
          desc: '',
          category: entry.category + ' (This Page)',
          element: entry.element
        });
      }
    });

    // Deduplicate by title (prefer database entries)
    const uniqueResults = [];
    const titlesSeen = new Set();
    allResults.forEach(r => {
      const key = r.title.toLowerCase().substring(0, 60);
      if (!titlesSeen.has(key)) {
        titlesSeen.add(key);
        uniqueResults.push(r);
      }
    });

    // Limit results to 25
    const displayResults = uniqueResults.slice(0, 25);

    if (displayResults.length > 0) {
      searchDropdown.classList.add('visible');
      resultsCount.textContent = `${displayResults.length} MATCHES`;
      playSearchSound('match');

      searchResults.innerHTML = displayResults.map((r, i) => `
        <div class="search-result-card" data-index="${i}" data-type="${r.type}" ${r.url ? 'data-url="' + r.url + '"' : ''}>
          <div class="result-card-header">
            <h4 class="result-title">${highlightMatch(r.title, query)}</h4>
            <span class="result-category">${escapeHtml(r.category)}</span>
          </div>
          ${r.desc ? '<p class="result-desc">' + highlightMatch(r.desc, query) + '</p>' : ''}
        </div>
      `).join('');

      // Bind click handlers
      searchResults.querySelectorAll('.search-result-card').forEach((card, idx) => {
        card.addEventListener('mouseenter', () => playSearchSound('type'));
        card.addEventListener('click', () => {
          const result = displayResults[idx];

          if (result.type === 'page' && result.element) {
            // Scroll to the element on the current page
            closeSearch();
            setTimeout(() => {
              result.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              result.element.classList.add('search-highlight');
              setTimeout(() => result.element.classList.remove('search-highlight'), 2000);
            }, 150);
          } else if (result.type === 'database' && result.url) {
            const [path, hash] = result.url.split('#');
            let currentPage = window.location.pathname.split('/').pop() || 'index.html';
            if (currentPage === '') currentPage = 'index.html';

            if (path === currentPage || (currentPage === 'index.html' && path === '')) {
              // Same page — scroll
              closeSearch();
              if (hash) {
                let target = document.getElementById(hash);
                if (!target) {
                  const term = decodeURIComponent(hash).replace(/-/g, ' ');
                  if (window.location.pathname.includes('suits.html')) {
                    target = Array.from(document.querySelectorAll('.suit-card')).find(c =>
                      c.getAttribute('data-name')?.toLowerCase().includes(term.toLowerCase()) ||
                      c.querySelector('h4')?.textContent.toLowerCase().includes(term.toLowerCase())
                    );
                  } else if (window.location.pathname.includes('timeline.html')) {
                    target = Array.from(document.querySelectorAll('.timeline-item')).find(item =>
                      item.querySelector('.timeline-year')?.textContent.toLowerCase().includes(term.toLowerCase()) ||
                      item.querySelector('h3')?.textContent.toLowerCase().includes(term.toLowerCase())
                    );
                  }
                }
                if (target) {
                  setTimeout(() => {
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    target.classList.add('search-highlight');
                    setTimeout(() => target.classList.remove('search-highlight'), 2000);
                  }, 150);
                }
              }
            } else {
              // Different page — navigate
              window.location.href = result.url;
            }
          }
        });
      });
    } else {
      searchDropdown.classList.add('visible');
      resultsCount.textContent = 'NO MATCHES';
      searchResults.innerHTML = `
        <div class="search-empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <span>No results found for "${escapeHtml(query)}"</span>
        </div>
      `;
    }
  }
}

/* ============================================================
   GLOBAL DEEP-LINK SCROLL-HIGHLIGHT CONTROLLER
   ============================================================ */
function checkUrlHash() {
  const hash = window.location.hash.substring(1);
  if (!hash) return;

  setTimeout(() => {
    let target = document.getElementById(hash);
    
    if (!target) {
      const term = decodeURIComponent(hash).replace(/-/g, ' ');
      
      if (window.location.pathname.includes('suits.html')) {
        target = Array.from(document.querySelectorAll('.suit-card')).find(c => 
          c.getAttribute('data-name').toLowerCase().includes(term.toLowerCase()) ||
          c.querySelector('h4').textContent.toLowerCase().includes(term.toLowerCase())
        );
      } else if (window.location.pathname.includes('timeline.html')) {
        target = Array.from(document.querySelectorAll('.timeline-item')).find(item => 
          item.querySelector('.timeline-year').textContent.toLowerCase().includes(term.toLowerCase()) ||
          item.querySelector('h3').textContent.toLowerCase().includes(term.toLowerCase())
        );
      }
    }

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('search-highlight');
      setTimeout(() => target.classList.remove('search-highlight'), 2000);
    }
  }, 600); // 600ms delay to let transition and GSAP loading animations complete cleanly
}
