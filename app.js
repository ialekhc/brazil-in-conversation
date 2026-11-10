/**
 * BRAZIL, IN CONVERSATION — APPLICATION LOGIC
 * COMM 317 Intercultural Communication Project
 * Author: Snigdh Acharya | Millersville University
 */

(function () {
  'use strict';

  // 1. DATA EXTRACTION
  const { chapters = [], references = [], photos = [] } = window.CULTURE_DATA || {};
  const main = document.querySelector('main');
  const globalProgressBar = document.querySelector('.global-progress-bar');
  const headerProgressChip = document.getElementById('header-progress-chip');
  const headerProgressText = document.getElementById('header-progress-text');
  const siteHeader = document.getElementById('site-header');
  const menuToggle = document.getElementById('menu-toggle');
  const siteNav = document.getElementById('nav');
  const navBackdrop = document.getElementById('nav-backdrop');

  // Curated additional high-res images for cultural depth
  const addedImages = [
    {
      id: 'acaraje',
      src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Baianas_do_Acaraj%C3%A9.jpg/1280px-Baianas_do_Acaraj%C3%A9.jpg',
      alt: 'Three baianas prepare acarajé at a street-food stall in Brazil.',
      caption: 'Baianas preparing acarajé in traditional attire',
      credit: 'DiegoL569 / Wikimedia Commons',
      source: 'https://commons.wikimedia.org/wiki/File:Baianas_do_Acaraj%C3%A9.jpg',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/'
    },
    {
      id: 'libras',
      src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/CoraldeLibras.jpg/1280px-CoraldeLibras.jpg',
      alt: 'A choir using Brazilian Sign Language performs at an accessibility event in 2015.',
      caption: 'Libras choir at an accessibility event (2015)',
      credit: 'Tânia Rêgo / Agência Brasil / Wikimedia Commons',
      source: 'https://commons.wikimedia.org/wiki/File:CoraldeLibras.jpg',
      license: 'CC BY 3.0 Brazil',
      licenseUrl: 'https://creativecommons.org/licenses/by/3.0/br/'
    },
    {
      id: 'samba',
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Samba_de_Roda_do_Rec%C3%B4ncavo_-_Bahia_-_3909_024.jpg/1280px-Samba_de_Roda_do_Rec%C3%B4ncavo_-_Bahia_-_3909_024.jpg',
      alt: 'Samba de Roda musicians and a dancer perform in the Recôncavo Baiano.',
      caption: 'Samba de Roda in the Recôncavo Baiano (2004)',
      credit: 'Maria Eugenia Tita / Wikimedia Commons',
      source: 'https://commons.wikimedia.org/wiki/File:Samba_de_Roda_do_Rec%C3%B4ncavo_-_Bahia_-_3909_024.jpg',
      license: 'CC BY 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/4.0/'
    },
    {
      id: 'streetFood',
      src: 'https://images.unsplash.com/photo-1761789083620-b90927bd8a28?auto=format&fit=crop&fm=jpg&q=80&w=1600',
      alt: 'People gathered outside a pastel shop in São Paulo.',
      caption: 'Everyday street food gathering in São Paulo',
      credit: 'Selena Jiménez / Unsplash',
      source: 'https://unsplash.com/photos/people-gathered-outside-a-pastel-shop-in-sao-paulo-rltaNQ1m7XI',
      license: 'Unsplash License'
    },
    {
      id: 'capoeira',
      src: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Roda_de_capoeira4.jpg',
      alt: 'Capoeira roda in Porto Alegre, with two players in the center and participants around them.',
      caption: 'Capoeira roda in Porto Alegre (2007)',
      credit: 'Ricardo André Frantz / Wikimedia Commons',
      source: 'https://commons.wikimedia.org/wiki/File:Roda_de_capoeira4.jpg',
      license: 'CC BY-SA 3.0'
    },
    {
      id: 'soccerFans',
      src: 'https://images.unsplash.com/photo-1671037876930-265bbf35e6a9?auto=format&fit=crop&fm=jpg&q=80&w=1600',
      alt: 'Football supporters in Belo Horizonte watching Brazil play in the 2022 World Cup.',
      caption: 'Supporters watching Brazil in Belo Horizonte (2022)',
      credit: 'Nathalia Segato / Unsplash',
      source: 'https://unsplash.com/photos/a-group-of-people-in-yellow-shirts-standing-next-to-each-other-OBfsvFbFn_A',
      license: 'Unsplash License'
    },
    {
      id: 'flagCrowd',
      src: 'https://images.unsplash.com/photo-1783140761120-e868c5f23c03?auto=format&fit=crop&fm=jpg&q=80&w=1600',
      alt: 'Crowd waving Brazilian flags during a public street celebration.',
      caption: 'Public celebration and national symbolism in Brazil',
      credit: 'Lukas Souza / Unsplash',
      source: 'https://unsplash.com/photos/crowd-waving-brazilian-flags-in-a-bustling-city-street-3b3kEEX9BUE',
      license: 'Unsplash License'
    }
  ];

  const lessonVisualMap = {
    history: ['samba', 'music.jpg'],
    identity: ['salvador.jpg', 'flagCrowd'],
    verbal: ['amazon.jpg', 'streetFood'],
    nonverbal: ['capoeira', 'music.jpg'],
    popular: ['saopaulo.jpg', 'soccerFans']
  };

  // 2. STORAGE & PERSISTENCE
  const readStore = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  };

  const writeStore = (key, val) => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
      return true;
    } catch {
      return false;
    }
  };

  let complete = readStore('brazilLessons', []);

  // 3. UTILITY FUNCTIONS
  const escapeHTML = s => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));

  const getPicture = id => {
    const added = addedImages.find(x => x.id === id);
    if (added) return added;
    const p = photos.find(x => x.file === id);
    return p ? {
      src: 'assets/' + p.file,
      alt: p.caption,
      caption: p.caption,
      credit: p.author + ' / Unsplash',
      source: p.url,
      license: 'Unsplash License'
    } : null;
  };

  const pictureCard = id => {
    const x = getPicture(id);
    if (!x) return '';
    return `
      <figure>
        <img src="${x.src}" alt="${escapeHTML(x.alt)}" loading="lazy">
        <figcaption>
          ${escapeHTML(x.caption)}<br>
          <a href="${x.source}" target="_blank" rel="noopener noreferrer">Photo: ${escapeHTML(x.credit)} · ${escapeHTML(x.license)} ↗</a>
        </figcaption>
      </figure>
    `;
  };

  const visualStrip = ids => ids?.length ? `<div class="supporting-visuals">${ids.map(pictureCard).join('')}</div>` : '';

  const sources = ids => {
    if (!ids || !ids.length) return '';
    return `
      <div class="source-links">
        ${ids.map(id => {
          const r = references.find(ref => ref.id === id);
          const label = id === 'textbook' ? 'Martin & Nakayama (2021)'
                      : id === 'unesco' ? 'UNESCO'
                      : id === 'ibge' ? 'IBGE Census Data'
                      : r ? r.citation.split('(')[0].trim().replace(/,\s*&.*$/, ' et al.') : id;
          return `<a class="source-tag" href="#sources/${id}"><span>📚</span> ${escapeHTML(label)} ↗</a>`;
        }).join('')}
      </div>
    `;
  };

  // Update progress indicators across the page
  function updateProgressUI() {
    const count = complete.length;
    const total = 5;
    const pct = Math.round((count / total) * 100);

    // Global Top Bar
    if (globalProgressBar) {
      globalProgressBar.style.width = pct + '%';
      const container = document.getElementById('global-progress');
      if (container) container.setAttribute('aria-valuenow', pct);
    }

    // Header Chip
    if (headerProgressText) {
      headerProgressText.textContent = count === total ? 'All 5 Complete! ✓' : `${count}/${total} Complete`;
    }
    if (headerProgressChip) {
      headerProgressChip.classList.toggle('all-done', count === total);
    }

    // In-page progress copy if present
    document.querySelectorAll('.js-progress-pct').forEach(el => {
      el.style.width = pct + '%';
    });
    document.querySelectorAll('.js-progress-text').forEach(el => {
      el.textContent = count === total
        ? 'All 5 checks completed! Excellent work.'
        : `${count} of ${total} lesson checks completed`;
    });
  }

  // 4. TEMPLATE GENERATORS

  // Render Lesson Cards for the learning path
  const lessonRows = () => chapters.map(c => {
    const isDone = complete.includes(c.id);
    const photo = photos.find(p => p.file === c.image) || {};
    return `
      <a class="lesson-card ${isDone ? 'is-complete' : ''}" href="#${c.id}">
        <div class="lesson-thumb-wrap">
          <img class="lesson-thumb" src="assets/${c.image}" alt="${escapeHTML(photo.caption || c.title)}" loading="lazy">
        </div>
        <div class="lesson-num">${c.n}</div>
        <div class="lesson-details">
          <div class="lesson-title-wrap">
            <h3 class="lesson-title">${escapeHTML(c.title)}</h3>
            ${isDone ? '<span class="lesson-badge-completed">✓ Completed</span>' : ''}
          </div>
          <p class="lesson-excerpt">${escapeHTML(c.short)}</p>
        </div>
        <div class="lesson-meta">
          <span class="lesson-chapter-tag">${escapeHTML(c.chapter)}</span>
          <span class="lesson-time-tag">~4 min read</span>
        </div>
        <div class="lesson-arrow-wrap" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </a>
    `;
  }).join('');

  // HOME PAGE
  function home() {
    const pct = Math.round((complete.length / 5) * 100);
    return `
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-scene">
          <img class="hero-backdrop" src="https://images.unsplash.com/photo-1758480230859-3d71c0078420?auto=format&fit=crop&w=2400&q=90" alt="Christ the Redeemer statue overlooking Rio de Janeiro" fetchpriority="high">
        </div>
        <div class="hero-overlay"></div>
        <div class="hero-atmosphere"></div>
        
        <div class="wrap hero-content">
          <div class="eyebrow-pill">
            <span class="brand-dot" style="margin: 0;"></span>
            COMM 317 · Intercultural Communication
          </div>
          <h1 class="hero-title">Brazil,<br>in <em>conversation.</em></h1>
          <p class="hero-lead">Explore how history, identity, language, and everyday expression shape communication across Brazil. Five research-grounded lessons. Diverse perspectives.</p>
          
          <div class="hero-actions">
            <a class="btn btn-primary" href="#history">
              <span>Explore the Five Lessons</span>
              <span class="icon-arrow">→</span>
            </a>
            <a class="btn btn-outline-light" href="#culture">
              <span>Try Everyday Encounters</span>
              <span class="icon-arrow">↗</span>
            </a>
          </div>

          <div class="hero-meta-strip">
            <div class="meta-item">
              <span class="meta-label">Author</span>
              <span class="meta-value">Snigdh Acharya</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Textbook</span>
              <span class="meta-value">Martin &amp; Nakayama (7th ed., 2021)</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Course</span>
              <span class="meta-value">COMM 317 · Dr. Ping Yang</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Scope</span>
              <span class="meta-value">5 Lessons · 6 Scholarly Studies</span>
            </div>
          </div>
        </div>

        <a class="hero-caption" href="#sources/image-credit">Christ the Redeemer · Photo: Woorld SPR / Unsplash ↗</a>
      </section>

      <!-- Intro Accent Banner -->
      <div class="intro-strip">
        <div class="wrap intro-strip-inner">
          <h2 class="intro-lead-title">Culture is a conversation, not a checklist.</h2>
          <p class="intro-lead-text">Brazil contains over 215 million people, hundreds of Indigenous languages, and vast regional traditions. These five lessons examine concrete examples and research, leaving room for nuanced experiences rather than single national stereotypes.</p>
        </div>
      </div>

      <!-- Section: The Learning Path -->
      <section class="section wrap" id="lessons-overview">
        <div class="section-header">
          <div>
            <div class="eyebrow">The Learning Path</div>
            <h2 class="section-title">Five Ways to Look Closer</h2>
          </div>
          <p class="section-desc">Each lesson connects a textbook chapter to authentic Brazilian examples, living cultural practices, and an interactive knowledge check.</p>
        </div>

        <!-- Progress Card -->
        <div class="progress-card">
          <div class="progress-info">
            <span class="progress-title">Your Course Progress</span>
            <span class="progress-sub js-progress-text">${complete.length} of 5 lesson checks completed</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill js-progress-pct" style="width: ${pct}%"></div>
          </div>
        </div>

        <!-- Lessons Cards List -->
        <div class="lesson-list">
          ${lessonRows()}
        </div>
      </section>

      <!-- Section: Photo Stories Bento -->
      <section class="section section-alt">
        <div class="wrap">
          <div class="section-header">
            <div>
              <div class="eyebrow">A Country of Many Perspectives</div>
              <h2 class="section-title">Look Beyond a Single Story</h2>
            </div>
            <p class="section-desc">Food, language, rhythm, community, and everyday spaces. Begin with curiosity and listen to the people who give these practices meaning.</p>
          </div>

          <div class="photo-bento">
            ${photos.slice(1).map((p, i) => `
              <a class="photo-card" href="#${chapters[i].id}">
                <img src="assets/${p.file}" alt="${escapeHTML(p.caption)}" loading="lazy">
                <div class="photo-card-gradient"></div>
                <div class="photo-card-body">
                  <span class="photo-tag">LESSON 0${i + 1} · ${escapeHTML(chapters[i].chapter)}</span>
                  <h3 class="photo-card-title">${escapeHTML(p.caption)}</h3>
                  <span class="photo-card-credit">Photo: ${escapeHTML(p.author)} ↗</span>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Section: Split Feature Band (Everyday Encounters) -->
      <section class="split-feature-band">
        <div class="wrap split-feature-grid">
          <div class="split-content">
            <div class="eyebrow-pill eyebrow-pill-gold">Interactive Scenarios</div>
            <h2>Small Moments.<br>Better Questions.</h2>
            <p>At a food stall, a market greeting, or a community music roda: practice separating what you observe from what you assume, and discover how respectful communication begins with humility.</p>
            <a class="btn btn-primary" href="#culture">
              <span>Try Everyday Encounters</span>
              <span class="icon-arrow">→</span>
            </a>
          </div>

          <div class="feature-frame">
            <img src="assets/market.jpg" alt="People gathering at a market in Curitiba" loading="lazy">
            <div class="feature-frame-caption">Everyday life and street interactions are part of culture, too.</div>
          </div>
        </div>
      </section>

      <!-- Section: About this Project -->
      <section class="section wrap">
        <div class="about-project-card">
          <div class="eyebrow">Academic Foundation</div>
          <h2>Exploring Brazilian Culture:<br>Communication, Identity, and Everyday Life</h2>
          <p>This COMM 317 project by Snigdh Acharya examines how cultural meaning develops in everyday communication. Following the course framework, the five lessons connect history, identity, verbal communication, nonverbal interaction, and popular culture to Martin and Nakayama’s textbook.</p>
          <p>The central question of this inquiry is: <em>How can we approach unfamiliar cultural practices with curiosity while actively avoiding harmful stereotypes and oversimplifications?</em></p>
          
          <div style="margin-top: 32px; display: flex; gap: 16px; flex-wrap: wrap;">
            <a class="btn btn-dark" href="#reflection">Read My Research &amp; Personal Reflection →</a>
            <a class="btn btn-outline" href="#fieldwork">Review Research Process &amp; Limits ↗</a>
          </div>

          <div class="project-meta-pill">
            <span>🎓 Course: COMM 317</span>
            <span>·</span>
            <span>Professor: Dr. Ping Yang</span>
            <span>·</span>
            <span>Millersville University · Fall 2026</span>
          </div>
        </div>

        <!-- 2 Column Note Cards -->
        <div class="cards-2col">
          <div class="feature-note-card">
            <div>
              <div class="eyebrow">Observation &amp; Self-Awareness</div>
              <h3>Research, Perspective, &amp; My Nepali Background</h3>
              <p>Explore the research-based reflection comparing Brazilian cultural dynamics with my upbringing near Boudhanath in Kathmandu, distinguishing published evidence from firsthand observation.</p>
            </div>
            <a class="btn btn-outline btn-sm" href="#reflection">Read the Reflection →</a>
          </div>

          <div class="feature-note-card">
            <div>
              <div class="eyebrow">Evidence &amp; Rigor</div>
              <h3>Explore. Question. Follow the Evidence.</h3>
              <p>Examine the six peer-reviewed scholarly studies, course textbook chapters, and institutional sources from UNESCO and IPHAN that ground each lesson.</p>
            </div>
            <a class="btn btn-outline btn-sm" href="#sources">Explore Annotated References →</a>
          </div>
        </div>
      </section>
    `;
  }

  // LESSON CHAPTER VIEW
  function chapter(c) {
    const idx = chapters.indexOf(c);
    const photo = photos.find(p => p.file === c.image) || {};
    const prev = idx > 0 ? chapters[idx - 1] : null;
    const next = idx < chapters.length - 1 ? chapters[idx + 1] : null;

    return `
      <!-- Page Header -->
      <section class="page-header">
        <div class="wrap">
          <div class="eyebrow">Lesson ${c.n} of 05 · ${escapeHTML(c.chapter)}</div>
          <h1 class="page-header-title">${escapeHTML(c.title)}</h1>
          <p class="page-header-lead">${escapeHTML(c.intro)}</p>
        </div>
      </section>

      <!-- Reader Two-Column Layout -->
      <div class="wrap reader-layout">
        <!-- Sticky Sidebar Navigation -->
        <aside class="reader-sidebar">
          <div class="sidebar-card">
            <div class="sidebar-title">
              <span>Course Roadmap</span>
              <span class="js-progress-text" style="font-size: 11px; color: var(--color-primary-600);">${complete.length}/5 Done</span>
            </div>
            <div class="sidebar-links">
              ${chapters.map(x => `
                <a class="sidebar-link ${x.id === c.id ? 'active' : ''}" href="#${x.id}">
                  <span>${x.n}. ${escapeHTML(x.title)}</span>
                  ${complete.includes(x.id) ? '<span class="sidebar-link-check">✓</span>' : ''}
                </a>
              `).join('')}
            </div>

            <div class="sidebar-secondary">
              <a href="#culture">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                Everyday Encounters ↗
              </a>
              <a href="#reflection">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                Research Reflection ↗
              </a>
              <button id="download-copy" class="sidebar-link" style="padding-left: 0; color: var(--color-primary-700); font-weight: 700; cursor: pointer; text-align: left;">
                📥 Export Lesson Notes
              </button>
            </div>
          </div>
        </aside>

        <!-- Main Article Content -->
        <article class="reader-article">
          <!-- Hero Photo -->
          <figure class="lesson-hero-photo">
            <img src="assets/${c.image}" alt="${escapeHTML(photo.caption || c.title)}">
            <figcaption>
              <span>${escapeHTML(photo.caption || c.title)}</span>
              <span>Photo: ${escapeHTML(photo.author || 'Unsplash')} ↗</span>
            </figcaption>
          </figure>

          <!-- Supporting Visuals -->
          ${visualStrip(lessonVisualMap[c.id])}

          <!-- Textbook Connection (Concept Spotlight) -->
          <div class="article-block concept-spotlight">
            <div class="eyebrow">The Textbook Connection</div>
            <h2>${escapeHTML(c.concept)}</h2>
            <p>${escapeHTML(c.conceptText)}</p>
            ${sources(['textbook'])}
          </div>

          <!-- Concrete Cultural Example -->
          <div class="article-block">
            <div class="eyebrow">Living Cultural Practice</div>
            <h2>${escapeHTML(c.exampleTitle)}</h2>
            <p>${escapeHTML(c.example)}</p>
          </div>

          <!-- Scholarly Research Perspective -->
          <div class="article-block">
            <div class="eyebrow">Scholarly Evidence</div>
            <h3>A Peer-Reviewed Research Perspective</h3>
            <p>${escapeHTML(c.research)}</p>
            ${sources(c.sources.filter(x => x !== 'textbook'))}
          </div>

          <!-- Culture Note Card -->
          <div class="article-block culture-spotlight">
            <div class="eyebrow">${escapeHTML(c.cultureTitle)}</div>
            <p>${escapeHTML(c.cultureNote)}</p>
            ${visualStrip([c.cultureImage])}
          </div>

          <!-- Popular Culture / Soccer Feature if present -->
          ${c.soccer ? `
            <div class="article-block culture-spotlight">
              <div class="eyebrow">Popular Culture Case: Soccer &amp; Media Representation</div>
              <p>${escapeHTML(c.soccer)}</p>
              ${sources(['helal'])}
            </div>
          ` : ''}

          <!-- Interactive Knowledge Check Quiz -->
          <section class="quiz-card" data-lesson="${c.id}">
            <div class="eyebrow">Check Your Understanding</div>
            <h3>${escapeHTML(c.question)}</h3>
            
            <div class="quiz-options">
              ${c.options.map((opt, j) => `
                <button class="quiz-option-btn" data-answer="${j}">
                  <span class="option-badge">${'ABC'[j]}</span>
                  <span>${escapeHTML(opt)}</span>
                </button>
              `).join('')}
            </div>

            <div class="quiz-feedback" role="status" aria-live="polite"></div>
          </section>

          <!-- Personal Comparison Spotlight -->
          <div class="article-block personal-spotlight">
            <div class="eyebrow">Personal Cultural Comparison · Nepal to Brazil</div>
            <p>${escapeHTML(c.personalComparison)}</p>
          </div>

          <!-- Reflection Prompt Box & Interactive Journal -->
          <div class="reflection-prompt-box">
            <div class="eyebrow" style="color: var(--color-gold-300);">For the Reader</div>
            <blockquote class="reflection-prompt-quote">“${escapeHTML(c.reflect)}”</blockquote>
            
            <div class="reflection-journal">
              <div class="journal-label">
                <span>Personal Reflection Journal</span>
                <span class="journal-status" id="journal-status-${c.id}">Saved to device ✓</span>
              </div>
              <textarea class="journal-textarea" id="journal-input-${c.id}" placeholder="Write your reflection or personal cultural comparison here... (automatically saved on your device)" aria-label="Write your personal cultural reflection for this lesson">${escapeHTML(readStore('brazil_reflection_' + c.id, ''))}</textarea>
              <div class="journal-actions">
                <button class="journal-save-btn" data-save-reflection="${c.id}">
                  <span>Save Reflection</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </button>
                <a class="btn btn-outline-light btn-sm" href="#reflection">Read Snigdh's Reflection →</a>
              </div>
            </div>
          </div>

          <!-- Chapter Navigation Grid -->
          <nav class="chapter-nav-grid" aria-label="Chapter navigation">
            ${prev ? `
              <a class="chapter-nav-card prev" href="#${prev.id}">
                <span class="nav-direction-label">← Previous Lesson</span>
                <span class="nav-target-title">${escapeHTML(prev.title)}</span>
              </a>
            ` : `
              <a class="chapter-nav-card prev" href="#home">
                <span class="nav-direction-label">← Overview</span>
                <span class="nav-target-title">Return to Homepage</span>
              </a>
            `}

            ${next ? `
              <a class="chapter-nav-card next" href="#${next.id}">
                <span class="nav-direction-label">Next Lesson →</span>
                <span class="nav-target-title">${escapeHTML(next.title)}</span>
              </a>
            ` : `
              <a class="chapter-nav-card next" href="#culture">
                <span class="nav-direction-label">Interactive Practice →</span>
                <span class="nav-target-title">Try Everyday Encounters</span>
              </a>
            `}
          </nav>
        </article>
      </div>
    `;
  }

  // EVERYDAY ENCOUNTERS INTERACTIVE SCENARIOS
  const encounters = [
    {
      title: 'At a food stall',
      location: 'Salvador, Bahia',
      image: 'salvador.jpg',
      observation: 'A visitor sees a Baiana selling acarajé in traditional white dress and photographs her stall without greeting or asking.',
      assumption: '“This is simply a tourist performance or costume designed for visitors to photograph.”',
      question: '“May I take a photo? If you have time and feel comfortable sharing, what does this dress and traditional preparation mean to you?”',
      lesson: 'A practice can carry deep sacred connections to Candomblé, work, and community history. Always request permission and listen rather than treating a human being as a decorative display.'
    },
    {
      title: 'A greeting at the market',
      location: 'Curitiba, Paraná',
      image: 'market.jpg',
      observation: 'A visitor hears a familiar Portuguese idiom used casually during a lively negotiation between regular vendors.',
      assumption: '“A standard dictionary or translation app explains everything I need to know about this exchange.”',
      question: '“How would you typically use that expression in this market context compared to a formal setting?”',
      lesson: 'Words possess situated social uses beyond literal definitions. Interpersonal relationships, tone, and community familiarity give language its true communicative weight.'
    },
    {
      title: 'At a music gathering',
      location: 'Caruaru, Pernambuco',
      image: 'music.jpg',
      observation: 'Musicians are playing pífano flutes and percussion while community members gather, dance, and converse around them.',
      assumption: '“Every street gathering follows identical rules of open access, so I can jump in, interrupt, or record freely.”',
      question: '“Is it okay to record or join in? How do community members and newcomers usually participate in this space?”',
      lesson: 'Seek to understand the specific social norms of each gathering. Participation, permission, and cultural hospitality depend heavily on the local context.'
    }
  ];

  function scene(i) {
    const e = encounters[i];
    const photo = photos.find(p => p.file === e.image) || {};
    return `
      <div class="encounter-card">
        <figure class="lesson-hero-photo" style="border-radius: 0; border: none; border-bottom: 1px solid var(--color-border);">
          <img src="assets/${e.image}" alt="${escapeHTML(photo.caption || e.title)}">
          <figcaption>
            <span>${escapeHTML(photo.caption || e.title)} · ${escapeHTML(e.location)}</span>
            <span>Photo: ${escapeHTML(photo.author || 'Unsplash')} / Unsplash</span>
          </figcaption>
        </figure>

        <div class="encounter-steps">
          <div class="encounter-step">
            <div class="step-badge">Step 01 · Concrete Observation</div>
            <p>${escapeHTML(e.observation)}</p>
          </div>

          <div class="encounter-step" style="border-left: 4px solid var(--color-gold-400);">
            <div class="step-badge" style="color: var(--color-gold-600);">Step 02 · Deconstruct the Assumption</div>
            <p>${escapeHTML(e.assumption)}</p>
          </div>

          <details class="encounter-details">
            <summary>
              <span>Step 03 · Reveal a More Respectful Approach</span>
              <span aria-hidden="true">▼</span>
            </summary>
            <div class="encounter-details-content">
              <p class="question-highlight">“${escapeHTML(e.question)}”</p>
              <p><strong>Communication Insight:</strong> ${escapeHTML(e.lesson)}</p>
            </div>
          </details>
        </div>
      </div>
    `;
  }

  function culture() {
    return `
      <section class="page-header">
        <div class="wrap">
          <div class="eyebrow">Practice Curiosity</div>
          <h1 class="page-header-title">Everyday Encounters</h1>
          <p class="page-header-lead">Three illustrative scenarios. Practice separating immediate observation from automatic interpretation, and cultivate questions that build mutual respect.</p>
        </div>
      </section>

      <div class="narrow" style="padding: 60px 0 100px;">
        <div class="scenario-tab-bar" role="group" aria-label="Choose a cultural encounter scenario">
          ${encounters.map((e, i) => `
            <button class="scenario-pill-btn ${i === 0 ? 'active' : ''}" data-scene="${i}" aria-pressed="${i === 0}">
              ${escapeHTML(e.title)}
            </button>
          `).join('')}
        </div>

        <div id="scenario">
          ${scene(0)}
        </div>

        <div class="notice-banner">
          <strong>Pedagogical Context:</strong> These scenarios illustrate Martin &amp; Nakayama’s emphasis on self-reflexivity and mindful observation. Firsthand observations from soccer matches and community conversations are detailed in the research reflection and process sections.
        </div>

        <div style="display: flex; gap: 16px; margin-top: 36px;">
          <a class="btn btn-dark" href="#fieldwork">Explore the Research Process →</a>
          <a class="btn btn-outline" href="#reflection">Read Personal Reflection ↗</a>
        </div>
      </div>
    `;
  }

  // RESEARCH & PERSONAL REFLECTION PAGE
  function reflection() {
    return `
      <section class="page-header">
        <div class="wrap">
          <div class="eyebrow">Snigdh Acharya · Research &amp; Self-Awareness</div>
          <h1 class="page-header-title">Learning Beyond<br>the Familiar Image</h1>
          <p class="page-header-lead">A research-based reflection on Brazilian cultural communication, grounded in Martin &amp; Nakayama (2021) and connected to my upbringing in Nepal.</p>
        </div>
      </section>

      <div class="narrow" style="padding: 60px 0 100px;">
        ${visualStrip(['soccerFans', 'samba'])}

        <div class="notice-banner">
          <strong>Methodological Note:</strong> I combined peer-reviewed scholarship and institutional archives (UNESCO, IPHAN) with media analysis of Brazilian soccer, informal conversations with Brazilian friends, and firsthand match participation with the Palmeiras community and Inter Miami matchday environments. These provide grounded personal perspectives rather than universal generalizations about all Brazilian communities.
        </div>

        <div class="article-block" style="margin-bottom: 32px;">
          <h2>Why I Chose This Culture</h2>
          <p>I chose Brazilian culture because I wanted to understand communication beyond the popularized media tropes of soccer and Carnival. While my lifelong enthusiasm for soccer offered an accessible doorway, I recognized that relying solely on sports could easily flatten a multifaceted nation of over 215 million people. Organizing this project around five core intercultural communication domains—history, identity, language, nonverbal interaction, and popular culture—allowed me to explore how power, memory, and regional variation interact.</p>
        </div>

        <div class="article-block" style="margin-bottom: 32px;">
          <h2>My Starting Perspective: Connecting with Nepal</h2>
          <p>I am from Nepal and study in the United States as an international student. Growing up near Boudhanath in Kathmandu taught me that cultural landmarks are not static monuments for visitors; they are living spaces where people complete morning prayers, run businesses, and share meals. Outsiders frequently visit Boudhanath and see an exotic postcard, yet miss the daily rhythms and sacred significance that local residents experience.</p>
          <p>This background makes me cautious when examining Brazilian traditions. When looking at photos of Salvador’s Pelourinho or samba gatherings in Bahia, I ask: <em>Whose daily reality does this represent, and what layers of community history remain invisible to a casual tourist?</em></p>
        </div>

        <div class="article-block" style="margin-bottom: 32px;">
          <h2>What the Scholarly Research Makes Visible</h2>
          <p>The academic literature demonstrates why surface-level impressions fall short. In Chapter 3, Martin and Nakayama stress that collective memory influences present communication. Pravaz (2008) illustrates this by showing how Afro-Brazilian samba became canonized as a national emblem while the communities who developed it continued facing structural marginalization.</p>
          <p>In Chapter 4, identity negotiation becomes crucial: Rezende (2008) investigates how Brazilian academics negotiated international stereotypes of “warmth” and “emotionality,” demonstrating that national traits are neither innate nor uniform. Similarly, Ferreira et al. (2012) examine <em>jeitinho</em> as a nuanced social practice of creative problem-solving rather than a simple ethical flaw.</p>
          ${sources(['textbook', 'pravaz', 'rezende', 'ferreira'])}
        </div>

        <div class="article-block" style="margin-bottom: 32px;">
          <h2>Comparing Without Assuming Sameness</h2>
          <p>As an intercultural learner, I find useful parallels between Nepali and Brazilian communicative contexts: both cultures value high-context relational trust, hospitality, and communal gatherings. However, drawing parallels must never collapse distinct historical realities. Brazil’s unique linguistic landscape, shaped by Portuguese colonization alongside Indigenous and African linguistic contributions, differs fundamentally from Nepal’s multilingual heritage.</p>
        </div>

        <div class="article-block" style="margin-bottom: 32px;">
          <h2>Firsthand Soccer Experience</h2>
          <p>During this semester, I attended live soccer events, observed the Palmeiras supporter community, and experienced the match atmosphere around Inter Miami. These experiences brought textbook concepts of fan ritual, nonverbal chants, and shared identity to life (Martin &amp; Nakayama, Chapters 4 &amp; 7; Helal &amp; Soares, 2014). Nevertheless, I treat these matchday observations as specific ethnographic moments, not as proof that all Brazilians experience soccer or express patriotism in the same way.</p>
        </div>

        <div class="article-block" style="margin-bottom: 32px;">
          <h2>My Main Takeaway</h2>
          <p>Respectful intercultural communication begins with curiosity, humble listening, and the disciplined willingness to verify one's interpretations. Instead of assuming what “Brazilians are like,” effective communicators ask how a specific individual or community understands their practice. Acknowledging the limits of my own vantage point is essential to genuine cross-cultural learning.</p>
        </div>

        <div style="display: flex; gap: 16px;">
          <a class="btn btn-dark" href="#fieldwork">Review Research Process &amp; Tables →</a>
          <a class="btn btn-outline" href="#sources">View Academic References ↗</a>
        </div>
      </div>
    `;
  }

  // RESEARCH PROCESS & FIELDWORK PAGE
  function fieldwork() {
    return `
      <section class="page-header">
        <div class="wrap">
          <div class="eyebrow">Evidence · Methodology · Analytical Limits</div>
          <h1 class="page-header-title">Research Process</h1>
          <p class="page-header-lead">How this learning platform translates the COMM 317 research proposal into rigorous pedagogical content while distinguishing published findings from personal experience.</p>
        </div>
      </section>

      <div class="narrow" style="padding: 60px 0 100px;">
        ${visualStrip(['soccerFans', 'flagCrowd'])}

        <h2>Research Question</h2>
        <p><em>How do history, identity, verbal communication, nonverbal interaction, and popular culture shape intercultural understanding in specific Brazilian contexts, and how can communicators avoid stereotyping?</em></p>

        <h2>Methodological Architecture</h2>
        <p>The project triangulates three distinct categories of evidence:</p>
        <ol style="margin-bottom: 28px; line-height: 1.8; color: var(--color-text-main);">
          <li><strong>Course Theory:</strong> Martin &amp; Nakayama (2021), <em>Experiencing Intercultural Communication</em> (Chapters 3 through 7).</li>
          <li><strong>Peer-Reviewed Scholarship:</strong> Six empirical studies (Ferreira et al., Pravaz, Rezende, Graham, Helal &amp; Soares, Schröder &amp; Streeck).</li>
          <li><strong>Institutional &amp; Archival Documentation:</strong> Official reports and heritage listings from UNESCO, IPHAN, and the Brazilian Ministry of Culture.</li>
          <li><strong>Personal &amp; Media Observation:</strong> Attendance at soccer matches, observation of Palmeiras supporter gatherings, informal dialogues with Brazilian peers, and analysis of Brazilian sports broadcasts.</li>
        </ol>

        <h2>Evidence Trail Table</h2>
        <div class="evidence-table-container">
          <table class="evidence-table">
            <thead>
              <tr>
                <th>Published Material / Source</th>
                <th>Application in This Project</th>
                <th>Interpretive Limitation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Samba de Roda (UNESCO)</strong></td>
                <td>Examines community roots, Afro-Brazilian musical transmission, and national canonization.</td>
                <td>A regional practice in Bahia does not represent musical traditions across all 26 states.</td>
              </tr>
              <tr>
                <td><strong>Baianas de Acarajé (IPHAN)</strong></td>
                <td>Explores culinary heritage, sacred craft, and labor as carriers of collective memory.</td>
                <td>Institutional heritage records are not substitute for direct interviews with individual vendors.</td>
              </tr>
              <tr>
                <td><strong>Brazilian Linguistic Diversity (IPHAN)</strong></td>
                <td>Documents over 200 Indigenous languages and official recognition of Libras sign language.</td>
                <td>National population figures can obscure regional bilingualism and language revitalization challenges.</td>
              </tr>
              <tr>
                <td><strong>Capoeira (UNESCO Archives)</strong></td>
                <td>Analyzes nonverbal bodily rhetoric, musical call-and-response, and tactical game dynamics.</td>
                <td>Observing or reading about a martial art differs significantly from somatic embodied mastery.</td>
              </tr>
              <tr>
                <td><strong>Six Scholarly Studies</strong></td>
                <td>Provide empirical analysis of social norms, media framing, identity negotiation, and gesture.</td>
                <td>Each study relies on distinct sample sizes and geographic settings (Rio, São Paulo, Brasília).</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Five-Topic Proposal Alignment Map</h2>
        <div class="evidence-table-container">
          <table class="evidence-table">
            <thead>
              <tr>
                <th>Textbook Domain</th>
                <th>Brazilian Cultural Case</th>
                <th>Reader Reflexivity Practice</th>
              </tr>
            </thead>
            <tbody>
              ${chapters.map(c => `
                <tr>
                  <td><a href="#${c.id}">${escapeHTML(c.chapter)}: ${escapeHTML(c.title)}</a></td>
                  <td>${escapeHTML({
                    history: 'Samba de Roda & Baianas de Acarajé heritage',
                    identity: 'Afro-Brazilian, Indigenous, and regional diversity',
                    verbal: 'Portuguese idioms, jeitinho, and linguistic rights',
                    nonverbal: 'Capoeira movement, proxemics, and gesture analysis',
                    popular: 'Soccer media, music, and selective national branding'
                  }[c.id] || c.title)}</td>
                  <td>${escapeHTML({
                    history: 'Contextualize origins and historical power dynamics',
                    identity: 'Ask about personal self-identification',
                    verbal: 'Clarify meaning in situational context',
                    nonverbal: 'Describe visible action before interpreting intent',
                    popular: 'Question who is included in the national image'
                  }[c.id] || 'Engage with critical curiosity')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="margin-top: 36px; display: flex; gap: 16px;">
          <a class="btn btn-dark" href="#reflection">Read My Research Reflection →</a>
          <a class="btn btn-outline" href="#sources">Examine All References ↗</a>
        </div>
      </div>
    `;
  }

  // ANNOTATED SOURCES & IMAGE CREDITS PAGE
  function sourcesPage() {
    return `
      <section class="page-header">
        <div class="wrap">
          <div class="eyebrow">Academic Rigor · Grounded Citations</div>
          <h1 class="page-header-title">Sources &amp; Perspectives</h1>
          <p class="page-header-lead">Complete annotated bibliography of peer-reviewed journal articles, textbook foundations, institutional documents, and media credits supporting this platform.</p>
        </div>
      </section>

      <div class="narrow" style="padding: 60px 0 100px;">
        <div class="notice-banner">
          All references follow APA style with direct links to publisher repositories, open-access full-text archives, and institutional portals.
        </div>

        <!-- Filter & Live Search Bar -->
        <div class="sources-filter-bar">
          <div class="filter-pills" role="tablist" aria-label="Filter references by source category">
            <button class="filter-pill active" data-filter="all">All References (${references.length})</button>
            <button class="filter-pill" data-filter="scholarly">Peer-Reviewed (${references.filter(r => r.type.toLowerCase().includes('journal') || r.type.toLowerCase().includes('scholarly')).length})</button>
            <button class="filter-pill" data-filter="institutional">Institutional (${references.filter(r => r.type.toLowerCase().includes('institutional') || r.type.toLowerCase().includes('official')).length})</button>
            <button class="filter-pill" data-filter="textbook">Textbook</button>
          </div>
          <div class="sources-search-wrap">
            <svg class="search-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="search" class="sources-search-input" id="sources-search" placeholder="Search author, topic..." aria-label="Search references">
          </div>
        </div>

        <h2 style="font-size: 1.85rem; margin: 30px 0 20px;">Peer-Reviewed &amp; Course References</h2>
        <div id="references-container">
          ${references.map(r => `
            <article class="reference-card" id="ref-${r.id}" data-type="${escapeHTML(r.type.toLowerCase())}" data-citation="${escapeHTML(r.citation.toLowerCase())}" data-note="${escapeHTML(r.note.toLowerCase())}">
              <span class="reference-badge">${escapeHTML(r.type)}</span>
              <p class="reference-citation"><strong>${escapeHTML(r.citation)}</strong></p>
              <div class="reference-links">
                <a href="${r.url}" target="_blank" rel="noopener noreferrer">Publisher / Archive Link ↗</a>
                ${r.fullTextUrl ? `<a href="${r.fullTextUrl}" target="_blank" rel="noopener noreferrer">Full-Text Open Copy ↗</a>` : ''}
              </div>
              <p class="reference-annotation">${escapeHTML(r.note)}</p>
            </article>
          `).join('')}
        </div>

        <h2 style="font-size: 1.85rem; margin: 56px 0 20px;" id="ref-image-credit">Core Photography Credits</h2>
        <div class="reference-card">
          <p style="margin-bottom: 20px; font-size: 14px; color: var(--color-text-muted);">
            High-resolution photography licensed under the Unsplash License, documenting authentic cultural locations and gatherings across Brazil.
          </p>
          ${photos.map(p => `
            <div class="photo-credit-row">
              <img class="photo-credit-thumb" src="${p.src || 'assets/' + p.file}" alt="${escapeHTML(p.caption)}" loading="lazy">
              <div class="photo-credit-text">
                <strong>${escapeHTML(p.caption)}</strong><br>
                Photographer: ${escapeHTML(p.author)} / Unsplash<br>
                <a href="${p.url}" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary-700); font-weight: 600;">View Original Image ↗</a>
              </div>
            </div>
          `).join('')}
        </div>

        <h2 style="font-size: 1.85rem; margin: 48px 0 20px;" id="ref-added-image-credits">Curated Supplementary Visuals</h2>
        <div class="reference-card">
          ${addedImages.map(img => `
            <div class="photo-credit-row">
              <img class="photo-credit-thumb" src="${img.src}" alt="${escapeHTML(img.alt)}" loading="lazy">
              <div class="photo-credit-text">
                <strong>${escapeHTML(img.caption)}</strong><br>
                Credit: ${escapeHTML(img.credit)} · License: ${escapeHTML(img.license)}<br>
                <a href="${img.source}" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary-700); font-weight: 600;">View Source File ↗</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 5. TOAST NOTIFICATIONS & EXPORT
  function toast(message) {
    const el = document.getElementById('toast');
    const msgEl = document.getElementById('toast-message');
    if (!el || !msgEl) return;
    msgEl.textContent = message;
    el.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      el.classList.remove('show');
    }, 2800);
  }

  function downloadText(filename, content) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Lesson notes downloaded successfully');
  }

  // 6. ROUTER & EVENT BINDINGS
  function route() {
    const hash = location.hash.slice(1);
    const [routeId = 'home', anchor] = hash.split('/');
    const activeChapter = chapters.find(c => c.id === routeId);

    // Render corresponding view
    if (activeChapter) {
      main.innerHTML = chapter(activeChapter);
    } else if (routeId === 'soccer') {
      main.innerHTML = chapter(chapters[4]); // Redirect to popular culture lesson
    } else if (routeId === 'culture') {
      main.innerHTML = culture();
    } else if (routeId === 'fieldwork') {
      main.innerHTML = fieldwork();
    } else if (routeId === 'reflection') {
      main.innerHTML = reflection();
    } else if (routeId === 'sources') {
      main.innerHTML = sourcesPage();
    } else {
      main.innerHTML = home();
    }

    main.className = 'route-enter';

    // Page title formatting
    const pageTitle = activeChapter
      ? `${activeChapter.title} — Brazil, in Conversation`
      : routeId === 'culture'
      ? 'Everyday Encounters — Brazil, in Conversation'
      : routeId === 'reflection'
      ? 'Research & Reflection — Brazil, in Conversation'
      : routeId === 'fieldwork'
      ? 'Research Process & Fieldwork — Brazil, in Conversation'
      : routeId === 'sources'
      ? 'Sources & Perspectives — Brazil, in Conversation'
      : 'Brazil, in Conversation — Intercultural Communication';

    document.title = pageTitle;

    // Update active nav links
    document.querySelectorAll('.site-nav .nav-link').forEach(link => {
      const target = link.getAttribute('href');
      const isMatch = target === '#' + routeId || (activeChapter && target === '#history');
      if (isMatch) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    // Close mobile menu if open
    if (siteNav) siteNav.classList.remove('open');
    if (navBackdrop) navBackdrop.classList.remove('active');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');

    // Scroll handling
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Update global progress
    updateProgressUI();

    // Re-bind interactive elements
    bindEvents();
    initScrollReveal();

    // Deep anchor linking on sources page
    if (routeId === 'sources' && anchor) {
      requestAnimationFrame(() => {
        const targetEl = document.getElementById('ref-' + anchor);
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  function bindEvents() {
    // 1. Scenario Tab Switching
    document.querySelectorAll('[data-scene]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.scene);
        const container = document.getElementById('scenario');
        if (container) container.innerHTML = scene(idx);

        document.querySelectorAll('[data-scene]').forEach(b => {
          const isActive = b === btn;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-pressed', String(isActive));
        });
      });
    });

    // 2. Interactive Quiz Choice Checking
    document.querySelectorAll('.quiz-option-btn[data-answer]').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.quiz-card');
        if (!card) return;
        const lessonId = card.dataset.lesson;
        const chapterData = chapters.find(c => c.id === lessonId);
        if (!chapterData) return;

        const isCorrect = Number(btn.dataset.answer) === chapterData.correct;

        // Reset state
        card.querySelectorAll('.quiz-option-btn').forEach(b => {
          b.classList.remove('correct', 'incorrect');
        });

        btn.classList.add(isCorrect ? 'correct' : 'incorrect');

        const feedback = card.querySelector('.quiz-feedback');
        if (feedback) {
          feedback.className = 'quiz-feedback show ' + (isCorrect ? 'feedback-success' : 'feedback-error');
          feedback.innerHTML = `<strong>${isCorrect ? '✓ Correct.' : 'Notice:'}</strong> ${escapeHTML(chapterData.feedback)}`;
        }

        if (isCorrect && !complete.includes(chapterData.id)) {
          complete.push(chapterData.id);
          writeStore('brazilLessons', complete);
          updateProgressUI();
          toast(`Lesson check ${chapterData.n} completed!`);
          if (complete.length === 5) {
            launchConfetti();
            setTimeout(() => toast('🎉 Parabéns! You completed all 5 course checks!'), 800);
          }
        }
      });
    });

    // 3. Save Personal Reflection Notes
    document.querySelectorAll('[data-save-reflection]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.saveReflection;
        const textarea = document.getElementById('journal-input-' + id);
        const status = document.getElementById('journal-status-' + id);
        if (textarea) {
          writeStore('brazil_reflection_' + id, textarea.value.trim());
          if (status) {
            status.classList.add('visible');
            setTimeout(() => status.classList.remove('visible'), 2400);
          }
          toast('Personal reflection saved to your device');
        }
      });
    });

    // 4. Sources Page Filtering & Live Search
    const searchInput = document.getElementById('sources-search');
    const filterPills = document.querySelectorAll('.filter-pill[data-filter]');
    const refCards = document.querySelectorAll('.reference-card[data-type]');

    function filterReferences() {
      const activeFilterBtn = document.querySelector('.filter-pill.active');
      const activeFilter = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';
      const query = (searchInput ? searchInput.value.toLowerCase().trim() : '');

      refCards.forEach(card => {
        const cardType = card.dataset.type || '';
        const citation = card.dataset.citation || '';
        const note = card.dataset.note || '';

        let matchesCategory = true;
        if (activeFilter === 'scholarly') {
          matchesCategory = cardType.includes('journal') || cardType.includes('scholarly');
        } else if (activeFilter === 'institutional') {
          matchesCategory = cardType.includes('institutional') || cardType.includes('official') || cardType.includes('primary');
        } else if (activeFilter === 'textbook') {
          matchesCategory = cardType.includes('textbook') || card.id === 'ref-textbook';
        }

        const matchesQuery = !query || citation.includes(query) || note.includes(query);
        card.style.display = (matchesCategory && matchesQuery) ? 'block' : 'none';
      });
    }

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        filterReferences();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', filterReferences);
    }

    // 5. Image Lightbox Click Listeners
    document.querySelectorAll('figure img, .photo-card img, .lesson-hero-photo img, .feature-frame img').forEach(img => {
      img.addEventListener('click', e => {
        e.preventDefault();
        const src = img.getAttribute('src');
        const alt = img.getAttribute('alt') || 'Cultural photograph';
        const figure = img.closest('figure');
        const caption = figure ? (figure.querySelector('figcaption')?.textContent || alt) : alt;
        const link = img.closest('a')?.getAttribute('href') || '#sources';

        openLightbox(src, alt, caption, link);
      });
    });

    // 6. Export Lesson Notes Download
    const downloadBtn = document.getElementById('download-copy');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const textContent = `BRAZIL, IN CONVERSATION
COMM 317 Intercultural Communication Project
Author: Snigdh Acharya | Millersville University | Fall 2026

` + chapters.map(c => {
  const personalNote = readStore('brazil_reflection_' + c.id, '');
  return `
==================================================
${c.n}. ${c.title.toUpperCase()} (${c.chapter})
==================================================
OVERVIEW:
${c.intro}

TEXTBOOK CONCEPT (${c.concept}):
${c.conceptText}

CULTURAL PRACTICE:
${c.exampleTitle}
${c.example}

SCHOLARLY EVIDENCE:
${c.research}

LIVING HERITAGE NOTE (${c.cultureTitle}):
${c.cultureNote}
${c.soccer ? `\nSOCCER & POPULAR CULTURE:\n${c.soccer}` : ''}

MY CULTURAL COMPARISON (NEPAL TO BRAZIL):
${c.personalComparison}

READER REFLECTION PROMPT:
${c.reflect}
${personalNote ? `\nMY PERSONAL JOURNAL ENTRY:\n${personalNote}` : ''}
`;
}).join('\n\n') + `
==================================================
ANNOTATED REFERENCES
==================================================
` + references.map(r => `${r.type.toUpperCase()}:\n${r.citation}\n${r.url}\nAnnotation: ${r.note}\n`).join('\n');

        downloadText('Brazil-Culture-COMM317-Study-Notes.txt', textContent);
      });
    }
  }

  // 7. HEADER & MOTION CONTROLS
  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      if (navBackdrop) navBackdrop.classList.toggle('active', isOpen);
    });
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', () => {
      if (siteNav) siteNav.classList.remove('open');
      navBackdrop.classList.remove('active');
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    });
  }

  // Header scroll blur elevation
  window.addEventListener('scroll', () => {
    if (siteHeader) {
      siteHeader.classList.toggle('scrolled', window.scrollY > 30);
    }
  }, { passive: true });

  // Print button
  const printBtn = document.getElementById('print-page');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  // Motion toggle button
  const motionBtn = document.getElementById('motion-toggle');
  const motionText = document.getElementById('motion-text');
  let motionOff = readStore('brazilMotionOff', false);

  function applyMotionPreference() {
    document.body.classList.toggle('motion-off', motionOff);
    if (motionBtn) motionBtn.setAttribute('aria-pressed', String(motionOff));
    if (motionText) motionText.textContent = motionOff ? 'Motion: off' : 'Motion: on';
  }

  if (motionBtn) {
    motionBtn.addEventListener('click', () => {
      motionOff = !motionOff;
      writeStore('brazilMotionOff', motionOff);
      applyMotionPreference();
      toast(motionOff ? 'Animations disabled' : 'Animations enabled');
    });
  }
  applyMotionPreference();

  // 7b. LIGHTBOX PREVIEW MODAL
  const lightboxModal = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxLink = document.getElementById('lightbox-link');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(src, alt, caption, sourceUrl) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    if (lightboxCaption) lightboxCaption.textContent = caption;
    if (lightboxLink) lightboxLink.href = sourceUrl;
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', e => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });

  // 7c. CELEBRATORY CONFETTI BURST
  function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas || motionOff) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#256b54', '#f59e0b', '#fbbf24', '#d4522f', '#30866b', '#ffffff'];
    const particles = Array.from({ length: 90 }, () => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * 320,
      y: canvas.height * 0.45,
      w: Math.random() * 8 + 6,
      h: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.85) * 16,
      rot: Math.random() * 360,
      vrot: (Math.random() - 0.5) * 12,
      opacity: 1
    }));

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.38; // gravity
        p.rot += p.vrot;
        p.opacity -= 0.008;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rot * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      });

      if (alive) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    render();
  }

  // 8. INTERSECTION OBSERVER SCROLL REVEAL
  let revealObserver;
  function initScrollReveal() {
    if (motionOff || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    if (revealObserver) revealObserver.disconnect();

    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    const targets = document.querySelectorAll(
      '.lesson-card, .photo-card, .feature-note-card, .article-block, .encounter-card, .reference-card, .about-project-card'
    );

    targets.forEach((el, index) => {
      el.classList.add('reveal');
      el.style.setProperty('--delay', `${(index % 3) * 75}ms`);
      revealObserver.observe(el);
    });
  }

  // 9. INITIALIZATION
  window.addEventListener('hashchange', route);
  route();
})();
