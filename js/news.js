// Agriculture News Module
(function() {
  // Curated Indian Agriculture News Database
  const NEWS_DB = [
    {
      id: "news-1",
      title: "PM-KISAN 17th Installment Transferred Directly to 92 Million Farmers",
      category: "schemes",
      summary: "Prime Minister Narendra Modi released the 17th installment of PM-KISAN, transferring over ₹20,000 Crore directly into farmer bank accounts. The scheme provides ₹6,000 annually in three equal installments to small and marginal landholder families.",
      source: "Ministry of Agriculture",
      date: "June 18, 2026",
      imageIcon: "fa-money-bill-transfer"
    },
    {
      id: "news-2",
      title: "Government Extends 50% Subsidy for Agricultural Drones under Sub-Mission on Agri Mechanization",
      category: "tech",
      summary: "To promote smart farming, the Central Government has extended the financial assistance program for purchasing drones. Farmer cooperatives, Krishi Vigyan Kendras, and Custom Hiring Centres can avail up to 50% to 100% subsidy for drone demonstrations in paddy and cotton fields.",
      source: "AgriTech India",
      date: "June 20, 2026",
      imageIcon: "fa-circle-nodes"
    },
    {
      id: "news-3",
      title: "IMD Predicts Normal Monsoon; Recommends Sowing Kharif Crops with Second Monsoon Wave",
      category: "weather",
      summary: "The India Meteorological Department (IMD) has forecast a normal Southwest monsoon for 2026. However, meteorologists advise farmers in Central and Western regions to delay seed transplantation until regular monsoon rain sets in to prevent seed drying.",
      source: "IMD Weather Portal",
      date: "June 21, 2026",
      imageIcon: "fa-cloud-rain"
    },
    {
      id: "news-4",
      title: "Maharashtra Organic Farmer Achieves 30% Cost Cut and High Yield using Natural Jeevamrita Concoction",
      category: "organic",
      summary: "Shri Ramesh Patil, an onion and cotton grower from Yavatmal, shared his success of shifting entirely from chemical inputs to Natural Farming (ZBNF). Using home-prepared Jeevamrita and Neem Astra, he reduced fertilizer expenses and improved soil carbon structure.",
      source: "Krishi Jagran",
      date: "June 15, 2026",
      imageIcon: "fa-leaf"
    },
    {
      id: "news-5",
      title: "New Climate-Resilient, High-Yield Wheat Varieties (HD-3385) Approved for Rabi Sowing",
      category: "tech",
      summary: "ICAR announced the registration of HD-3385, a wheat variety capable of resisting early terminal heat stress. Sown in late October, this variety yields 10% more compared to older varieties and requires 20% less irrigation during dry winter spells.",
      source: "ICAR Bulletin",
      date: "June 12, 2026",
      imageIcon: "fa-seedling"
    },
    {
      id: "news-6",
      title: "Digital Crop Survey Launched Across 12 Indian States for Swift MSP Procurement",
      category: "schemes",
      summary: "The Ministry of Agriculture has initiated a GPS-based mobile digital crop survey. The technology records crop sowing data in real-time, helping streamline government procurement pipelines under MSP and expediting crop insurance claim clearances.",
      source: "AgriNews Bureau",
      date: "June 10, 2026",
      imageIcon: "fa-mobile-screen"
    }
  ];

  // Load bookmarks from local storage
  function getBookmarkedIds() {
    const list = localStorage.getItem('cropcare_bookmarked_news');
    return list ? JSON.parse(list) : [];
  }

  function toggleBookmark(newsId) {
    let list = getBookmarkedIds();
    const index = list.indexOf(newsId);
    
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(newsId);
    }
    
    localStorage.setItem('cropcare_bookmarked_news', JSON.stringify(list));
    renderNews();
  }

  // Bind toggle globally to window
  window.toggleNewsBookmark = function(newsId) {
    toggleBookmark(newsId);
  };

  // Initialize News Module
  function initNews() {
    const searchInput = document.getElementById('news-search');
    if (searchInput) {
      searchInput.addEventListener('input', renderNews);
    }

    // Category Tabs click binding
    document.querySelectorAll('.news-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.news-tab-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        renderNews();
      });
    });

    // Default Render
    renderNews();
  }

  // Render news based on search value and category selection
  function renderNews() {
    const searchVal = document.getElementById('news-search')?.value.toLowerCase() || '';
    const activeTab = document.querySelector('.news-tab-btn.active')?.dataset.category || 'all';
    const grid = document.getElementById('news-grid-container');
    
    if (!grid) return;

    const bookmarkedIds = getBookmarkedIds();

    const filteredNews = NEWS_DB.filter(item => {
      const matchSearch = item.title.toLowerCase().includes(searchVal) || 
                          item.summary.toLowerCase().includes(searchVal);
      
      let matchCategory = false;
      if (activeTab === 'all') {
        matchCategory = true;
      } else if (activeTab === 'bookmarks') {
        matchCategory = bookmarkedIds.includes(item.id);
      } else {
        matchCategory = item.category === activeTab;
      }

      return matchSearch && matchCategory;
    });

    if (filteredNews.length === 0) {
      grid.innerHTML = `
        <div class="card" style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 40px;">
          <i class="fas fa-newspaper" style="font-size: 2.5rem; margin-bottom: 12px; color: var(--text-muted);"></i>
          <h3>No Agri-News Found</h3>
          <p style="margin-top: 8px;">Try clearing your search query or selecting a different category tab.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filteredNews.map(item => {
      const isBookmarked = bookmarkedIds.includes(item.id);
      const bookmarkClass = isBookmarked ? 'active' : '';
      const bookmarkIcon = isBookmarked ? 'fas fa-bookmark' : 'far fa-bookmark';

      return `
        <div class="card news-card">
          <div class="news-image">
            <i class="fas ${item.imageIcon}"></i>
          </div>
          <div class="news-meta-row">
            <span class="news-category">${item.category}</span>
            <span>${item.date}</span>
          </div>
          <h3>${item.title}</h3>
          <p>${item.summary}</p>
          <div class="news-footer-row">
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500;">Source: ${item.source}</span>
            <button class="bookmark-btn ${bookmarkClass}" onclick="window.toggleNewsBookmark('${item.id}')">
              <i class="${bookmarkIcon}"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Register in global callbacks
  window.CropCare.onInit(initNews);

})();
