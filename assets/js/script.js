gsap.registerPlugin(ScrollTrigger);

// Animación original para "Sección de Catálogo de Productos"
const tl = gsap
  .timeline({
    defaults: {
      duration: 2,
      yoyo: true,
      ease: "power2.inOut",
    },
  })
  .fromTo(
    ".left, .right",
    {
      svgOrigin: "640 500",
      skewY: (i) => [-30, 15][i],
      scaleX: (i) => [0.6, 0.85][i],
      x: 200,
    },
    {
      skewY: (i) => [-15, 30][i],
      scaleX: (i) => [0.85, 0.6][i],
      x: -200,
    },
  )
  .play(0.5);

const tl2 = gsap.timeline();

document.querySelectorAll(".main-animation text").forEach((t, i) => {
  tl2.add(
    gsap.fromTo(
      t,
      {
        xPercent: -100,
        x: 700,
      },
      {
        duration: 1,
        xPercent: 0,
        x: 575,
        ease: "sine.inOut",
      },
    ),
    (i % 3) * 0.2,
  );
});

// Animación para el catálogo
gsap.fromTo(
  ".catalog-container",
  {
    opacity: 0,
    y: 50,
  },
  {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".catalog-container",
      start: "top 80%",
      end: "top 60%",
      scrub: true,
    },
  },
);

// Interactividad con el mouse para el SVG principal
window.onpointermove = (e) => {
  tl.pause();
  tl2.pause();
  gsap.to([tl, tl2], {
    duration: 2,
    ease: "power4",
    progress: e.x / innerWidth,
  });
};

/**
 * Professional Product Catalog with Swiper Integration
 * Advanced e-commerce catalog with filtering, search, cart functionality, and featured slider
 */
class ProductCatalog {
  constructor() {
    this.products = [];
    this.filteredProducts = [];
    this.cart = [];
    this.currentView = "grid";
    this.swiper = null;
    this.filters = {
      search: "",
      category: "",
      priceMin: 0,
      priceMax: 3000,
      sort: "featured",
    };

    this.init();
  }

  /**
   * Initialize the catalog
   */
  init() {
    this.loadProducts();
    this.bindEvents();
    this.loadCartFromStorage();
    this.updateCartUI();
    this.initializeSwiper();
    this.initializePriceRange();
  }

  /**
   * Initialize price range sliders
   */
  initializePriceRange() {
    const priceMinSlider = document.getElementById("price-min");
    const priceMaxSlider = document.getElementById("price-max");
    const priceMinInput = document.getElementById("price-min-input");
    const priceMaxInput = document.getElementById("price-max-input");
    const priceDisplay = document.getElementById("price-display");

    if (priceMinSlider && priceMaxSlider && priceMinInput && priceMaxInput && priceDisplay) {
      // Update sliders from inputs
      priceMinInput.addEventListener("input", () => {
        let value = parseFloat(priceMinInput.value);
        if (isNaN(value) || value < 0) value = 0;
        if (value > parseFloat(priceMaxSlider.value)) value = parseFloat(priceMaxSlider.value);
        priceMinSlider.value = value;
        this.filters.priceMin = value;
        priceDisplay.textContent = `$${value} - $${this.filters.priceMax}`;
        this.applyFilters();
      });

      priceMaxInput.addEventListener("input", () => {
        let value = parseFloat(priceMaxInput.value);
        if (isNaN(value) || value > 3000) value = 3000;
        if (value < parseFloat(priceMinSlider.value)) value = parseFloat(priceMinSlider.value);
        priceMaxSlider.value = value;
        this.filters.priceMax = value;
        priceDisplay.textContent = `$${this.filters.priceMin} - $${value}`;
        this.applyFilters();
      });

      // Update inputs from sliders
      priceMinSlider.addEventListener("input", () => {
        this.filters.priceMin = parseFloat(priceMinSlider.value);
        priceMinInput.value = this.filters.priceMin;
        priceDisplay.textContent = `$${this.filters.priceMin} - $${this.filters.priceMax}`;
        this.applyFilters();
      });

      priceMaxSlider.addEventListener("input", () => {
        this.filters.priceMax = parseFloat(priceMaxSlider.value);
        priceMaxInput.value = this.filters.priceMax;
        priceDisplay.textContent = `$${this.filters.priceMin} - $${this.filters.priceMax}`;
        this.applyFilters();
      });
    }
  }

  /**
   * Load sample products data
   */
  loadProducts() {
    this.products = [
      {
        id: 1,
        name: "MacBook Pro 16-inch",
        description:
          "Powerful laptop with M2 Pro chip, 16GB RAM, and 512GB SSD. Perfect for professionals and creatives.",
        category: "electronics",
        currentPrice: 2499.99,
        originalPrice: 2799.99,
        currency: "USD",
        rating: 4.8,
        reviewCount: 2847,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=60",
        badge: "sale",
        storeUrl: "https://apple.com/macbook-pro",
        storeName: "Apple Store",
        brand: "Apple",
        availability: "InStock",
        featured: true,
        dateAdded: "2024-01-15",
      },
      {
        id: 2,
        name: "Premium Wool Coat",
        description: "Elegant wool coat crafted from sustainable materials. Timeless design meets modern comfort.",
        category: "clothing",
        currentPrice: 299.99,
        originalPrice: null,
        currency: "USD",
        rating: 4.6,
        reviewCount: 1234,
        image: "https://images.unsplash.com/photo-1618354691229-88d47f285158?w=600&auto=format&fit=crop&q=60",
        badge: "new",
        storeUrl: "https://samuelortizospina.me/catalog",
        storeName: "Fashion House",
        brand: "EcoFashion",
        availability: "InStock",
        featured: true,
        dateAdded: "2024-01-20",
      },
      {
        id: 3,
        name: "Smart Home Security System",
        description: "Complete security solution with 4K cameras, smart sensors, and mobile app control.",
        category: "electronics",
        currentPrice: 599.99,
        originalPrice: 799.99,
        currency: "USD",
        rating: 4.7,
        reviewCount: 892,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=60",
        badge: "sale",
        storeUrl: "https://samuelortizospina.me/catalog",
        storeName: "SecureHome",
        brand: "SmartGuard",
        availability: "InStock",
        featured: true,
        dateAdded: "2024-01-10",
      },
      {
        id: 4,
        name: "The Art of Programming",
        description: "Comprehensive guide to modern programming practices. Essential reading for developers.",
        category: "books",
        currentPrice: 49.99,
        originalPrice: null,
        currency: "USD",
        rating: 4.9,
        reviewCount: 3456,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=60",
        badge: null,
        storeUrl: "https://samuelortizospina.me/catalog",
        storeName: "TechBooks",
        brand: "CodePress",
        availability: "InStock",
        featured: false,
        dateAdded: "2024-01-05",
      },
      {
        id: 5,
        name: "Ergonomic Office Chair",
        description: "Premium ergonomic chair with lumbar support and adjustable features for all-day comfort.",
        category: "home",
        currentPrice: 449.99,
        originalPrice: 599.99,
        currency: "USD",
        rating: 4.5,
        reviewCount: 1567,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=60",
        badge: "sale",
        storeUrl: "https://samuelortizospina.me/catalog",
        storeName: "ComfortZone",
        brand: "ErgoMax",
        availability: "InStock",
        featured: false,
        dateAdded: "2024-01-12",
      },
      {
        id: 6,
        name: "Professional Camera Kit",
        description: "Complete photography kit with DSLR camera, lenses, and accessories for professionals.",
        category: "electronics",
        currentPrice: 1299.99,
        originalPrice: null,
        currency: "USD",
        rating: 4.8,
        reviewCount: 987,
        image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=600&auto=format&fit=crop&q=60",
        badge: "new",
        storeUrl: "https://samuelortizospina.me/catalog",
        storeName: "PhotoPro",
        brand: "CanonMax",
        availability: "InStock",
        featured: true,
        dateAdded: "2024-01-18",
      },
      {
        id: 7,
        name: "Wireless Running Headphones",
        description: "Sweat-resistant wireless headphones with 12-hour battery life. Perfect for active lifestyles.",
        category: "sports",
        currentPrice: 129.99,
        originalPrice: 179.99,
        currency: "USD",
        rating: 4.4,
        reviewCount: 2156,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60",
        badge: "sale",
        storeUrl: "https://samuelortizospina.me/catalog",
        storeName: "SportsTech",
        brand: "AudioFit",
        availability: "InStock",
        featured: false,
        dateAdded: "2024-01-08",
      },
      {
        id: 8,
        name: "Smart Garden Kit",
        description: "Automated indoor garden system with LED grow lights and app control. Grow herbs year-round.",
        category: "home",
        currentPrice: 199.99,
        originalPrice: null,
        currency: "USD",
        rating: 4.6,
        reviewCount: 743,
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=60",
        badge: "new",
        storeUrl: "https://samuelortizospina.me/catalog",
        storeName: "GreenTech",
        brand: "SmartGrow",
        availability: "InStock",
        featured: true,
        dateAdded: "2024-01-22",
      },
    ];

    this.filteredProducts = [...this.products];
    this.renderProducts();
    this.updateResultsCount();
  }

  /**
   * Initialize Swiper slider
   */
  initializeSwiper() {
    // Get featured products for slider
    const featuredProducts = this.products.filter((product) => product.featured);

    // Populate swiper slides
    const swiperWrapper = document.querySelector(".featured-swiper .swiper-wrapper");
    if (swiperWrapper) {
      swiperWrapper.innerHTML = featuredProducts.map((product) => this.createSlide(product)).join("");
    }

    // Initialize Swiper
    const Swiper = window.Swiper;
    this.swiper = new Swiper(".featured-swiper", {
      direction: "horizontal",
      loop: true,
      effect: "cube",
      cubeEffect: {
        slideShadows: false,
        shadow: false,
      },
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 1,
          spaceBetween: 30,
        },
      },
    });
  }

  /**
   * Create slider slide HTML
   */
  createSlide(product) {
    const discount = this.calculateDiscount(product.originalPrice, product.currentPrice);

    return `
      <div class="swiper-slide">
        <div class="slide-details">
          <div class="slide-info">
            <h3>${product.name}</h3>
            <div class="slide-price">${this.formatPrice(product.currentPrice)}</div>
          </div>
          <button 
            class="slide-btn"
            onclick="catalog.addToCartFromSlider(${product.id})"
            aria-label="Add ${product.name} to cart"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 5v14M5 12h14"></path>
            </svg>
          </button>
        </div>
        <img 
          src="${product.image}" 
          alt="${product.name}"
          class="slide-image"
          loading="lazy"
        >
      </div>
    `;
  }

  /**
   * Add product to cart from slider
   */
  addToCartFromSlider(productId) {
    this.toggleCartItem(productId);
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Search input
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener(
        "input",
        this.debounce((e) => {
          this.filters.search = e.target.value;
          this.applyFilters();
        }, 300),
      );

      // Show/hide clear button
      searchInput.addEventListener("input", () => {
        const clearBtn = document.getElementById("clear-search-btn");
        if (clearBtn) {
          clearBtn.hidden = !searchInput.value;
        }
      });

      // Clear search
      const clearSearchBtn = document.getElementById("clear-search-btn");
      if (clearSearchBtn) {
        clearSearchBtn.addEventListener("click", () => {
          searchInput.value = "";
          this.filters.search = "";
          clearSearchBtn.hidden = true;
          this.applyFilters();
          searchInput.focus();
        });
      }
    }

    // Filter selects
    const categorySelect = document.getElementById("category-select");
    if (categorySelect) {
      categorySelect.addEventListener("change", (e) => {
        this.filters.category = e.target.value;
        this.applyFilters();
      });
    }

    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.filters.sort = e.target.value;
        this.applyFilters();
      });
    }

    // Reset filters
    const clearFiltersBtn = document.getElementById("clear-filters-btn");
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener("click", () => {
        this.resetFilters();
      });
    }

    const filterResetBtn = document.getElementById("filter-reset-btn");
    if (filterResetBtn) {
      filterResetBtn.addEventListener("click", () => {
        this.resetFilters();
      });
    }

    // View toggle
    const gridViewRadio = document.getElementById("grid-view-radio");
    const listViewRadio = document.getElementById("list-view-radio");
    const productsContainer = document.getElementById("products-container");

    if (gridViewRadio && listViewRadio && productsContainer) {
      gridViewRadio.addEventListener("change", () => {
        this.currentView = "grid";
        productsContainer.classList.remove("list-view");
      });

      listViewRadio.addEventListener("change", () => {
        this.currentView = "list";
        productsContainer.classList.add("list-view");
      });
    }

    // Cart modal
    const cartToggleBtn = document.getElementById("cart-toggle-btn");
    const cartModal = document.getElementById("cart-modal");
    const cartCloseBtn = document.getElementById("cart-close-btn");

    if (cartToggleBtn && cartModal && cartCloseBtn) {
      cartToggleBtn.addEventListener("click", () => {
        cartModal.showModal();
      });

      cartCloseBtn.addEventListener("click", () => {
        cartModal.close();
      });

      // Close modal when clicking outside
      cartModal.addEventListener("click", (e) => {
        if (e.target === cartModal) {
          cartModal.close();
        }
      });
    }

    // Search toggle for mobile
    const searchToggleBtn = document.getElementById("search-toggle-btn");
    const searchContainer = document.querySelector(".search-container");

    if (searchToggleBtn && searchContainer) {
      searchToggleBtn.addEventListener("click", () => {
        searchContainer.classList.toggle("active");
        if (searchContainer.classList.contains("active")) {
          searchInput.focus();
        }
      });
    }
  }

  /**
   * Debounce utility to limit the rate of function execution
   */
  debounce(fn, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  /**
   * Apply filters and update the product list
   */
  applyFilters() {
    this.showLoadingState();

    setTimeout(() => {
      let filtered = [...this.products];

      // Search filter
      if (this.filters.search) {
        const searchTerm = this.filters.search.toLowerCase();
        filtered = filtered.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm),
        );
      }

      // Category filter
      if (this.filters.category) {
        filtered = filtered.filter((product) => product.category === this.filters.category);
      }

      // Price filter
      filtered = filtered.filter(
        (product) =>
          product.currentPrice >= this.filters.priceMin &&
          product.currentPrice <= this.filters.priceMax,
      );

      // Sort
      switch (this.filters.sort) {
        case "price-low":
          filtered.sort((a, b) => a.currentPrice - b.currentPrice);
          break;
        case "price-high":
          filtered.sort((a, b) => b.currentPrice - a.currentPrice);
          break;
        case "rating":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
          filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
          break;
        case "featured":
        default:
          filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
      }

      this.filteredProducts = filtered;
      this.renderProducts();
      this.updateResultsCount();
      this.hideLoadingState();
    }, 500); // Simulate network delay
  }

  /**
   * Reset all filters to default
   */
  resetFilters() {
    this.filters = {
      search: "",
      category: "",
      priceMin: 0,
      priceMax: 3000,
      sort: "featured",
    };

    const searchInput = document.getElementById("search-input");
    const categorySelect = document.getElementById("category-select");
    const sortSelect = document.getElementById("sort-select");
    const priceMinSlider = document.getElementById("price-min");
    const priceMaxSlider = document.getElementById("price-max");
    const priceMinInput = document.getElementById("price-min-input");
    const priceMaxInput = document.getElementById("price-max-input");
    const priceDisplay = document.getElementById("price-display");
    const clearSearchBtn = document.getElementById("clear-search-btn");

    if (searchInput) searchInput.value = "";
    if (categorySelect) categorySelect.value = "";
    if (sortSelect) sortSelect.value = "featured";
    if (priceMinSlider) priceMinSlider.value = 0;
    if (priceMaxSlider) priceMaxSlider.value = 3000;
    if (priceMinInput) priceMinInput.value = 0;
    if (priceMaxInput) priceMaxInput.value = 3000;
    if (priceDisplay) priceDisplay.textContent = "$0 - $3000";
    if (clearSearchBtn) clearSearchBtn.hidden = true;

    this.applyFilters();
  }

  /**
   * Show loading state
   */
  showLoadingState() {
    const loadingState = document.getElementById("loading-state");
    const productsContainer = document.getElementById("products-container");
    const emptyState = document.getElementById("empty-state");

    if (loadingState && productsContainer && emptyState) {
      loadingState.style.display = "block";
      productsContainer.style.display = "none";
      emptyState.style.display = "none";
    }
  }

  /**
   * Hide loading state
   */
  hideLoadingState() {
    const loadingState = document.getElementById("loading-state");
    if (loadingState) {
      loadingState.style.display = "none";
    }
  }

  /**
   * Update the results count
   */
  updateResultsCount() {
    const resultsCount = document.getElementById("results-count");
    if (resultsCount) {
      resultsCount.textContent = `${this.filteredProducts.length} producto${
        this.filteredProducts.length !== 1 ? "s" : ""
      } encontrado${this.filteredProducts.length !== 1 ? "s" : ""}`;
    }
  }

  /**
   * Render filtered products
   */
  renderProducts() {
    const productsContainer = document.getElementById("products-container");
    const emptyState = document.getElementById("empty-state");

    if (productsContainer && emptyState) {
      if (this.filteredProducts.length === 0) {
        productsContainer.style.display = "none";
        emptyState.style.display = "block";
      } else {
        productsContainer.style.display = "grid";
        emptyState.style.display = "none";
        productsContainer.innerHTML = this.filteredProducts.map((product) => this.createProductCard(product)).join("");
      }
    }
  }

  /**
   * Create product card HTML
   */
  createProductCard(product) {
    const discount = this.calculateDiscount(product.originalPrice, product.currentPrice);
    const stars = this.generateStars(product.rating);

    return `
      <article class="product-card">
        <div class="product-image-container">
          <img 
            src="${product.image}" 
            alt="${product.name}"
            class="product-image"
            loading="lazy"
          >
          ${
            product.badge
              ? `<span class="product-badge ${product.badge}">${product.badge.toUpperCase()}</span>`
              : ""
          }
        </div>
        <div class="product-info">
          <div class="product-category">${this.capitalize(product.category)}</div>
          <h2 class="product-name">${product.name}</h2>
          <p class="product-description">${product.description}</p>
          <div class="product-price">
            <span class="current-price">${this.formatPrice(product.currentPrice)}</span>
            ${
              product.originalPrice
                ? `<span class="original-price">${this.formatPrice(product.originalPrice)}</span>`
                : ""
            }
            ${discount ? `<span class="discount">${discount}% OFF</span>` : ""}
          </div>
          <div class="product-rating">
            <div class="stars">${stars}</div>
            <span class="rating-text">(${product.reviewCount} reseñas)</span>
          </div>
          <div class="product-actions">
            <button 
              class="btn btn-primary add-to-cart-btn" 
              onclick="catalog.toggleCartItem(${product.id})"
              aria-label="${
                this.cart.some((item) => item.id === product.id)
                  ? `Remove ${product.name} from cart`
                  : `Add ${product.name} to cart`
              }"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="${
                  this.cart.some((item) => item.id === product.id)
                    ? "M6 18L18 6M6 6l12 12"
                    : "M12 5v14M5 12h14"
                }"></path>
              </svg>
              ${
                this.cart.some((item) => item.id === product.id)
                  ? "Quitar del carrito"
                  : "Agregar al carrito"
              }
            </button>
            <a 
              href="${product.storeUrl}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn btn-secondary"
              aria-label="Buy ${product.name} from ${product.storeName}"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"></path>
                <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 21.5523 19 21C19 21.5523 19.4477 22 20 22Z"></path>
                <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"></path>
              </svg>
              Comprar ahora
            </a>
          </div>
        </div>
      </article>
    `;
  }

  /**
   * Calculate discount percentage
   */
  calculateDiscount(originalPrice, currentPrice) {
    if (!originalPrice || !currentPrice) return null;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  /**
   * Generate star rating HTML
   */
  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - Math.ceil(rating);
    let stars = "";

    for (let i = 0; i < fullStars; i++) {
      stars += `<svg class="star" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
      </svg>`;
    }

    if (hasHalfStar) {
      stars += `<svg class="star" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill-opacity="0.5"></path>
      </svg>`;
    }

    for (let i = 0; i < emptyStars; i++) {
      stars += `<svg class="star empty" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
      </svg>`;
    }

    return stars;
  }

  /**
   * Format price with currency
   */
  formatPrice(price) {
    return `$${price.toFixed(2)}`;
  }

  /**
   * Capitalize string
   */
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Toggle product in cart
   */
  toggleCartItem(productId) {
    const product = this.products.find((p) => p.id === productId);
    if (!product) return;

    const index = this.cart.findIndex((item) => item.id === productId);
    if (index === -1) {
      this.cart.push({ ...product, quantity: 1 });
      this.showNotification(`${product.name} añadido al carrito`);
    } else {
      this.cart.splice(index, 1);
      this.showNotification(`${product.name} eliminado del carrito`);
    }

    this.saveCartToStorage();
    this.updateCartUI();
    this.renderProducts(); // Update button states
  }

  /**
   * Update cart UI
   */
  updateCartUI() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartEmpty = document.querySelector(".cart-empty");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");

    if (cartItemsContainer && cartEmpty && cartTotal && cartCount) {
      // Update cart count
      const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCount.textContent = totalItems;
      cartCount.style.display = totalItems > 0 ? "flex" : "none";

      // Update cart items
      if (this.cart.length === 0) {
        cartItemsContainer.style.display = "none";
        cartEmpty.style.display = "block";
      } else {
        cartItemsContainer.style.display = "flex";
        cartEmpty.style.display = "none";
        cartItemsContainer.innerHTML = this.cart.map((item) => this.createCartItem(item)).join("");
      }

      // Update total
      const total = this.cart.reduce((sum, item) => sum + item.currentPrice * item.quantity, 0);
      cartTotal.textContent = this.formatPrice(total);
    }
  }

  /**
   * Create cart item HTML
   */
  createCartItem(item) {
    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image" loading="lazy">
        <div class="cart-item-info">
          <h3 class="cart-item-name">${item.name}</h3>
          <p class="cart-item-price">${this.formatPrice(item.currentPrice)} x ${item.quantity}</p>
        </div>
        <button 
          class="cart-item-remove" 
          onclick="catalog.toggleCartItem(${item.id})"
          aria-label="Remove ${item.name} from cart"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;
  }

  /**
   * Save cart to localStorage
   */
  saveCartToStorage() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  /**
   * Load cart from localStorage
   */
  loadCartFromStorage() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
  }

  /**
   * Show notification
   */
  showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification notification-success";
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close" aria-label="Close notification">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("fade-out");
      notification.addEventListener("animationend", () => {
        notification.remove();
      });
    }, 3000);

    const closeBtn = notification.querySelector(".notification-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        notification.remove();
      });
    }
  }
}

// Initialize the catalog
const catalog = new ProductCatalog();
window.catalog = catalog; // Expose to global scope for inline event handlers
