// 文章目录（TOC）与移动端弹窗脚本：从 post.njk 提取
(function () {
  function generateTableOfContents() {
    const tocContainer = document.getElementById('tableOfContents');
    const mobileTocContainer = document.getElementById('mobileTableOfContents');
    if (!tocContainer && !mobileTocContainer) return;

    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const tocItems = [];

    // Helper: create a slug from heading text. Keep ASCII word chars and a common
    // range for CJK (Chinese) characters. Falls back to a numeric id if empty.
    function slugify(str) {
      if (!str) return '';
      // Normalize diacritics, convert to lower case
      let s = String(str).normalize('NFKD').toLowerCase().trim();
      // Replace whitespace with dashes
      s = s.replace(/\s+/g, '-');
      // Remove characters except word chars, dash, and basic CJK range
      s = s.replace(/[^\w\-\u4e00-\u9fff]/g, '');
      // Collapse multiple dashes
      s = s.replace(/-+/g, '-');
      // Trim leading/trailing dashes
      s = s.replace(/^[-]+|[-]+$/g, '');
      return s;
    }

    const usedIds = new Set();

    headings.forEach((heading, index) => {
      const isInToc = heading.closest('#tableOfContents, #mobileTableOfContents, aside');
      if (isInToc) return;

      const text = heading.textContent.trim();
      if (text === '目录') return;

      const isInHeader = heading.closest('header');
      if (isInHeader && heading.tagName === 'H1') return;

      if (heading.tagName === 'H1') return;

      // Preserve existing id if present, otherwise generate from text
      let id = heading.id && String(heading.id).trim();
      if (id) {
        // Ensure uniqueness for existing ids
        if (usedIds.has(id)) {
          let i = 1;
          let newId;
          do {
            newId = `${id}-${i}`;
            i += 1;
          } while (usedIds.has(newId));
          id = newId;
        }
        usedIds.add(id);
        heading.id = id;
      } else {
        const base = slugify(text) || `heading-${index}`;
        let candidate = base;
        let counter = 0;
        while (usedIds.has(candidate)) {
          counter += 1;
          candidate = `${base}-${counter}`;
        }
        id = candidate;
        usedIds.add(id);
        heading.id = id;
      }

      const level = parseInt(heading.tagName.charAt(1), 10);
      tocItems.push({ id, text, level });
    });

    if (tocItems.length > 0) {
      const tocHTML = tocItems
        .map((item) => {
          const indent = (item.level - 2) * 12;
          const style = `padding-left: ${indent}px`;
          return `
          <a href="#${item.id}"
             class="block text-sm text-neutral-600 dark:text-neutral-400 hover:text-livingCoral dark:hover:text-livingCoral transition-colors duration-200 py-1 rounded"
             style="${style}"
             data-heading-id="${item.id}">
            ${item.text}
          </a>`;
        })
        .join('');

      if (tocContainer) tocContainer.innerHTML = tocHTML;
      if (mobileTocContainer) mobileTocContainer.innerHTML = tocHTML;

      function handleTocClick(e) {
        if (e.target.tagName === 'A') {
          e.preventDefault();
          const targetId = e.target.getAttribute('href').substring(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            const headerHeight = 80;
            const rect = targetElement.getBoundingClientRect();
            const scrollTop = window.pageYOffset + rect.top - headerHeight;
            window.scrollTo({ top: scrollTop, behavior: 'smooth' });
            history.pushState(null, null, `#${targetId}`);
            const mobileModal = document.getElementById('mobileTocModal');
            if (mobileModal && !mobileModal.classList.contains('hidden')) {
              mobileModal.classList.add('hidden');
            }
          }
        }
      }

      if (tocContainer) tocContainer.addEventListener('click', handleTocClick);
      if (mobileTocContainer) mobileTocContainer.addEventListener('click', handleTocClick);

      let currentActiveId = null;

      function updateActiveHeading() {
        const headingEls = tocItems.map((item) => document.getElementById(item.id)).filter(Boolean);
        if (headingEls.length === 0) return;

        let activeId = null;
        headingEls.forEach((heading) => {
          const rect = heading.getBoundingClientRect();
          if (rect.top <= 100) {
            activeId = heading.id;
          }
        });
        if (!activeId && headingEls.length > 0) {
          const lastHeading = headingEls[headingEls.length - 1];
          const lastRect = lastHeading.getBoundingClientRect();
          if (lastRect.top < window.innerHeight) {
            activeId = lastHeading.id;
          }
        }

        if (activeId !== currentActiveId) {
          if (currentActiveId) {
            const prevActiveDesktop = tocContainer?.querySelector(`[data-heading-id="${currentActiveId}"]`);
            const prevActiveMobile = mobileTocContainer?.querySelector(`[data-heading-id="${currentActiveId}"]`);
            if (prevActiveDesktop) {
              prevActiveDesktop.classList.remove('text-livingCoral', 'font-medium');
              prevActiveDesktop.classList.add('text-neutral-600', 'dark:text-neutral-400');
            }
            if (prevActiveMobile) {
              prevActiveMobile.classList.remove('text-livingCoral', 'font-medium');
              prevActiveMobile.classList.add('text-neutral-600', 'dark:text-neutral-400');
            }
          }

          if (activeId) {
            const newActiveDesktop = tocContainer?.querySelector(`[data-heading-id="${activeId}"]`);
            const newActiveMobile = mobileTocContainer?.querySelector(`[data-heading-id="${activeId}"]`);
            if (newActiveDesktop) {
              newActiveDesktop.classList.remove('text-neutral-600', 'dark:text-neutral-400');
              newActiveDesktop.classList.add('text-livingCoral', 'font-medium');
            }
            if (newActiveMobile) {
              newActiveMobile.classList.remove('text-neutral-600', 'dark:text-neutral-400');
              newActiveMobile.classList.add('text-livingCoral', 'font-medium');
            }
          }
          currentActiveId = activeId;
          // When the active heading changes due to scrolling, update the URL hash
          // using replaceState so we don't pollute the browser history.
          try {
            if (activeId) {
              const newHash = `#${activeId}`;
              if (location.hash !== newHash) {
                history.replaceState(null, null, newHash);
              }
            }
          } catch (e) {
            // Some older browsers or restricted environments may throw; ignore.
            // eslint-disable-next-line no-console
            console && console.warn && console.warn('Failed to update URL hash for TOC', e);
          }
        }
      }

      window.addEventListener('scroll', updateActiveHeading);
      updateActiveHeading();
    } else {
      const noContentMsg = '<p class="text-sm text-neutral-500 dark:text-neutral-400">暂无目录</p>';
      if (tocContainer) tocContainer.innerHTML = noContentMsg;
      if (mobileTocContainer) mobileTocContainer.innerHTML = noContentMsg;
    }
  }

  function setupMobileToc() {
    const mobileTocBtn = document.getElementById('mobileTocBtn');
    const mobileTocModal = document.getElementById('mobileTocModal');
    const mobileTocClose = document.getElementById('mobileTocClose');

    if (mobileTocBtn && mobileTocModal) {
      mobileTocBtn.addEventListener('click', () => {
        mobileTocModal.classList.remove('hidden');
        setTimeout(() => {
          const modalContent = mobileTocModal.querySelector('.bg-white, .dark\\:bg-neutral-900');
          if (modalContent) {
            modalContent.classList.add('mobile-toc-enter');
          }
        }, 10);
      });
    }

    if (mobileTocClose && mobileTocModal) {
      mobileTocClose.addEventListener('click', () => {
        const modalContent = mobileTocModal.querySelector('.bg-white, .dark\\:bg-neutral-900');
        if (modalContent) {
          modalContent.classList.remove('mobile-toc-enter');
        }
        setTimeout(() => {
          mobileTocModal.classList.add('hidden');
        }, 300);
      });
    }

    if (mobileTocModal) {
      mobileTocModal.addEventListener('click', (e) => {
        if (e.target === mobileTocModal) {
          const modalContent = mobileTocModal.querySelector('.bg-white, .dark\\:bg-neutral-900');
          if (modalContent) {
            modalContent.classList.remove('mobile-toc-enter');
          }
          setTimeout(() => {
            mobileTocModal.classList.add('hidden');
          }, 300);
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    generateTableOfContents();
    setupMobileToc();
  });
})();


