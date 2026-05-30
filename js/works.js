/* ============================================================
   TONY STARK — WORKS & INVENTIONS INTERACTION SYSTEMS
   Three.js 3D Reactor, Sound Synthesis, GSAP ScrollTrigger,
   AI Waveforms, Terminal Simulator & Carousels
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initAudioSystem();
  initGSAPAnimations();
  initThreeDReactor();
  initAIWaveforms();
  initLabConsole();
  initAICarousels();
  initLightbox();
});

/* ============================================================
   WEB AUDIO API - SCI-FI SOUND EFFECTS
   ============================================================ */
let audioCtx = null;

function initAudioSystem() {
  // Synthesize sound effects using Web Audio API (zero external files required, high reliability)
  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Sci-Fi Hologram Blip (for hover effects)
  function playHoverSound() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filterNode = ctx.createBiquadFilter();
      
      osc.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.04);
      
      filterNode.type = 'highpass';
      filterNode.frequency.setValueAtTime(600, now);
      
      gainNode.gain.setValueAtTime(0.015, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      
      osc.start(now);
      osc.stop(now + 0.045);
    } catch (e) {
      // Fail silently if browser blocks audio
    }
  }

  // Laser HUD Click (for click events)
  function playClickSound() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
      
      gainNode.gain.setValueAtTime(0.04, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      
      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      // Fail silently
    }
  }

  // Attach sounds to HTML elements
  document.querySelectorAll('[data-sound="hover"]').forEach(el => {
    el.addEventListener('mouseenter', playHoverSound);
  });

  document.querySelectorAll('[data-sound="click"]').forEach(el => {
    el.addEventListener('click', playClickSound);
  });

  // Export sounds globally so other modules can trigger them
  window.playHoverSound = playHoverSound;
  window.playClickSound = playClickSound;
}

/* ============================================================
   GSAP & SCROLLTRIGGER EFFECTS
   ============================================================ */
function initGSAPAnimations() {
  if (typeof gsap === 'undefined') return;

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);



  // Staggered reveal for cards on scroll
  const revealConfigs = [
    { selector: '.reactor-evol-card', trigger: '.reactor-cards-grid' },
    { selector: '.armor-card', trigger: '#armors' },
    { selector: '.ai-card', trigger: '.ai-grid' },
    { selector: '.time-gps-card', trigger: '.time-travel-layout' }
  ];

  revealConfigs.forEach(conf => {
    const cards = document.querySelectorAll(conf.selector);
    if (!cards.length) return;

    ScrollTrigger.batch(conf.selector, {
      onEnter: batch => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto',
          onStart: function() {
            batch.forEach(el => el.classList.add('revealed'));
          }
        });
      },
      start: 'top 85%'
    });
  });
}

/* ============================================================
   THREE.JS - 3D INTERACTIVE ARC REACTOR
   ============================================================ */
function initThreeDReactor() {
  const container = document.getElementById('reactorCanvasWrap');
  const canvas = document.getElementById('reactorCanvas');
  if (!container || !canvas) return;

  // Three.js Setup
  const scene = new THREE.Scene();
  
  // Custom camera parameters for exact fitting
  const camera = new THREE.PerspectiveCamera(60, container.offsetWidth / container.offsetHeight, 0.1, 100);
  camera.position.z = 22;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Build 3D Particle Rings (Arc Reactor core aesthetic)
  const particleGroup = new THREE.Group();
  scene.add(particleGroup);

  // Outer Ring (Cyan/Blue glowing parts)
  const outerCount = 180;
  const outerRadius = 7.5;
  const outerGeo = new THREE.BufferGeometry();
  const outerPositions = new Float32Array(outerCount * 3);
  const outerColors = new Float32Array(outerCount * 3);

  const colorArc = new THREE.Color('#00d2ff');
  const colorOrange = new THREE.Color('#f0c040');

  for (let i = 0; i < outerCount; i++) {
    const angle = (i / outerCount) * Math.PI * 2;
    // Layered ring thickness
    const ringRadius = outerRadius + (Math.random() - 0.5) * 0.4;
    
    outerPositions[i * 3] = Math.cos(angle) * ringRadius;
    outerPositions[i * 3 + 1] = Math.sin(angle) * ringRadius;
    outerPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.8;

    // Harmonized blue gradient colors
    const mixColor = colorArc.clone().lerp(colorOrange, Math.random() * 0.15);
    outerColors[i * 3] = mixColor.r;
    outerColors[i * 3 + 1] = mixColor.g;
    outerColors[i * 3 + 2] = mixColor.b;
  }

  outerGeo.setAttribute('position', new THREE.BufferAttribute(outerPositions, 3));
  outerGeo.setAttribute('color', new THREE.BufferAttribute(outerColors, 3));

  // Standard points material with vertex coloring
  const outerMat = new THREE.PointsMaterial({
    size: 0.35,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });

  const outerPoints = new THREE.Points(outerGeo, outerMat);
  particleGroup.add(outerPoints);

  // Inner Core (Vibrant gold/white cluster)
  const innerCount = 120;
  const innerRadius = 3.8;
  const innerGeo = new THREE.BufferGeometry();
  const innerPositions = new Float32Array(innerCount * 3);
  const innerColors = new Float32Array(innerCount * 3);

  const colorWhite = new THREE.Color('#ffffff');

  for (let i = 0; i < innerCount; i++) {
    const angle = (i / innerCount) * Math.PI * 2;
    const r = innerRadius + (Math.random() - 0.5) * 0.25;

    innerPositions[i * 3] = Math.cos(angle) * r;
    innerPositions[i * 3 + 1] = Math.sin(angle) * r;
    innerPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.4;

    const mixColor = colorArc.clone().lerp(colorWhite, Math.random() * 0.6);
    innerColors[i * 3] = mixColor.r;
    innerColors[i * 3 + 1] = mixColor.g;
    innerColors[i * 3 + 2] = mixColor.b;
  }

  innerGeo.setAttribute('position', new THREE.BufferAttribute(innerPositions, 3));
  innerGeo.setAttribute('color', new THREE.BufferAttribute(innerColors, 3));

  const innerMat = new THREE.PointsMaterial({
    size: 0.28,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });

  const innerPoints = new THREE.Points(innerGeo, innerMat);
  particleGroup.add(innerPoints);

  // Center Concentrated Core Light
  const centerGeo = new THREE.SphereGeometry(1.4, 16, 16);
  const centerMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });
  const centerMesh = new THREE.Mesh(centerGeo, centerMat);
  particleGroup.add(centerMesh);

  // Sector lines (reactor coils/blades)
  const coilCount = 10;
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x00d2ff,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending
  });

  for (let i = 0; i < coilCount; i++) {
    const angle = (i / coilCount) * Math.PI * 2;
    const points = [];
    points.push(new THREE.Vector3(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius, 0));
    points.push(new THREE.Vector3(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius, 0));
    
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(lineGeo, lineMat);
    particleGroup.add(line);
  }

  // Animation parameters
  let rotSpeed = 0.003;
  let pulseIntensity = 0;
  let targetScale = 1;

  // Mouse drag interaction
  let isDragging = false;
  let prevMouseX = 0;
  let prevMouseY = 0;

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - prevMouseX;
    const deltaY = e.clientY - prevMouseY;
    
    particleGroup.rotation.y += deltaX * 0.008;
    particleGroup.rotation.x += deltaY * 0.008;
    
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  });

  // Pulse reactor on click
  container.addEventListener('click', () => {
    if (window.playClickSound) window.playClickSound();
    
    pulseIntensity = 2.0;
    targetScale = 1.25;
    rotSpeed = 0.025;

    // Custom Web Audio sound synthesis for core ignition sound
    try {
      if (audioCtx) {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.4);
        
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        
        osc.start(now);
        osc.stop(now + 0.6);
      }
    } catch (e) {}

    // Pulse Ring flash
    const pulseRing = container.querySelector('.reactor-pulse-ring');
    if (pulseRing) {
      pulseRing.style.opacity = '1';
      pulseRing.style.transform = 'translate(-50%, -50%) scale(1.6)';
      setTimeout(() => {
        pulseRing.style.opacity = '0';
        pulseRing.style.transform = 'translate(-50%, -50%) scale(0.9)';
      }, 500);
    }
  });

  // Render loop
  function animate() {
    requestAnimationFrame(animate);

    // Continuous slow rotations
    particleGroup.rotation.z += rotSpeed;
    
    // Decay values back to normal
    if (rotSpeed > 0.003) rotSpeed -= 0.0004;
    if (pulseIntensity > 0) pulseIntensity -= 0.05;
    if (targetScale > 1) targetScale -= 0.01;

    // Apply scale & brightness fluctuations
    particleGroup.scale.set(targetScale, targetScale, targetScale);
    outerMat.size = 0.35 + pulseIntensity * 0.2;
    innerMat.size = 0.28 + pulseIntensity * 0.15;
    centerMesh.scale.set(1 + pulseIntensity * 0.4, 1 + pulseIntensity * 0.4, 1 + pulseIntensity * 0.4);

    renderer.render(scene, camera);
  }

  // Handle Resize
  window.addEventListener('resize', () => {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
  });

  animate();
}

/* ============================================================
   AI MAINFRAME DYNAMIC WAVEFORMS (Canvas sine-waves)
   ============================================================ */
function initAIWaveforms() {
  const canvases = document.querySelectorAll('.ai-waveform');
  if (!canvases.length) return;

  const config = {
    jarvis: { colors: ['rgba(0,210,255,0.7)', 'rgba(0,210,255,0.3)', 'rgba(0,210,255,0.1)'], speed: 0.12, amp: 14, freq: 0.04 },
    friday: { colors: ['rgba(240,192,64,0.7)', 'rgba(240,192,64,0.3)', 'rgba(240,192,64,0.1)'], speed: 0.1, amp: 10, freq: 0.05 },
    edith: { colors: ['rgba(0,162,255,0.7)', 'rgba(0,162,255,0.3)', 'rgba(0,162,255,0.1)'], speed: 0.09, amp: 12, freq: 0.03 },
    ultron: { colors: ['rgba(255,34,68,0.8)', 'rgba(255,34,68,0.4)', 'rgba(255,34,68,0.15)'], speed: 0.18, amp: 22, freq: 0.08 }
  };

  canvases.forEach(canvas => {
    const ctx = canvas.getContext('2d');
    const type = canvas.getAttribute('data-ai');
    const params = config[type] || config.jarvis;

    let offset = 0;

    function resize() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = 50;
    }
    
    function drawWave() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const h = canvas.height;
      const w = canvas.width;

      offset += params.speed;

      // Draw three distinct layered waves for holographic visual richness
      params.colors.forEach((color, waveIdx) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = waveIdx === 0 ? 1.5 : 0.8;

        const waveOffset = waveIdx * 45;
        const waveAmp = params.amp * (1 - waveIdx * 0.3);

        for (let x = 0; x < w; x++) {
          // Flatten wave edges symmetrically
          const edgeFade = Math.sin((x / w) * Math.PI);
          const y = h/2 + Math.sin(x * params.freq + offset + waveOffset) * waveAmp * edgeFade;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      requestAnimationFrame(drawWave);
    }

    resize();
    window.addEventListener('resize', resize);
    drawWave();
  });
}

/* ============================================================
   STARK LAB SIMULATOR & INTERACTIVE TERMINAL
   ============================================================ */
function initLabConsole() {
  const terminal = document.getElementById('terminalBody');
  const output = document.getElementById('terminalOutput');
  const buttons = document.querySelectorAll('.t-cmd');
  
  // Gague refs
  const reactorGauge = document.getElementById('reactorGauge');
  const reactorGaugeVal = document.getElementById('reactorGaugeVal');
  const reactorTemp = document.getElementById('reactorTemp');
  const reactorFlux = document.getElementById('reactorFlux');
  const reactorContain = document.getElementById('reactorContain');

  if (!terminal || !output) return;

  const cmdReplies = {
    diagnostics: [
      "[SYS] RUNNING SYSTEM DIAGNOSTICS...",
      "[J.A.R.V.I.S.] Initiating subsystem validation.",
      "-> Nanotech inventory reserves: 98.7% (NOMINAL)",
      "-> Arc Reactor Core Integrity: 99.85% (STABLE)",
      "-> Flight Stabilizers Calibration: 100% (COMPLETE)",
      "-> Repulsor Emitters: Optimal flux distribution.",
      "[SYS] ALL SUB-SYSTEMS NOMINAL. STATUS: READY."
    ],
    schematics: [
      "[SYS] DECRYPTING ENCRYPTED CLASS-8 BLUEPRINTS...",
      "[J.A.R.V.I.S.] Decrypting neural nanotech assembly layouts.",
      "-> Initializing security handshake (LEVEL 10)",
      "-> Decrypting Mark LXXXV nanoparticle matrix...",
      "-> Complete. Blueprint details compiled successfully.",
      "[SYS] SCHEMATICS LOADED. READY TO COMPILE."
    ],
    reactor: [
      "[SYS] QUERYING ARC REACTOR TELEMETRY DATA...",
      "[SYS] FUEL CODES VALIDATED: NEW VIBRANIUM ISOTOPE.",
      "-> Core Temperature: 847°C (NORMAL)",
      "-> Energy output rate: 3.2 GJ/s",
      "-> Containment Field: Stabilized, Zero leakage.",
      "[J.A.R.V.I.S.] Core output is fully optimal, sir."
    ],
    threats: [
      "[SYS] SCANNING THREAT DEFENSE MAINFRAMES...",
      "[J.A.R.V.I.S.] Checking orbital satellite feeds.",
      "-> Deep-space scanning active.",
      "-> Planetary airspace monitoring: CLEAR.",
      "-> local security perimeter: Secure.",
      "[SYS] NO ACTIVE THREATS IDENTIFIED IN CURRENT SECTOR."
    ]
  };

  // Typewriter effect inside terminal console
  function typeLogs(lines) {
    output.innerHTML = "";
    let lineIndex = 0;
    
    function printNextLine() {
      if (lineIndex < lines.length) {
        const p = document.createElement('p');
        p.className = 't-line t-log';
        p.textContent = lines[lineIndex];
        output.appendChild(p);
        
        // Auto scroll
        terminal.scrollTop = terminal.scrollHeight;
        
        lineIndex++;
        setTimeout(printNextLine, 120);
      }
    }
    printNextLine();
  }

  // Update SVG Gauge Dash offset
  function updateGauge(percent) {
    if (!reactorGauge) return;
    const r = 42;
    const circumference = 2 * Math.PI * r;
    const offset = circumference - (percent / 100) * circumference;
    
    reactorGauge.style.strokeDasharray = circumference;
    reactorGauge.style.strokeDashoffset = offset;
    
    if (reactorGaugeVal) reactorGaugeVal.textContent = `${percent}%`;
  }

  // Attach button triggers
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd === 'clear') {
        output.innerHTML = "<p class='t-line t-system'>[STARK OS] Mainframe cleared. Awaiting commands...</p>";
        updateGauge(90);
        if (reactorTemp) reactorTemp.textContent = '847°C';
        if (reactorFlux) reactorFlux.textContent = '3.2 GJ/s';
        if (reactorContain) {
          reactorContain.textContent = 'STABLE';
          reactorContain.style.color = '';
        }
      } else {
        const lines = cmdReplies[cmd];
        if (lines) {
          typeLogs(lines);
          
          // Animate the gauges dynamically based on what was clicked for high-tech premium feel
          if (cmd === 'diagnostics') {
            updateGauge(98);
            if (reactorTemp) reactorTemp.textContent = '812°C';
            if (reactorFlux) reactorFlux.textContent = '3.1 GJ/s';
          } else if (cmd === 'reactor') {
            updateGauge(100);
            if (reactorTemp) reactorTemp.textContent = '882°C';
            if (reactorFlux) reactorFlux.textContent = '4.5 GJ/s';
            if (reactorContain) {
              reactorContain.textContent = 'MAXIMUM';
              reactorContain.style.color = 'var(--stark-gold)';
            }
          } else if (cmd === 'threats') {
            updateGauge(82);
            if (reactorTemp) reactorTemp.textContent = '830°C';
            if (reactorFlux) reactorFlux.textContent = '2.8 GJ/s';
          }
        }
      }
    });
  });
}

/* ============================================================
   AI CARDS - IMAGE SLIDESHOW/CAROUSEL CONTROLLER
   ============================================================ */
function initAICarousels() {
  const carousels = document.querySelectorAll('.ai-card-images');
  
  carousels.forEach(carousel => {
    const images = carousel.querySelectorAll('.ai-img');
    const dots = carousel.querySelectorAll('.ai-dot');
    if (images.length <= 1) return; // Skip if single image (like Friday or Ultron)

    let currentIdx = 0;
    let timer = null;

    function showImage(idx) {
      images.forEach(img => img.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      images[idx].classList.add('active');
      dots[idx].classList.add('active');
      currentIdx = idx;
    }

    // Set up manual dot selection click
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid triggering card-level clicks
        if (window.playClickSound) window.playClickSound();
        const idx = parseInt(dot.getAttribute('data-index'));
        showImage(idx);
        resetTimer();
      });
    });

    // Auto slideshow cycle every 5 seconds
    function startTimer() {
      timer = setInterval(() => {
        let nextIdx = (currentIdx + 1) % images.length;
        showImage(nextIdx);
      }, 5000);
    }

    function resetTimer() {
      clearInterval(timer);
      startTimer();
    }

    startTimer();
  });
}

/* ============================================================
   HOLOGRAPHIC HUD LIGHTBOX MODAL SYSTEM
   ============================================================ */
function initLightbox() {
  const lightbox = document.getElementById('hudLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTag = document.getElementById('lightboxTag');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxOverlay = document.getElementById('lightboxOverlay');

  if (!lightbox || !lightboxImg) return;

  // Premium Web Audio sound effects for the Lightbox
  function playLightboxOpenSound() {
    try {
      const now = audioCtx ? audioCtx.currentTime : 0;
      if (!audioCtx) return;
      
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      
      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(850, now + 0.35);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(250, now);
      filter.frequency.exponentialRampToValueAtTime(1600, now + 0.35);
      
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.05, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      
      osc.start(now);
      osc.stop(now + 0.38);
    } catch (e) {}
  }

  function playLightboxCloseSound() {
    try {
      const now = audioCtx ? audioCtx.currentTime : 0;
      if (!audioCtx) return;
      
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.18);
      
      gainNode.gain.setValueAtTime(0.025, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      
      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {}
  }

  // Open modal
  function openLightbox(imgSrc, tagText, titleText, descText, type) {
    lightboxImg.src = imgSrc;
    lightboxTag.textContent = tagText || "CALIBRATION SYSTEM // ENGAGED";
    lightboxTitle.textContent = titleText || "SYSTEM CONFIGURATION";
    lightboxDesc.textContent = descText || "Full tactical telemetry and structural visualization.";

    // Generate mock telemetry specs based on card type to feel high-tech
    let specsHtml = '';
    if (type === 'reactor') {
      specsHtml = `
        <div class="lightbox-telemetry">
          <div class="telemetry-item"><span>FUEL CLASSIFICATION</span><strong>NEW Vibranium Isotope</strong></div>
          <div class="telemetry-item"><span>CONTAINMENT FIELD</span><strong>99.98% (STABLE)</strong></div>
          <div class="telemetry-item"><span>THERMAL GRADIENT</span><strong>847°C NOMINAL</strong></div>
          <div class="telemetry-item"><span>ENERGY OUTPUT</span><strong>15+ GJ/S MAXIMUM</strong></div>
        </div>
      `;
    } else if (type === 'armor') {
      specsHtml = `
        <div class="lightbox-telemetry">
          <div class="telemetry-item"><span>PLATE COMPOSITION</span><strong>NANOTECH GOLD-TITANIUM</strong></div>
          <div class="telemetry-item"><span>REPULSOR STATUS</span><strong>ARMED / NOMINAL</strong></div>
          <div class="telemetry-item"><span>OS PLATFORM</span><strong>J.A.R.V.I.S. v4.7</strong></div>
          <div class="telemetry-item"><span>TACTICAL UPLINK</span><strong>SECURE / ACTIVE</strong></div>
        </div>
      `;
    } else if (type === 'gps') {
      specsHtml = `
        <div class="lightbox-telemetry">
          <div class="telemetry-item"><span>QUANTUM COORDINATE</span><strong>LOCATED / LOCK</strong></div>
          <div class="telemetry-item"><span>TEMPORAL DRIFT</span><strong>0.000% NOMINAL</strong></div>
          <div class="telemetry-item"><span>MÖBIUS EQUATION</span><strong>STABLE SOLUTION</strong></div>
          <div class="telemetry-item"><span>RE-ENTRY MAP</span><strong>ACTIVE MAP READY</strong></div>
        </div>
      `;
    } else if (type === 'ai') {
      specsHtml = `
        <div class="lightbox-telemetry">
          <div class="telemetry-item"><span>COGNITIVE MATRIX</span><strong>INTELLIGENCE LEVEL 10</strong></div>
          <div class="telemetry-item"><span>THREAT SHIELD</span><strong>CALIBRATED / RUNNING</strong></div>
          <div class="telemetry-item"><span>PROCESSING DEPTH</span><strong>NEURAL WAVEFORM OK</strong></div>
          <div class="telemetry-item"><span>STATUS REPORT</span><strong>SYSTEM ACCESS GRANTED</strong></div>
        </div>
      `;
    }

    // Remove existing telemetry if any
    const existingTelem = lightbox.querySelector('.lightbox-telemetry');
    if (existingTelem) {
      existingTelem.remove();
    }

    // Insert new specs before details end
    if (specsHtml) {
      const details = lightbox.querySelector('.lightbox-details');
      details.insertAdjacentHTML('beforeend', specsHtml);
    }

    lightbox.classList.add('active');
    playLightboxOpenSound();

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  // Close modal
  function closeLightbox() {
    lightbox.classList.remove('active');
    playLightboxCloseSound();
    
    // Restore body scroll after transition
    setTimeout(() => {
      lightboxImg.src = '';
      document.body.style.overflow = '';
    }, 400);
  }

  // Card click triggers
  // 1. Reactor cards
  document.querySelectorAll('.reactor-evol-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      const img = card.querySelector('.evol-img-wrap img');
      const tag = card.querySelector('.evol-tag');
      const title = card.querySelector('h3');
      const desc = card.querySelector('p');

      if (img) {
        openLightbox(img.src, tag ? tag.textContent : '', title ? title.textContent : '', desc ? desc.textContent : '', 'reactor');
      }
    });
  });

  // 2. Armor cards
  document.querySelectorAll('.armor-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      const img = card.querySelector('.armor-img-wrap img');
      const tag = card.querySelector('.armor-tag');
      const title = card.querySelector('h3');
      const desc = card.querySelector('p');

      if (img) {
        openLightbox(img.src, tag ? tag.textContent : '', title ? title.textContent : '', desc ? desc.textContent : '', 'armor');
      }
    });
  });

  // 3. Time GPS cards
  document.querySelectorAll('.time-gps-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      const img = card.querySelector('.gps-img-wrap img');
      const tag = card.querySelector('.gps-tag');
      const title = card.querySelector('h3');
      const desc = card.querySelector('p');

      if (img) {
        openLightbox(img.src, tag ? tag.textContent : '', title ? title.textContent : '', desc ? desc.textContent : '', 'gps');
      }
    });
  });

  // 4. AI cards
  document.querySelectorAll('.ai-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      // Ignore if user clicks on slideshow dots
      if (e.target.classList.contains('ai-dot')) return;
      
      const img = card.querySelector('.ai-card-images .ai-img.active') || card.querySelector('.ai-card-images .ai-img');
      const title = card.querySelector('.ai-name');
      const fullTag = card.querySelector('.ai-full');
      const desc = card.querySelector('.ai-desc');

      if (img) {
        const tagText = fullTag ? `AI MAINFRAME // ${fullTag.textContent}` : 'COGNITIVE MAINFRAME MODULE';
        openLightbox(img.src, tagText, title ? title.textContent : '', desc ? desc.textContent : '', 'ai');
      }
    });
  });

  // Close triggers
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', closeLightbox);
  
  // ESC key close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

