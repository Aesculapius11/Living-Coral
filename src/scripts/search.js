// 搜索功能实现
class BlogSearch {
  constructor() {
    this.searchIndex = window.searchIndex || [];
    this.searchInput = document.getElementById('searchInput');
    this.searchResults = document.getElementById('searchResults');
    this.noResults = document.getElementById('noResults');
    this.searchTips = document.getElementById('searchTips');
    
    this.init();
  }

  init() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
      this.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.performSearch();
        }
      });
    }
  }

  // 防抖函数
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // 处理搜索输入
  handleSearch() {
    const query = this.searchInput.value.trim();
    if (query.length === 0) {
      this.showSearchTips();
      return;
    }
    
    if (query.length < 2) {
      return;
    }
    
    this.performSearch();
  }

  // 执行搜索
  performSearch() {
    const query = this.searchInput.value.trim().toLowerCase();
    if (query.length < 2) return;

    const results = this.search(query);
    this.displayResults(results);
  }

  // 搜索逻辑
  search(query) {
    const results = [];
    const queryWords = query.split(/\s+/).filter(word => word.length > 0);

    this.searchIndex.forEach((item, index) => {
      let score = 0;
      let matchedContent = '';

      // 标题匹配（权重最高）
      if (item.title) {
        const titleLower = item.title.toLowerCase();
        queryWords.forEach(word => {
          if (titleLower.includes(word)) {
            score += 10;
            matchedContent += `标题匹配: "${item.title}" `;
          }
        });
      }

      // 标签匹配（权重高）
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach(tag => {
          const tagLower = tag.toLowerCase();
          queryWords.forEach(word => {
            if (tagLower.includes(word)) {
              score += 8;
              matchedContent += `标签匹配: "${tag}" `;
            }
          });
        });
      }

      // 分类匹配（权重中）
      if (item.category) {
        const categoryLower = item.category.toLowerCase();
        queryWords.forEach(word => {
          if (categoryLower.includes(word)) {
            score += 6;
            matchedContent += `分类匹配: "${item.category}" `;
          }
        });
      }

      // 描述匹配（权重中）
      if (item.description) {
        const descLower = item.description.toLowerCase();
        queryWords.forEach(word => {
          if (descLower.includes(word)) {
            score += 4;
            matchedContent += `描述匹配: "${item.description}" `;
          }
        });
      }

      // 内容匹配（权重低）
      if (item.content) {
        const contentLower = item.content.toLowerCase();
        queryWords.forEach(word => {
          if (contentLower.includes(word)) {
            score += 1;
            // 找到匹配内容的上下文
            const wordIndex = contentLower.indexOf(word);
            const start = Math.max(0, wordIndex - 50);
            const end = Math.min(contentLower.length, wordIndex + 100);
            const context = item.content.substring(start, end);
            if (!matchedContent.includes('内容匹配')) {
              matchedContent += `内容匹配: "...${context}..." `;
            }
          }
        });
      }

      // 如果找到匹配项，添加到结果中
      if (score > 0) {
        results.push({
          ...item,
          score,
          matchedContent: matchedContent.trim(),
          index
        });
      }
    });

    // 按分数排序
    return results.sort((a, b) => b.score - a.score);
  }

  // 显示搜索结果
  displayResults(results) {
    if (results.length === 0) {
      this.showNoResults();
      return;
    }

    this.hideSearchTips();
    this.hideNoResults();

    const resultsHTML = results.map(result => this.createResultHTML(result)).join('');
    this.searchResults.innerHTML = `
      <div class="grid gap-6 md:grid-cols-3">
        ${resultsHTML}
      </div>
    `;
  }

  // 创建单个搜索结果的HTML
  createResultHTML(result) {
    const date = result.date ? new Date(result.date).toLocaleDateString('zh-CN').replace(/\//g, '-') : '';
    
    return `
      <a href="${result.url}" class="block p-5 rounded-2xl border border-black/5 dark:border-white/10 hover:border-livingCoral transition" data-aos="fade-up" data-aos-delay="${Math.floor(Math.random() * 6) * 60}">
        ${result.cover ? `<div class="h-40 w-full rounded-xl overflow-hidden mb-3"><img src="${result.cover}" alt="${result.title}" class="w-full h-full object-cover" loading="lazy" /></div>` : ''}
        <p class="text-sm text-neutral-500 dark:text-neutral-400">${date}</p>
        <p class="mt-1 font-semibold text-neutral-900 dark:text-white">${this.highlightText(result.title)}</p>
        <div class="mt-2 flex flex-wrap gap-2 text-sm">
          ${result.category ? `<span class="px-2 py-0.5 rounded bg-livingCoral/10 text-livingCoral">${result.category}</span>` : ''}
          ${result.tags && result.tags.length > 0 ? result.tags.map(tag => `<span class="px-2 py-0.5 rounded bg-black/5 dark:bg-white/10">#${tag}</span>`).join('') : ''}
        </div>
        <p class="mt-2 text-neutral-600 dark:text-neutral-400">${this.highlightText(result.description)}</p>
        <div class="mt-3 text-xs text-neutral-400">
          <span class="bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">相关度: ${result.score}</span>
        </div>
      </a>
    `;
  }

  // 高亮搜索关键词
  highlightText(text) {
    if (!text) return '';
    const query = this.searchInput.value.trim();
    if (!query) return text;

    const queryWords = query.split(/\s+/).filter(word => word.length > 0);
    let highlightedText = text;

    queryWords.forEach(word => {
      const regex = new RegExp(`(${word})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>');
    });

    return highlightedText;
  }

  // 显示搜索提示
  showSearchTips() {
    this.searchTips.classList.remove('hidden');
    this.searchResults.innerHTML = '';
    this.hideNoResults();
  }

  // 隐藏搜索提示
  hideSearchTips() {
    this.searchTips.classList.add('hidden');
  }

  // 显示无结果提示
  showNoResults() {
    this.noResults.classList.remove('hidden');
    this.searchResults.innerHTML = '';
    this.hideSearchTips();
  }

  // 隐藏无结果提示
  hideNoResults() {
    this.noResults.classList.add('hidden');
  }
}

// 页面加载完成后初始化搜索功能
document.addEventListener('DOMContentLoaded', () => {
  new BlogSearch();
});
