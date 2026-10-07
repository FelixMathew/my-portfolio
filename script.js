/**
 * Felix Mathew Portfolio Engine
 * High-Performance Vanilla Dynamic Client Architecture
 */

const body = document.body;
const modeButtons = document.querySelectorAll('[data-mode-value]');
const allowedModes = ['dots', 'plain', 'night', 'black'];
const savedMode = localStorage.getItem('felix-portfolio-mode');
const textSizeButtons = document.querySelectorAll('[data-text-size]');
const allowedTextSizes = ['small', 'default', 'large'];
const savedTextSize = localStorage.getItem('felix-portfolio-text-size');

// Mode Theming
function setMode(mode) {
  body.dataset.mode = mode;
  modeButtons.forEach((button) => button.classList.toggle('is-active', button.dataset.modeValue === mode));
  localStorage.setItem('felix-portfolio-mode', mode);
}
if (allowedModes.includes(savedMode)) setMode(savedMode);
modeButtons.forEach((button) => button.addEventListener('click', () => setMode(button.dataset.modeValue)));

// Typography Sizing
function setTextSize(size) {
  if (size === 'default') delete body.dataset.textSize;
  else body.dataset.textSize = size;
  textSizeButtons.forEach((button) => button.classList.toggle('is-active', button.dataset.textSize === size));
  localStorage.setItem('felix-portfolio-text-size', size);
}
if (allowedTextSizes.includes(savedTextSize)) setTextSize(savedTextSize);
textSizeButtons.forEach((button) => button.addEventListener('click', () => setTextSize(button.dataset.textSize)));

// Footer Current Year
const yearEl = document.querySelector('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Scroll Reveal Observer
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach((section) => revealObserver.observe(section));

// Battery Status Manager
const batteryPercentEl = document.getElementById('batteryPercent');
const batteryLevelEl = document.getElementById('batteryLevel');
const batteryStatusContainer = document.getElementById('batteryStatus');

function updateBattery(level, isCharging) {
  const percent = Math.round(level * 100);
  if (batteryPercentEl) batteryPercentEl.textContent = `${percent}%`;
  if (batteryLevelEl) {
    batteryLevelEl.style.width = `${Math.min(Math.max(percent, 6), 100)}%`;
    if (percent <= 20) {
      batteryLevelEl.style.background = '#ef4444';
      if (batteryPercentEl) batteryPercentEl.style.color = '#ef4444';
    } else {
      batteryLevelEl.style.background = '';
      if (batteryPercentEl) batteryPercentEl.style.color = '';
    }
  }
  if (batteryStatusContainer) {
    batteryStatusContainer.setAttribute(
      'title',
      `Battery: ${percent}%${isCharging ? ' (Charging ⚡)' : ''}`
    );
  }
}

if ('getBattery' in navigator) {
  navigator.getBattery().then((battery) => {
    updateBattery(battery.level, battery.charging);
    battery.addEventListener('levelchange', () => updateBattery(battery.level, battery.charging));
    battery.addEventListener('chargingchange', () => updateBattery(battery.level, battery.charging));
  }).catch(() => {
    updateBattery(0.84, false);
  });
} else {
  updateBattery(0.84, false);
}

// Resume Pop-up Modal Manager
const resumeLinks = document.querySelectorAll('.resume-callout, .footer-nav a[href*="resume.pdf"]');
const resumeModal = document.getElementById('resume-modal');
const resumeCloseBtn = document.getElementById('resume-modal-close');
const resumeBackdrop = document.getElementById('resume-modal-backdrop');

function openResumeModal(e) {
  if (e) e.preventDefault();
  if (!resumeModal) return;
  resumeModal.classList.add('is-open');
  resumeModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeResumeModal() {
  if (!resumeModal) return;
  resumeModal.classList.remove('is-open');
  resumeModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

resumeLinks.forEach((link) => {
  link.addEventListener('click', openResumeModal);
});

if (resumeCloseBtn) resumeCloseBtn.addEventListener('click', closeResumeModal);
if (resumeBackdrop) resumeBackdrop.addEventListener('click', closeResumeModal);

// Secret Admin CMS Shortcut: Ctrl + Shift + A
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (resumeModal && resumeModal.classList.contains('is-open')) closeResumeModal();
  }
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
    e.preventDefault();
    window.open('/admin.html', '_blank');
  }
});

// Interactive Featured Projects Store (The 3 Flagship Projects)
let featuredProjectsStore = {
  'disaster-ai-solutions': {
    id: 'disaster-ai-solutions',
    title: 'DisasterAI – Disaster Detection System (API)',
    sub: 'Machine Learning-Based Disaster Detection System · FastAPI & Computer Vision',
    date: 'Jan 2026 – Apr 2026',
    tag: 'AI / Vision',
    tagClass: 'tag-ai',
    meta: 'FastAPI · PyTorch · OpenCV · Jan 2026 – Apr 2026',
    githubUrl: 'https://github.com/FelixMathew/disaster-ai-solutions',
    liveUrl: 'https://disaster-ai-solutions.vercel.app',
    bullets: [
      'Architected and trained an end-to-end computer vision and ML classification pipeline to detect disaster scenarios (SAFE/DAMAGE) from live video feeds and satellite imagery.',
      'Built high-performance, low-latency asynchronous inference endpoints using <strong>FastAPI</strong>, processing image preprocessing (normalization, resizing) and batch predictions in under <strong>120ms</strong>.',
      'Engineered robust feature extraction workflows using <strong>OpenCV, Scikit-learn, and PyTorch</strong>, accelerating model training convergence and precision across multi-class damage assessments.',
      'Integrated early warning alert webhooks and an interactive monitoring dashboard for emergency response teams.'
    ]
  },
  'heart-disease-classification': {
    id: 'heart-disease-classification',
    title: 'Heart Disease Classification System',
    sub: 'Clinical Predictive Analytics & Health Risk Classification',
    date: 'Feb 2025 – Apr 2025',
    tag: 'Machine Learning',
    tagClass: 'tag-health',
    meta: 'Scikit-learn · Pandas · XGBoost · Flask · Feb 2025 – Apr 2025',
    githubUrl: 'https://github.com/FelixMathew/AI-powered-heart-failure-risk-prediction',
    liveUrl: 'https://heart-disease-classifier.vercel.app',
    bullets: [
      'Engineered an AI-powered diagnostic risk classification system evaluating patient biometric metrics (blood pressure, cholesterol, ECG features) to predict cardiovascular failure.',
      'Conducted extensive exploratory data analysis (EDA), synthetic minority oversampling (SMOTE), and cross-validation across <strong>Random Forest, Logistic Regression, and XGBoost</strong>.',
      'Achieved <strong>91.4% classification accuracy and 0.93 ROC-AUC score</strong> with feature importance interpretability via SHAP values.',
      'Packaged trained models into lightweight REST API microservices with interactive prediction UI for clinical screenings.'
    ]
  },
  'movie-ticket-booking-system': {
    id: 'movie-ticket-booking-system',
    title: 'Movie Ticket Booking System (MERN Stack)',
    sub: 'Scalable MERN Architecture & Real-Time Seat Reservation Engine',
    date: 'Jul 2025 – Nov 2025',
    tag: 'Full Stack',
    tagClass: 'tag-fullstack',
    meta: 'React.js · Node.js · Express · MongoDB · Jul 2025 – Nov 2025',
    githubUrl: 'https://github.com/FelixMathew/movie-ticket-booker',
    liveUrl: 'https://movie-ticket-booking-mern.vercel.app',
    bullets: [
      'Engineered a high-concurrency ticket reservation web application using <strong>React.js, Node.js, Express.js, and MongoDB</strong>, enabling real-time seat selection and payment verification.',
      'Implemented secure <strong>JWT authentication with role-based authorization</strong> separating customer accounts and cinema administration dashboards.',
      'Optimized MongoDB schema design with compound indexing and transactions, effortlessly handling <strong>100+ simultaneous booking attempts</strong> without double-booking anomalies.',
      'Built automated REST API test suites using Postman and Jest to guarantee bulletproof endpoint reliability.'
    ]
  }
};

function selectFeaturedProject(projId, rowEl) {
  let data = featuredProjectsStore[projId];
  if (!data) {
    const key = Object.keys(featuredProjectsStore).find(k =>
      projId.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(projId.toLowerCase())
    );
    if (key) data = featuredProjectsStore[key];
  }
  if (!data) return;

  // 1. Update active class on rows
  const allRows = document.querySelectorAll('.fp-project-row');
  allRows.forEach(r => r.classList.remove('is-active'));
  if (rowEl) rowEl.classList.add('is-active');

  // 2. Update card content
  const cardTitle = document.getElementById('fpCardTitle');
  const cardTag = document.getElementById('fpCardTag');
  const cardMeta = document.getElementById('fpCardMeta');
  const cardBullets = document.getElementById('fpCardBullets');
  const cardGithub = document.getElementById('fpCardGithubLink');
  const cardLive = document.getElementById('fpCardLiveLink');
  const cardEl = document.getElementById('fpDetailCard');

  if (cardTitle) cardTitle.textContent = data.title;
  if (cardTag) {
    cardTag.textContent = data.tag || 'AI / Vision';
    cardTag.className = `domain-tag ${data.tagClass || 'tag-ai'}`;
  }
  if (cardMeta) cardMeta.textContent = data.meta || `${data.tag || ''} · ${data.date || ''}`;

  if (cardBullets && data.bullets) {
    cardBullets.innerHTML = data.bullets.map(b => {
      let formatted = b.replace(/==([^=]+)==/g, '<mark>$1</mark>');
      return `<li>${formatted}</li>`;
    }).join('');
  }

  if (cardGithub) {
    if (data.githubUrl) {
      cardGithub.href = data.githubUrl;
      cardGithub.style.display = 'inline-flex';
    } else {
      cardGithub.style.display = 'none';
    }
  }

  if (cardLive) {
    if (data.liveUrl) {
      cardLive.href = data.liveUrl;
      cardLive.style.display = 'inline-flex';
    } else {
      cardLive.style.display = 'none';
    }
  }

  // 3. Align card caret vertically with the hovered project row
  if (rowEl && cardEl) {
    const rowRect = rowEl.getBoundingClientRect();
    const cardRect = cardEl.getBoundingClientRect();
    const relativeMidY = (rowRect.top + rowRect.height / 2) - cardRect.top;
    const clampedY = Math.max(16, Math.min(cardRect.height - 26, relativeMidY - 7));
    cardEl.style.setProperty('--caret-top', `${clampedY}px`);
  }
}

function initFeaturedProjectsInteractions() {
  const rows = document.querySelectorAll('.fp-project-row');
  rows.forEach((row) => {
    const projId = row.dataset.projId;
    if (!projId) return;

    row.onmouseenter = () => selectFeaturedProject(projId, row);
    row.onclick = () => selectFeaturedProject(projId, row);
    row.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectFeaturedProject(projId, row);
      }
    };
  });
}

function initExperienceInteractions() {
  const cards = document.querySelectorAll('.exp-project-card');
  cards.forEach((card) => {
    const header = card.querySelector('.exp-project-header');
    if (header) {
      header.onclick = (e) => {
        e.preventDefault();
        const isOpen = card.classList.contains('is-open');
        const track = card.closest('.exp-projects-track');
        if (track) {
          track.querySelectorAll('.exp-project-card').forEach(c => c.classList.remove('is-open'));
        }
        if (!isOpen) {
          card.classList.add('is-open');
        }
      };
    }
  });
}

// Pet Projects Accordion Manager
function initPetProjectsAccordion() {
  const petCards = document.querySelectorAll('.pet-card');
  petCards.forEach((card) => {
    const summary = card.querySelector('.pet-card-summary');
    if (summary) {
      summary.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        card.classList.toggle('is-open');
      });
    }
  });
}

// --- Dynamic CMS Data Hydration Engine ---
async function hydratePortfolioFromCMS() {
  let data = null;

  const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (isLocalDev) {
    try {
      const res = await fetch(`/api/data?t=${Date.now()}`);
      if (res.ok) {
        data = await res.json();
        localStorage.setItem('felix_portfolio_cms_data', JSON.stringify(data));
      }
    } catch (err) {}
  }

  if (!data) {
    const local = localStorage.getItem('felix_portfolio_cms_data');
    if (local) {
      try { data = JSON.parse(local); } catch (e) {}
    }
  }

  if (!data) {
    try {
      const fileRes = await fetch(`portfolio-data.json?t=${Date.now()}`);
      if (fileRes.ok) data = await fileRes.json();
    } catch (e) {}
  }

  if (!data) {
    // Initial static bindings
    initExperienceInteractions();
    initFeaturedProjectsInteractions();
    initPetProjectsAccordion();
    return;
  }

  // 1. Hydrate Identity & Bio
  if (data.identity) {
    const id = data.identity;
    const nameEls = document.querySelectorAll('.identity h1, #header-profile-name');
    nameEls.forEach(el => el.textContent = id.name || 'Felix Mathew');

    const kickerEl = document.querySelector('.identity .eyebrow');
    if (kickerEl && id.kicker) kickerEl.textContent = id.kicker;

    const locationEl = document.querySelector('.identity .location');
    if (locationEl && id.location) locationEl.textContent = id.location;

    const bioEl = document.querySelector('.intro-grid .bio');
    if (bioEl && id.bioParagraphs && id.bioParagraphs.length > 0) {
      let bioHtml = '';
      const highlight = (id.highlightedText || '').trim();

      id.bioParagraphs.forEach((p) => {
        let formattedP = p;

        // Support markdown ==text==
        formattedP = formattedP.replace(/==([^=]+)==/g, '<mark>$1</mark>');

        // If paragraph does not already contain <mark>, apply highlightedText
        if (highlight && !formattedP.includes('<mark>')) {
          const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`(${escaped})`, 'gi');
          formattedP = formattedP.replace(regex, '<mark>$1</mark>');
        }

        bioHtml += `<p>${formattedP}</p>`;
      });

      if (id.availabilityNote) {
        bioHtml += `<p class="availability-note"><span>✦</span> ${id.availabilityNote}</p>`;
      }
      bioEl.innerHTML = bioHtml;
    }

    if (id.profileImage) {
      const imgEl = document.querySelector('.photo-frame img');
      if (imgEl) imgEl.src = id.profileImage;
    }
  }

  // 2. Hydrate Experience & Build Interactive Accordion
  if (data.experience && data.experience.length > 0) {
    const timelineCol = document.querySelector('.exp-timeline-col');
    if (timelineCol) {
      let timelineHtml = '';
      data.experience.forEach((role, rIdx) => {
        const rId = role.id || `role-${rIdx}`;
        const projects = role.projects || [];
        let projectsHtml = '';

        projects.forEach((proj, pIdx) => {
          const pId = proj.id || `proj-${rIdx}-${pIdx}`;
          const pTag = proj.tag || 'Web Dev';
          const pTagClass = proj.tagClass || (pTag.toLowerCase().includes('health') ? 'tag-health' : (pTag.toLowerCase().includes('ai') ? 'tag-ai' : (pTag.toLowerCase().includes('stack') ? 'tag-fullstack' : 'tag-web')));
          const isOpen = (rIdx === 0 && pIdx === 0);
          const bulletsList = (proj.bullets && proj.bullets.length > 0) ? proj.bullets : (role.bullets || []);
          const bulletsHtml = bulletsList.map(b => `<li>${b.replace(/==([^=]+)==/g, '<mark>$1</mark>')}</li>`).join('');
          const periodText = proj.meta || role.date || '';

          projectsHtml += `
            <div class="exp-project-card ${isOpen ? 'is-open' : ''}" data-proj-id="${pId}">
              <div class="exp-project-header">
                <div class="exp-project-text">
                  <span class="exp-project-name">${proj.name || 'Project'}</span>
                  ${proj.sub ? `<span class="exp-project-sub">${proj.sub}</span>` : ''}
                </div>
                <div class="exp-project-actions">
                  <span class="domain-tag ${pTagClass}">${pTag}</span>
                  <span class="exp-chevron">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </span>
                </div>
              </div>
              <div class="exp-project-body">
                <div class="exp-project-period">${periodText}</div>
                <ul class="exp-project-bullets">
                  ${bulletsHtml}
                </ul>
              </div>
            </div>
          `;
        });

        timelineHtml += `
          <div class="exp-role-block" data-role="${rId}">
            <div class="exp-role-date-col">${role.date || ''}</div>
            <h3 class="exp-role-title">${role.role || ''} <i>·</i> <span class="exp-role-company">${role.company || ''}</span></h3>
            <div class="exp-role-location">${role.location || ''}</div>
            <div class="exp-projects-track">
              ${projectsHtml}
            </div>
          </div>
        `;
      });
      timelineCol.innerHTML = timelineHtml;
      initExperienceInteractions();
    }
  }

  // 2.5 Hydrate Featured Flagship Projects (The 3 Flagships)
  if (data.featuredProjects && data.featuredProjects.length > 0) {
    featuredProjectsStore = {};
    data.featuredProjects.forEach(p => {
      featuredProjectsStore[p.id] = p;
    });

    const listCol = document.getElementById('featuredProjectsList');
    if (listCol) {
      let listHtml = '';
      data.featuredProjects.forEach((proj, idx) => {
        const isActive = idx === 0 ? 'is-active' : '';
        listHtml += `
          <div class="fp-project-row ${isActive}" data-proj-id="${proj.id}" tabindex="0">
            <div class="fp-row-date">${proj.date || ''}</div>
            <div class="fp-row-content">
              <div class="fp-row-title-wrap">
                <span class="fp-row-title">${proj.title || 'Project'}</span>
                <span class="domain-tag ${proj.tagClass || 'tag-ai'}">${proj.tag || ''}</span>
              </div>
              <div class="fp-row-sub">${proj.sub || ''}</div>
            </div>
          </div>
        `;
      });
      listCol.innerHTML = listHtml;

      const firstRow = listCol.querySelector('.fp-project-row');
      if (firstRow && data.featuredProjects[0]) {
        selectFeaturedProject(data.featuredProjects[0].id, firstRow);
      }
    }
    initFeaturedProjectsInteractions();
  }

  // 3. Hydrate Pet Projects
  if (data.petProjects && data.petProjects.length > 0) {
    const gridEl = document.querySelector('.pet-projects-grid');
    if (gridEl) {
      let gridHtml = '';
      data.petProjects.forEach((proj) => {
        gridHtml += `
          <div class="pet-card">
            <div class="pet-card-summary">
              <h3 class="pet-card-title">${proj.title || 'Untitled Project'}</h3>
              <span class="pet-card-chevron"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>
            </div>
            <div class="pet-card-body">
              <p class="pet-card-desc">${(proj.desc || '').replace(/==([^=]+)==/g, '<mark>$1</mark>')}</p>
              <ul class="pet-card-bullets">
                ${(proj.bullets || []).map(b => `<li>${b.replace(/==([^=]+)==/g, '<mark>$1</mark>')}</li>`).join('')}
              </ul>
              <div class="pet-tech-pills">
                ${(proj.tags || []).map(t => `<span>${t}</span>`).join('')}
              </div>
              <div class="pet-card-links">
                ${proj.githubUrl ? `<a href="${proj.githubUrl}" target="_blank" rel="noreferrer">GitHub</a>` : ''}
                ${proj.liveUrl ? `<a href="${proj.liveUrl}" target="_blank" rel="noreferrer">Live</a>` : ''}
              </div>
            </div>
          </div>
        `;
      });
      gridEl.innerHTML = gridHtml;
    }
  }

  // 4. Hydrate Stats
  if (data.stats) {
    if (data.stats.leetcode) {
      const lc = data.stats.leetcode;
      const solvedEl = document.querySelector('#lc-solved-val');
      if (solvedEl && lc.solved) solvedEl.textContent = lc.solved;
      const subEl = document.querySelector('#lc-submissions-val');
      if (subEl && lc.submissions) subEl.textContent = lc.submissions;
    }
    if (data.stats.github) {
      const gh = data.stats.github;
      const reposEl = document.querySelector('#gh-repos-val');
      if (reposEl && gh.publicRepos) reposEl.textContent = gh.publicRepos;
      const commitsEl = document.querySelector('#gh-commits-val');
      if (commitsEl && gh.totalCommits) commitsEl.textContent = gh.totalCommits;
    }
  }

  // 5. Hydrate Events & People
  if (data.eventsPeople && data.eventsPeople.length > 0) {
    const eventsGrid = document.querySelector('.events-grid');
    if (eventsGrid) {
      let eventsHtml = '';
      data.eventsPeople.forEach((ev) => {
        eventsHtml += `
          <article class="event-card">
            <div class="event-img-wrap">
              <img src="${ev.image || ''}" alt="${ev.title || 'Event'}" loading="lazy" />
            </div>
            <div class="event-card-body">
              <h3 class="event-card-title">${ev.title || ''}</h3>
              <p class="event-card-desc">${ev.desc || ''}</p>
            </div>
          </article>
        `;
      });
      eventsGrid.innerHTML = eventsHtml;
    }
  }

  // 6. Hydrate What I'm Chasing (if custom data exists)
  if (data.chasing) {
    if (data.chasing.workspaceText) {
      const introEl = document.querySelector('.chasing-intro-text');
      if (introEl) {
        const linkHref = data.chasing.workspaceLink || 'https://life.sribalaji.io';
        const linkText = data.chasing.workspaceLabel || 'life.sribalaji.io';
        let formattedIntro = data.chasing.workspaceText.replace(
          linkText,
          `<a href="${linkHref}" target="_blank" rel="noreferrer" class="chasing-link">${linkText}</a>`
        );
        formattedIntro = formattedIntro.replace(/==([^=]+)==/g, '<mark>$1</mark>');
        introEl.innerHTML = formattedIntro;
      }
    }
    if (data.chasing.paragraphs && data.chasing.paragraphs.length > 0) {
      const contentEl = document.querySelector('.chasing-content');
      if (contentEl) {
        contentEl.innerHTML = data.chasing.paragraphs.map(p => {
          let formatted = p.replace(/==([^=]+)==/g, '<mark>$1</mark>');
          return `<p>${formatted}</p>`;
        }).join('');
      }
    }
    if (data.chasing.photos && data.chasing.photos.length > 0) {
      const photoCards = document.querySelectorAll('.chasing-photo-card img');
      data.chasing.photos.forEach((photo, idx) => {
        if (photoCards[idx] && photo.image) {
          photoCards[idx].src = photo.image;
          if (photo.alt) photoCards[idx].alt = photo.alt;
        }
      });
    }
    if (data.chasing.accordionTitle) {
      const titleEl = document.querySelector('.chasing-header-title');
      if (titleEl) titleEl.textContent = data.chasing.accordionTitle;
    }
  }

  // 7. Hydrate Certifications
  if (data.proof && data.proof.certifications) {
    const certListContainer = document.getElementById('certListContainer');
    const certCountDisplay = document.getElementById('certCountDisplay');
    if (certCountDisplay) certCountDisplay.textContent = data.proof.certifications.length;
    if (certListContainer) {
      certListContainer.innerHTML = data.proof.certifications.map(c => {
        const isCompleted = (c.status || 'completed').toLowerCase() !== 'in_progress';
        const iconSvg = isCompleted
          ? `<svg class="cert-check-icon" viewBox="0 0 20 20" width="16" height="16" fill="#10b981"><path fill-rule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"></path></svg>`
          : `<svg class="cert-pending-icon" viewBox="0 0 20 20" width="16" height="16" fill="#9ca3af"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clip-rule="evenodd"></path></svg>`;

        const titleHtml = c.url
          ? `<a href="${c.url}" target="_blank" rel="noreferrer">${c.name || ''}</a>`
          : (c.name || '');

        const dateClass = isCompleted ? 'cert-date-col' : 'cert-date-col cert-status-in-progress';
        const dateText = isCompleted ? (c.date || '') : (c.date || 'In Progress');

        return `
          <div class="cert-row">
            <div class="cert-icon-col">${iconSvg}</div>
            <div class="cert-info-col">
              <h4 class="cert-name">${titleHtml}</h4>
              <p class="cert-issuer">${c.issuer || ''}</p>
            </div>
            <div class="${dateClass}">${dateText}</div>
          </div>
        `;
      }).join('');
    }
  }

  // 8. Hydrate Courses & Coursework
  if (data.proof && data.proof.courses) {
    const coursesListContainer = document.getElementById('coursesListContainer');
    const coursesCountDisplay = document.getElementById('coursesCountDisplay');
    if (coursesCountDisplay) coursesCountDisplay.textContent = data.proof.courses.length;
    if (coursesListContainer) {
      coursesListContainer.innerHTML = data.proof.courses.map(c => `
        <span class="course-pill">${c}</span>
      `).join('');
    }
  }

  // 9. Hydrate Moments
  if (data.proof && data.proof.moments) {
    const momentsContainer = document.getElementById('momentsTimelineContainer');
    if (momentsContainer) {
      momentsContainer.innerHTML = data.proof.moments.map(m => `
        <div class="moment-item">
          <div class="moment-year">${m.year || ''}</div>
          <div class="moment-text">${(m.text || '').replace(/==([^=]+)==/g, '<mark>$1</mark>')}</div>
        </div>
      `).join('');
    }
  }

  // 10. Hydrate Education Timeline & Hobbies
  if (data.education) {
    if (data.education.accordionTitle) {
      const eduTitleEl = document.querySelector('.education-header-title');
      if (eduTitleEl) eduTitleEl.textContent = data.education.accordionTitle;
    }
    if (data.education.timeline && data.education.timeline.length > 0) {
      const eduContainer = document.getElementById('educationTimelineContainer');
      if (eduContainer) {
        eduContainer.innerHTML = data.education.timeline.map(item => `
          <div class="edu-timeline-item">
            <div class="edu-period">${item.period || ''}</div>
            <div class="edu-details">
              <h4 class="edu-degree">${item.degree || ''}</h4>
              <p class="edu-institution">${item.institution || ''}</p>
            </div>
          </div>
        `).join('');
      }
    }
    if (data.education.personalParagraph) {
      const hobbiesEl = document.getElementById('personalHobbiesText');
      if (hobbiesEl) {
        let formatted = data.education.personalParagraph.replace(/==([^=]+)==/g, '<mark>$1</mark>');
        hobbiesEl.innerHTML = formatted;
      }
    }
  }

  initExperienceInteractions();
  initFeaturedProjectsInteractions();
  initPetProjectsAccordion();
  initChasingAccordion();
  initCoursesAccordion();
  initEducationAccordion();
}

function initChasingAccordion() {
  const toggleBtn = document.getElementById('chasingToggleBtn');
  const accordion = document.getElementById('chasingAccordion');
  const labelEl = document.getElementById('chasingToggleLabel');

  if (!toggleBtn || !accordion) return;

  toggleBtn.onclick = function() {
    const isCollapsed = accordion.classList.toggle('is-collapsed');
    accordion.classList.toggle('is-open', !isCollapsed);
    toggleBtn.setAttribute('aria-expanded', !isCollapsed);
    if (labelEl) {
      labelEl.textContent = isCollapsed ? 'expand' : 'collapse';
    }
  };
}

function initCoursesAccordion() {
  const toggleBtn = document.getElementById('coursesToggleBtn');
  const accordion = document.getElementById('coursesAccordion');
  const labelEl = document.getElementById('coursesToggleLabel');

  if (!toggleBtn || !accordion) return;

  toggleBtn.onclick = function() {
    const isCollapsed = accordion.classList.toggle('is-collapsed');
    accordion.classList.toggle('is-open', !isCollapsed);
    toggleBtn.setAttribute('aria-expanded', !isCollapsed);
    if (labelEl) {
      labelEl.textContent = isCollapsed ? 'expand' : 'collapse';
    }
  };
}

function initEducationAccordion() {
  const toggleBtn = document.getElementById('educationToggleBtn');
  const accordion = document.getElementById('educationAccordion');
  const labelEl = document.getElementById('educationToggleLabel');

  if (!toggleBtn || !accordion) return;

  toggleBtn.onclick = function() {
    const isCollapsed = accordion.classList.toggle('is-collapsed');
    accordion.classList.toggle('is-open', !isCollapsed);
    toggleBtn.setAttribute('aria-expanded', !isCollapsed);
    if (labelEl) {
      labelEl.textContent = isCollapsed ? 'expand' : 'collapse';
    }
  };
}

// Initial setup
initFeaturedProjectsInteractions();
initChasingAccordion();
initCoursesAccordion();
initEducationAccordion();

// Kick off hydration
document.addEventListener('DOMContentLoaded', () => {
  hydratePortfolioFromCMS();
  initFeaturedProjectsInteractions();
  initChasingAccordion();
  initCoursesAccordion();
  initEducationAccordion();
});



