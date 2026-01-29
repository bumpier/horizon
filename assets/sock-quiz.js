/* ═══════════════════════════════════════════════════════════════
   SOCK FINDER QUIZ - JavaScript
   Quiz flow, state management, and product matching
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────────
  // STATE MANAGEMENT
  // ─────────────────────────────────────────────────────────────────
  const STATE_KEY = 'sock_quiz_state';

  const defaultState = {
    currentStep: 1,
    answers: {
      gender: null,
      activities: [],
      size: null,
      colors: []
    }
  };

  function getState() {
    try {
      const stored = sessionStorage.getItem(STATE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Migration: convert old 'activity' to 'activities' array
        if (parsed.answers?.activity && !parsed.answers?.activities) {
          parsed.answers.activities = [parsed.answers.activity];
          delete parsed.answers.activity;
        }
        return parsed;
      }
      return { ...defaultState, answers: { ...defaultState.answers } };
    } catch (e) {
      return { ...defaultState, answers: { ...defaultState.answers } };
    }
  }

  function setState(newState) {
    try {
      sessionStorage.setItem(STATE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.warn('Could not save quiz state:', e);
    }
  }

  function clearState() {
    try {
      sessionStorage.removeItem(STATE_KEY);
    } catch (e) {
      console.warn('Could not clear quiz state:', e);
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // QUIZ CLASS
  // ─────────────────────────────────────────────────────────────────
  class SockQuiz {
    constructor(container) {
      this.container = container;
      this.config = window.SOCK_QUIZ_CONFIG || {};
      this.state = getState();
      this.totalSteps = 4;

      this.init();
    }

    init() {
      this.render();
      this.bindEvents();
      this.updateProgress();
    }

    // ───────────────────────────────────────────────────────────────
    // RENDERING
    // ───────────────────────────────────────────────────────────────
    render() {
      this.container.innerHTML = `
        <div class="sock-quiz">
          ${this.renderProgress()}
          <div class="sq-steps">
            ${this.renderStep1()}
            ${this.renderStep2()}
            ${this.renderStep3()}
            ${this.renderStep4()}
          </div>
        </div>
      `;

      this.showStep(this.state.currentStep);
    }

    renderProgress() {
      return `
        <div class="sq-progress">
          <div class="sq-progress__header">
            <div class="sq-progress__steps">
              ${[1, 2, 3, 4].map(i => `
                <div class="sq-progress__dot" data-step="${i}"></div>
              `).join('')}
            </div>
            <span class="sq-progress__text">Step <span class="sq-progress__current">1</span> of ${this.totalSteps}</span>
          </div>
          <div class="sq-progress__bar">
            <div class="sq-progress__fill" style="width: 25%"></div>
          </div>
        </div>
      `;
    }

    renderStep1() {
      const genders = this.config.genders || [
        { id: 'male', label: 'Men', icon: '👨' },
        { id: 'female', label: 'Women', icon: '👩' }
      ];
      const defaults = {
        question: "Let's find your perfect socks",
        microcopy: "Engineered for performance. Built for you."
      };
      const messages = { ...defaults, ...this.config.messages?.step1 };

      return `
        <div class="sq-step" data-step="1">
          <div class="sq-question">
            <h2 class="sq-question__title">${messages.question}</h2>
            <p class="sq-question__microcopy">${messages.microcopy}</p>
          </div>
          <div class="sq-options sq-options--two-col">
            ${genders.map(g => `
              <button class="sq-option" data-type="gender" data-value="${g.id}">
                <span class="sq-option__icon">${g.icon}</span>
                <span class="sq-option__label">${g.label}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }

    renderStep2() {
      const activities = this.config.activities || [
        { id: 'running', label: 'Running', icon: '🏃' },
        { id: 'snowboarding', label: 'Snowboarding', icon: '🏂' },
        { id: 'climbing', label: 'Climbing', icon: '🧗' },
        { id: 'hiking', label: 'Hiking', icon: '🥾' }
      ];
      const allowMultiple = this.config.features?.allowMultipleActivities !== false;
      const defaults = {
        question: "What do you need them for?",
        microcopy: "Select all that apply",
        buttonText: "Continue"
      };
      const messages = { ...defaults, ...this.config.messages?.step2 };

      return `
        <div class="sq-step" data-step="2">
          <div class="sq-question">
            <h2 class="sq-question__title">${messages.question}</h2>
            <p class="sq-question__microcopy">${messages.microcopy}</p>
          </div>
          <div class="sq-options sq-options--two-col">
            ${activities.map(a => `
              <button class="sq-option ${allowMultiple ? 'sq-option--multi' : ''}"
                      data-type="activity"
                      data-value="${a.id}">
                <span class="sq-option__icon">${a.icon}</span>
                <span class="sq-option__label">${a.label}</span>
              </button>
            `).join('')}
          </div>
          <div class="sq-nav">
            <button class="sq-btn sq-btn--ghost" data-action="back">
              ← Back
            </button>
            <button class="sq-btn sq-btn--primary" data-action="next-step2" disabled>
              ${messages.buttonText} →
            </button>
          </div>
        </div>
      `;
    }

    renderStep3() {
      const sizeCategories = this.config.sizeCategories;

      let content = '';

      if (sizeCategories && sizeCategories.length > 0) {
        // Render Category Buttons
        content = `
          <div class="sq-options sq-options--two-col">
            ${sizeCategories.map(cat => `
              <button class="sq-option" data-type="size" data-value="${cat.id}">
                <span class="sq-option__label">${cat.label}</span>
              </button>
            `).join('')}
          </div>
        `;
      } else {
        // Fallback to numerical sizes
        const sizeMin = this.config.sizeMin || 3;
        const sizeMax = this.config.sizeMax || 13;
        const sizes = [];
        for (let i = sizeMin; i <= sizeMax; i++) {
          sizes.push(i);
        }
        content = `
          <div class="sq-sizes">
            ${sizes.map(s => `
              <button class="sq-size" data-type="size" data-value="${s}">${s}</button>
            `).join('')}
          </div>
        `;
      }

      const defaults = {
        question: "What's your size?",
        microcopy: "UK sizing"
      };
      const messages = { ...defaults, ...this.config.messages?.step3 };

      return `
        <div class="sq-step" data-step="3">
          <div class="sq-question">
            <h2 class="sq-question__title">${messages.question}</h2>
            <p class="sq-question__microcopy">${messages.microcopy}</p>
          </div>
          ${content}
          ${this.renderBackButton()}
        </div>
      `;
    }

    renderStep4() {
      const colors = this.config.colors || [
        { id: 'black', label: 'Black', hex: '#1a1a1a' },
        { id: 'white', label: 'White', hex: '#ffffff' },
        { id: 'grey', label: 'Grey', hex: '#6b7280' },
        { id: 'bright', label: 'Bold Colors', hex: 'linear-gradient(135deg, #f97316, #ec4899, #8b5cf6)' }
      ];
      const allowMultiple = this.config.features?.allowMultipleColors !== false;
      const defaults = {
        question: "Last step: Pick your style",
        microcopy: "Select one or more",
        buttonText: "Show My Results"
      };
      const messages = { ...defaults, ...this.config.messages?.step4 };

      return `
        <div class="sq-step" data-step="4">
          <div class="sq-question">
            <h2 class="sq-question__title">${messages.question}</h2>
            <p class="sq-question__microcopy">${messages.microcopy}</p>
          </div>
          <div class="sq-options sq-options--two-col">
            ${colors.map(c => `
              <button class="sq-option sq-option--color ${allowMultiple ? 'sq-option--multi' : ''}"
                      data-type="color"
                      data-value="${c.id}"
                      data-color="${c.id}">
                <span class="sq-option__label">${c.label}</span>
              </button>
            `).join('')}
          </div>
          <div class="sq-nav">
            <button class="sq-btn sq-btn--ghost" data-action="back">
              ← Back
            </button>
            <button class="sq-btn sq-btn--primary" data-action="submit" disabled>
              ${messages.buttonText} →
            </button>
          </div>
        </div>
      `;
    }

    renderBackButton() {
      if (this.config.features?.showBackButton === false) return '';
      return `
        <div class="sq-nav">
          <button class="sq-btn sq-btn--ghost" data-action="back">
            ← Back
          </button>
          <div></div>
        </div>
      `;
    }

    // ───────────────────────────────────────────────────────────────
    // EVENT HANDLING
    // ───────────────────────────────────────────────────────────────
    bindEvents() {
      this.container.addEventListener('click', (e) => {
        const option = e.target.closest('.sq-option, .sq-size');
        const backBtn = e.target.closest('[data-action="back"]');
        const submitBtn = e.target.closest('[data-action="submit"]');
        const nextStep2Btn = e.target.closest('[data-action="next-step2"]');

        if (option) {
          this.handleOptionClick(option);
        } else if (backBtn) {
          this.goBack();
        } else if (submitBtn && !submitBtn.disabled) {
          this.submitQuiz();
        } else if (nextStep2Btn && !nextStep2Btn.disabled) {
          this.goNext();
        }
      });
    }

    handleOptionClick(option) {
      const type = option.dataset.type;
      const value = option.dataset.value;
      const isMulti = option.classList.contains('sq-option--multi');

      if (type === 'activity' && isMulti) {
        // Multi-select for activities
        option.classList.toggle('selected');
        const selectedActivities = Array.from(
          this.container.querySelectorAll('[data-type="activity"].selected')
        ).map(el => el.dataset.value);

        this.state.answers.activities = selectedActivities;
        setState(this.state);

        // Enable/disable continue button
        const nextBtn = this.container.querySelector('[data-action="next-step2"]');
        if (nextBtn) {
          nextBtn.disabled = selectedActivities.length === 0;
        }
      } else if (type === 'color' && isMulti) {
        // Multi-select for colors
        option.classList.toggle('selected');
        const selectedColors = Array.from(
          this.container.querySelectorAll('.sq-option--color.selected')
        ).map(el => el.dataset.value);

        this.state.answers.colors = selectedColors;
        setState(this.state);

        // Enable/disable submit button
        const submitBtn = this.container.querySelector('[data-action="submit"]');
        if (submitBtn) {
          submitBtn.disabled = selectedColors.length === 0;
        }
      } else {
        // Single select
        const siblings = option.parentElement.querySelectorAll('.sq-option, .sq-size');
        siblings.forEach(s => s.classList.remove('selected'));
        option.classList.add('selected');

        // Store answer
        if (type === 'gender') {
          this.state.answers.gender = value;
        } else if (type === 'activity') {
          this.state.answers.activities = [value];
        } else if (type === 'size') {
          // Store as value (string for categories, int for legacy numbers)
          this.state.answers.size = isNaN(value) ? value : parseInt(value, 10);
        } else if (type === 'color') {
          this.state.answers.colors = [value];
        }

        setState(this.state);

        // Auto-advance for single-select options (gender and size)
        if (this.config.features?.autoAdvance !== false && this.state.currentStep < this.totalSteps) {
          if (type === 'gender' || type === 'size') {
            this.goNext();
          }
        }
      }
    }

    // ───────────────────────────────────────────────────────────────
    // NAVIGATION
    // ───────────────────────────────────────────────────────────────
    showStep(stepNum) {
      const steps = this.container.querySelectorAll('.sq-step');
      steps.forEach(step => {
        const num = parseInt(step.dataset.step, 10);
        step.classList.remove('active');
        if (num === stepNum) {
          step.classList.add('active');
        }
      });

      this.updateProgress();
      this.restoreSelections();
    }

    goNext() {
      if (this.state.currentStep < this.totalSteps) {
        this.state.currentStep++;
        setState(this.state);
        this.showStep(this.state.currentStep);
      }
    }

    goBack() {
      if (this.state.currentStep > 1) {
        this.state.currentStep--;
        setState(this.state);
        this.showStep(this.state.currentStep);
      }
    }

    updateProgress() {
      const dots = this.container.querySelectorAll('.sq-progress__dot');
      const fill = this.container.querySelector('.sq-progress__fill');
      const currentText = this.container.querySelector('.sq-progress__current');

      dots.forEach(dot => {
        const step = parseInt(dot.dataset.step, 10);
        dot.classList.remove('active', 'completed');
        if (step === this.state.currentStep) {
          dot.classList.add('active');
        } else if (step < this.state.currentStep) {
          dot.classList.add('completed');
        }
      });

      if (fill) {
        fill.style.width = `${(this.state.currentStep / this.totalSteps) * 100}%`;
      }

      if (currentText) {
        currentText.textContent = this.state.currentStep;
      }
    }

    restoreSelections() {
      const { gender, activities, size, colors } = this.state.answers;

      // Restore gender selection
      if (gender) {
        const genderBtn = this.container.querySelector(`[data-type="gender"][data-value="${gender}"]`);
        if (genderBtn) genderBtn.classList.add('selected');
      }

      // Restore activity selections
      if (activities && activities.length > 0) {
        activities.forEach(activity => {
          const activityBtn = this.container.querySelector(`[data-type="activity"][data-value="${activity}"]`);
          if (activityBtn) activityBtn.classList.add('selected');
        });

        // Enable continue button
        const nextBtn = this.container.querySelector('[data-action="next-step2"]');
        if (nextBtn) nextBtn.disabled = false;
      }

      // Restore size selection
      if (size) {
        const sizeBtn = this.container.querySelector(`[data-type="size"][data-value="${size}"]`);
        if (sizeBtn) sizeBtn.classList.add('selected');
      }

      // Restore color selections
      if (colors && colors.length > 0) {
        colors.forEach(color => {
          const colorBtn = this.container.querySelector(`[data-type="color"][data-value="${color}"]`);
          if (colorBtn) colorBtn.classList.add('selected');
        });

        // Enable submit button
        const submitBtn = this.container.querySelector('[data-action="submit"]');
        if (submitBtn) submitBtn.disabled = false;
      }
    }

    // ───────────────────────────────────────────────────────────────
    // SUBMIT
    // ───────────────────────────────────────────────────────────────
    submitQuiz() {
      const { gender, activities, size, colors } = this.state.answers;

      // Build URL params
      const params = new URLSearchParams({
        gender: gender || '',
        activities: activities.join(','),
        size: size || '',
        colors: colors.join(',')
      });

      // Navigate to results page
      const resultsUrl = this.config.urls?.resultsPage || '/pages/sock-results';
      window.location.href = `${resultsUrl}?${params.toString()}`;
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // RESULTS PAGE CLASS
  // ─────────────────────────────────────────────────────────────────
  class SockQuizResults {
    constructor(container) {
      this.container = container;
      this.config = window.SOCK_QUIZ_CONFIG || {};
      this.params = this.parseUrlParams();
      this.products = [];
      this.isExactMatch = true;

      this.init();
    }

    parseUrlParams() {
      const params = new URLSearchParams(window.location.search);
      return {
        gender: params.get('gender') || null,
        activities: params.get('activities') ? params.get('activities').split(',').filter(Boolean) : [],
        size: params.get('size') || null,
        colors: params.get('colors') ? params.get('colors').split(',').filter(Boolean) : []
      };
    }

    async init() {
      this.renderLoading();

      try {
        await this.fetchProducts();
        this.matchProducts();
        this.render();
        this.bindEvents();
      } catch (error) {
        console.error('Error loading quiz results:', error);
        this.renderError();
      }
    }

    // ───────────────────────────────────────────────────────────────
    // PRODUCT FETCHING
    // ───────────────────────────────────────────────────────────────
    async fetchProducts() {
      const response = await fetch('/products.json?limit=250');

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      this.allProducts = data.products || [];
    }

    // ───────────────────────────────────────────────────────────────
    // PRODUCT MATCHING - Supports multiple activities
    // ───────────────────────────────────────────────────────────────
    matchProducts() {
      const scoring = this.config.scoring || {
        activityMatch: 100,
        multiActivityBonus: 50,
        genderExactMatch: 50,
        genderUnisexMatch: 25,
        sizeMatch: 30,
        colorMatch: 20,
        bestsellerBonus: 10,
        minimumScore: 150
      };

      const sizeRanges = this.config.sizeRanges || [
        { tag: 'size:3-6', min: 3, max: 6 },
        { tag: 'size:7-9', min: 7, max: 9 },
        { tag: 'size:10-13', min: 10, max: 13 }
      ];

      // Score each product
      const scoredProducts = this.allProducts.map(product => {
        let score = 0;
        let activityMatchCount = 0;
        const tags = product.tags ? product.tags.map(t => t.toLowerCase()) : [];

        // Activity matching - score for each matching activity
        if (this.params.activities.length > 0) {
          for (const activity of this.params.activities) {
            const activityTag = `activity:${activity}`;
            if (tags.includes(activityTag)) {
              score += scoring.activityMatch;
              activityMatchCount++;
            }
          }

          // Bonus for products matching multiple selected activities (hybrid socks)
          if (activityMatchCount > 1) {
            score += scoring.multiActivityBonus * (activityMatchCount - 1);
          }
        }

        // Gender match
        if (this.params.gender) {
          const genderTag = `gender:${this.params.gender}`;
          const unisexTag = 'gender:unisex';

          if (tags.includes(genderTag)) {
            score += scoring.genderExactMatch;
          } else if (tags.includes(unisexTag)) {
            score += scoring.genderUnisexMatch;
          }
        }

        // Size match
        if (this.params.size) {
          if (this.config.sizeCategories) {
            // New Category Logic
            const category = this.config.sizeCategories.find(c => c.id === this.params.size);
            if (category && category.matchTags) {
              for (const tag of category.matchTags) {
                if (tags.includes(tag)) {
                  score += scoring.sizeMatch;
                  break;
                }
              }
            }
          } else {
            // Legacy Range Logic
            for (const range of sizeRanges) {
              if (tags.includes(range.tag) &&
                this.params.size >= range.min &&
                this.params.size <= range.max) {
                score += scoring.sizeMatch;
                break;
              }
            }
          }
        }

        // Color match
        if (this.params.colors.length > 0) {
          for (const color of this.params.colors) {
            const colorTag = `color:${color}`;
            if (tags.includes(colorTag)) {
              score += scoring.colorMatch;
              break;
            }
          }
        }

        // Bestseller bonus
        if (tags.includes('bestseller')) {
          score += scoring.bestsellerBonus;
        }

        return { product, score, activityMatchCount, tags };
      });

      // Filter by minimum score
      let matched = scoredProducts.filter(p => p.score >= scoring.minimumScore);

      // Fallback: relax requirements if no matches
      if (matched.length === 0) {
        this.isExactMatch = false;
        // Try products with at least one activity match
        matched = scoredProducts.filter(p => p.activityMatchCount > 0);
      }

      // Still no matches? Show bestsellers or any products
      if (matched.length === 0) {
        matched = scoredProducts.filter(p => p.tags.includes('bestseller'));
      }

      if (matched.length === 0) {
        matched = scoredProducts.slice(0, 3);
      }

      // Sort by score descending, then by activity match count
      matched.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.activityMatchCount - a.activityMatchCount;
      });

      // Take top 3
      this.products = matched.slice(0, 3).map(m => m.product);
    }

    // ───────────────────────────────────────────────────────────────
    // RENDERING
    // ───────────────────────────────────────────────────────────────
    renderLoading() {
      this.container.innerHTML = `
        <div class="sq-results">
          <div class="sq-loading">
            <div class="sq-loading__spinner"></div>
            <p class="sq-loading__text">Finding your perfect match...</p>
          </div>
        </div>
      `;
    }

    renderError() {
      const messages = {
        retakeQuiz: 'Start Over',
        ...this.config.messages?.results
      };
      this.container.innerHTML = `
        <div class="sq-results">
          <div class="sq-no-results">
            <div class="sq-no-results__icon">😕</div>
            <h2 class="sq-no-results__title">Something went wrong</h2>
            <p class="sq-no-results__text">We couldn't load the products. Please try again.</p>
            <a href="${this.config.urls?.quizPage || '/pages/sock-quiz'}" class="sq-btn sq-btn--primary">
              ${messages.retakeQuiz || 'Start Over'}
            </a>
          </div>
        </div>
      `;
    }

    render() {
      const defaults = {
        headline: "Your Performance Socks",
        subheadline: "Hand-picked based on your needs",
        noExactMatch: "These are our closest matches for your criteria.",
        alsoGreat: "You Might Also Like",
        retakeQuiz: "Start Over",
        browseAll: "See All Socks",
        emailHeadline: "Get 10% Off Your First Order",
        emailMicrocopy: "Plus early access to new releases",
        emailPlaceholder: "Your email",
        emailButton: "Get My Discount"
      };
      const messages = { ...defaults, ...this.config.messages?.results };

      if (this.products.length === 0) {
        this.renderNoResults();
        return;
      }

      const heroProduct = this.products[0];
      const secondaryProducts = this.products.slice(1);
      const showEmailCapture = this.config.features?.showEmailCapture === true;

      this.container.innerHTML = `
        <div class="sq-results">
          ${this.renderHeader(messages)}

          ${!this.isExactMatch ? `
            <div class="sq-results__message">
              ${messages.noExactMatch}
            </div>
          ` : ''}

          ${this.renderHeroProduct(heroProduct, messages)}

          ${secondaryProducts.length > 0 ? `
            <div class="sq-products-secondary">
              <h3 class="sq-products-secondary__title">${messages.alsoGreat}</h3>
              <div class="sq-products-grid">
                ${secondaryProducts.map(p => this.renderProductCard(p)).join('')}
              </div>
            </div>
          ` : ''}

          <div class="sq-actions">
            <a href="${this.config.urls?.quizPage || '/pages/sock-quiz'}" class="sq-btn sq-btn--secondary" onclick="window.clearQuizState && window.clearQuizState()">
              ${messages.retakeQuiz}
            </a>
            <a href="${this.config.urls?.allProductsCollection || '/collections/all'}" class="sq-btn sq-btn--secondary">
              ${messages.browseAll}
            </a>
          </div>

          ${showEmailCapture ? this.renderEmailCapture(messages) : ''}
        </div>
      `;
    }

    renderHeader(messages) {
      // Build activity labels
      const activityLabels = this.params.activities
        .map(id => this.config.activities?.find(a => a.id === id)?.label || id)
        .filter(Boolean);

      const genderLabel = this.config.genders?.find(g => g.id === this.params.gender)?.label || this.params.gender;

      return `
        <div class="sq-results__header">
          <div class="sq-results__badge">
            <span>✓</span> Perfect Match Found
          </div>
          <h1 class="sq-results__title">${messages.headline}</h1>
          ${messages.subheadline ? `<p class="sq-results__subheadline">${messages.subheadline}</p>` : ''}
          <div class="sq-results__summary">
            ${activityLabels.map(label => `<span class="sq-results__tag">${label}</span>`).join('')}
            ${genderLabel ? `<span class="sq-results__tag">${genderLabel}</span>` : ''}
            ${this.renderSizeLabel()}
          </div>
        </div>
      `;
    }

    renderSizeLabel() {
      if (!this.params.size) return '';
      if (this.config.sizeCategories) {
        const cat = this.config.sizeCategories.find(c => c.id === this.params.size);
        if (cat) return `<span class="sq-results__tag">${cat.label}</span>`;
      }
      return `<span class="sq-results__tag">UK ${this.params.size}</span>`;
    }

    renderHeroProduct(product, messages) {
      const image = product.images?.[0]?.src || '';
      const price = this.formatPrice(product.variants?.[0]?.price);
      const comparePrice = product.variants?.[0]?.compare_at_price
        ? this.formatPrice(product.variants[0].compare_at_price)
        : null;
      const selectedVariant = this.findBestVariant(product);
      const variantId = selectedVariant ? selectedVariant.id : product.variants?.[0]?.id;
      const benefits = this.config.messages?.benefits || {};

      return `
        <div class="sq-product-hero">
          <div class="sq-product-hero__image">
            <img src="${image}" alt="${product.title}" loading="lazy">
          </div>
          <div class="sq-product-hero__content">
            <span class="sq-product-hero__label">Top Pick For You</span>
            <h2 class="sq-product-hero__title">${product.title}</h2>
            <p class="sq-product-hero__description">${(product.body_html)}</p>
            <div class="sq-product-hero__price">
              ${price}
              ${comparePrice ? `<span class="compare-at">${comparePrice}</span>` : ''}
            </div>
            <button class="sq-add-to-cart" data-variant-id="${variantId}" data-product-url="${product.handle}">
              Add to Cart
            </button>
            ${Object.keys(benefits).length > 0 ? `
              <div class="sq-product-hero__benefits">
                ${benefits.shipping ? `<span>✓ ${benefits.shipping}</span>` : ''}
                ${benefits.returns ? `<span>✓ ${benefits.returns}</span>` : ''}
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }

    findBestVariant(product) {
      if (!product.variants || product.variants.length === 0) return null;

      // If no size selected, return first variant
      if (!this.params.size) return product.variants[0];

      // Try to find variant matching the size category
      let bestVariant = null;
      const sizeId = this.params.size; // e.g., 'medium', 'large'

      // Get config for this size
      const sizeConfig = this.config.sizeCategories?.find(c => c.id === sizeId);

      if (sizeConfig) {
        const matchTerms = [
          sizeConfig.id, // 'medium'
          sizeConfig.label, // 'Medium (UK 5-7)'
          ...(sizeConfig.matchTags || []), // ['size:medium', 'size:5-7', 'medium']
          `${sizeConfig.min}-${sizeConfig.max}` // '5-7'
        ].filter(Boolean).map(t => t.toLowerCase().replace('size:', '').split(' (')[0]);

        bestVariant = product.variants.find(v => {
          const title = v.title.toLowerCase();
          // Check if variant title contains any match term
          return matchTerms.some(term => title.includes(term));
        });
      }

      // Fallback: If no direct match handling, return first available
      return bestVariant || product.variants[0];
    }

    renderProductCard(product) {
      const image = product.images?.[0]?.src || '';
      const price = this.formatPrice(product.variants?.[0]?.price);
      const selectedVariant = this.findBestVariant(product);
      const variantId = selectedVariant ? selectedVariant.id : product.variants?.[0]?.id;

      return `
        <div class="sq-product-card">
          <a href="/products/${product.handle}" class="sq-product-card__image">
            <img src="${image}" alt="${product.title}" loading="lazy">
          </a>
          <div class="sq-product-card__content">
            <h4 class="sq-product-card__title">${product.title}</h4>
            <div class="sq-product-card__price">${price}</div>
            <button class="sq-add-to-cart" data-variant-id="${variantId}" data-product-url="${product.handle}">
              Add to Cart
            </button>
          </div>
        </div>
      `;
    }

    renderEmailCapture(messages) {
      return `
        <div class="sq-email-capture">
          <h3 class="sq-email-capture__title">${messages.emailHeadline}</h3>
          ${messages.emailMicrocopy ? `<p class="sq-email-capture__microcopy">${messages.emailMicrocopy}</p>` : ''}
          <form class="sq-email-capture__form" data-email-form>
            <input type="email"
                   class="sq-email-capture__input"
                   placeholder="${messages.emailPlaceholder}"
                   required>
            <button type="submit" class="sq-btn sq-btn--primary">
              ${messages.emailButton}
            </button>
          </form>
        </div>
      `;
    }

    renderNoResults() {
      const messages = this.config.messages?.results || {};
      this.container.innerHTML = `
        <div class="sq-results">
          <div class="sq-no-results">
            <div class="sq-no-results__icon">🧦</div>
            <h2 class="sq-no-results__title">No exact matches found</h2>
            <p class="sq-no-results__text">We couldn't find socks matching all your criteria. Try adjusting your preferences.</p>
            <div class="sq-actions" style="justify-content: center; margin-top: 1.5rem;">
              <a href="${this.config.urls?.quizPage || '/pages/sock-quiz'}" class="sq-btn sq-btn--primary" onclick="window.clearQuizState && window.clearQuizState()">
                ${messages.retakeQuiz || 'Start Over'}
              </a>
              <a href="${this.config.urls?.allProductsCollection || '/collections/all'}" class="sq-btn sq-btn--secondary">
                ${messages.browseAll || 'See All Socks'}
              </a>
            </div>
          </div>
        </div>
      `;
    }

    // ───────────────────────────────────────────────────────────────
    // EVENT HANDLING
    // ───────────────────────────────────────────────────────────────
    bindEvents() {
      this.container.addEventListener('click', async (e) => {
        const addToCartBtn = e.target.closest('.sq-add-to-cart');
        if (addToCartBtn) {
          e.preventDefault();
          await this.handleAddToCart(addToCartBtn);
        }
      });

      const emailForm = this.container.querySelector('[data-email-form]');
      if (emailForm) {
        emailForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleEmailSubmit(emailForm);
        });
      }
    }

    async handleAddToCart(button) {
      const variantId = button.dataset.variantId;
      const messages = this.config.messages?.results || {};
      if (!variantId) return;

      button.classList.add('loading');
      button.disabled = true;

      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: [{
              id: parseInt(variantId, 10),
              quantity: 1
            }]
          })
        });

        if (!response.ok) {
          throw new Error('Failed to add to cart');
        }

        button.classList.remove('loading');
        button.classList.add('success');
        button.textContent = messages.addedToCart || '✓ Added!';

        setTimeout(() => {
          button.classList.remove('success');
          button.textContent = 'Add to Cart';
          button.disabled = false;
        }, 2000);

        document.dispatchEvent(new CustomEvent('cart:updated'));

      } catch (error) {
        console.error('Add to cart error:', error);
        button.classList.remove('loading');
        button.textContent = 'Error - Try Again';
        button.disabled = false;
      }
    }

    handleEmailSubmit(form) {
      const email = form.querySelector('input[type="email"]').value;
      console.log('Email submitted:', email);
      form.innerHTML = '<p style="color: var(--sq-success); font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em;">Thanks! Check your inbox.</p>';
    }

    // ───────────────────────────────────────────────────────────────
    // UTILITIES
    // ───────────────────────────────────────────────────────────────
    formatPrice(priceInCents) {
      if (!priceInCents) return '';
      const price = typeof priceInCents === 'string' ? parseFloat(priceInCents) : priceInCents / 100;
      return `£${price.toFixed(2)}`;
    }

    truncateText(html, maxLength) {
      if (!html) return '';
      const text = html.replace(/<[^>]*>/g, '');
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength).trim() + '...';
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // INITIALIZATION
  // ─────────────────────────────────────────────────────────────────
  function initQuiz() {
    const quizContainer = document.getElementById('sock-quiz');
    if (quizContainer) {
      new SockQuiz(quizContainer);
    }
  }

  function initResults() {
    const resultsContainer = document.getElementById('sock-quiz-results');
    if (resultsContainer) {
      new SockQuizResults(resultsContainer);
    }
  }

  function clearQuizState() {
    clearState();
  }

  // Expose to global scope
  window.SockQuiz = SockQuiz;
  window.SockQuizResults = SockQuizResults;
  window.clearQuizState = clearQuizState;

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initQuiz();
      initResults();
    });
  } else {
    initQuiz();
    initResults();
  }

})();
