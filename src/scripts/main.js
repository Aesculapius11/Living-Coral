// 主题切换
function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  // 同步浏览器地址栏主题色
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', (theme === 'dark') ? '#0a0a0a' : '#ffffff');
}

function initTheme() {
  try {
    const saved = localStorage.getItem('theme');
    if (saved) applyTheme(saved);
  } catch (e) {}
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  const next = isDark ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('theme', next); } catch (e) {}
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();

  // 桌面端黑暗模式切换按钮
  const btn = document.getElementById('themeToggle');
  if (btn) btn.addEventListener('click', toggleTheme);

  // 移动端黑暗模式切换按钮
  const mobileThemeBtn = document.getElementById('themeToggleMobile');
  if (mobileThemeBtn) mobileThemeBtn.addEventListener('click', toggleTheme);

  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
  // 为代码块添加复制按钮
  try {
    document.querySelectorAll('pre > code').forEach((codeEl) => {
      const pre = codeEl.parentElement;
      if (!pre || pre.querySelector('.copy-btn')) return;
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.type = 'button';
      btn.innerHTML = '<span>复制</span>';
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(codeEl.textContent || '');
          btn.classList.add('copied');
          btn.innerHTML = '<span>已复制</span>';
          setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = '<span>复制</span>'; }, 1500);
        } catch (_) {}
      });
      pre.appendChild(btn);
    });
  } catch (_) {}
});

// 存储已处理的图片ID，避免重复处理
const processedImages = new Set();

// 渐进式图片加载函数
function loadOriginalImage(imageId, originalSrc) {
  const img = document.getElementById(imageId);
  if (!img) {
    console.warn('Image element not found:', imageId);
    return;
  }
  
  // 检查是否已经处理过
  if (processedImages.has(imageId)) {
    console.log('Image already processed:', imageId);
    return;
  }
  
  // 标记为已处理
  processedImages.add(imageId);
  
  console.log('Starting to load original image:', originalSrc);
  
  // 尝试加载原始图片，如果失败则尝试其他格式
  function tryLoadImage(src, fallbackFormats = []) {
    const testImg = new Image();
    
    // 设置超时处理（5秒超时）
    const timeout = setTimeout(() => {
      console.warn('Image load timeout:', src);
      if (fallbackFormats.length > 0) {
        // 尝试下一个格式
        const nextFormat = fallbackFormats.shift();
        const fallbackSrc = originalSrc.replace(/\.[^.]+$/, nextFormat);
        console.log('Trying fallback format:', fallbackSrc);
        tryLoadImage(fallbackSrc, fallbackFormats);
      } else {
        // 所有格式都失败了，移除模糊效果
        img.style.filter = 'none';
        img.style.transition = 'filter 0.3s ease';
      }
    }, 5000);
    
    testImg.onload = function() {
      clearTimeout(timeout);
      console.log('Original image loaded successfully:', src);
      
      // 原始图片加载完成后，替换src并移除模糊效果
      img.src = src;
      img.style.filter = 'none';
      img.style.transition = 'filter 0.3s ease';
      // 确保图片填满容器
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
    };
    
    testImg.onerror = function() {
      clearTimeout(timeout);
      console.warn('Failed to load image:', src);
      if (fallbackFormats.length > 0) {
        // 尝试下一个格式
        const nextFormat = fallbackFormats.shift();
        const fallbackSrc = originalSrc.replace(/\.[^.]+$/, nextFormat);
        console.log('Trying fallback format:', fallbackSrc);
        tryLoadImage(fallbackSrc, fallbackFormats);
      } else {
        // 所有格式都失败了，移除模糊效果
        img.style.filter = 'none';
        img.style.transition = 'filter 0.3s ease';
      }
    };
    
    testImg.src = src;
  }
  
  // 根据原始URL的扩展名确定回退格式
  const originalExt = originalSrc.split('.').pop().toLowerCase();
  let fallbackFormats = [];
  
  // 对于 img.antares.xin 域名，优先尝试常见的格式
  if (originalSrc.includes('img.antares.xin')) {
    if (originalExt === 'avif') {
      fallbackFormats = ['.webp', '.jpg', '.jpeg', '.png'];
    } else if (originalExt === 'webp') {
      fallbackFormats = ['.jpg', '.jpeg', '.png'];
    } else if (originalExt === 'jpg' || originalExt === 'jpeg') {
      fallbackFormats = ['.webp', '.png'];
    } else if (originalExt === 'png') {
      fallbackFormats = ['.jpg', '.jpeg', '.webp'];
    } else {
      // 未知格式，尝试常见格式
      fallbackFormats = ['.webp', '.jpg', '.jpeg', '.png'];
    }
  } else {
    // 其他域名，使用通用回退
    if (originalExt === 'avif') {
      fallbackFormats = ['.webp', '.jpg', '.jpeg', '.png'];
    } else if (originalExt === 'webp') {
      fallbackFormats = ['.jpg', '.jpeg', '.png'];
    } else if (originalExt === 'jpg' || originalExt === 'jpeg') {
      fallbackFormats = ['.png', '.webp'];
    } else if (originalExt === 'png') {
      fallbackFormats = ['.jpg', '.jpeg', '.webp'];
    }
  }
  
  // 开始尝试加载
  tryLoadImage(originalSrc, fallbackFormats);
}

// 将函数暴露到全局作用域，供HTML中的onload调用
window.loadOriginalImage = loadOriginalImage;

// 确保在DOM加载完成后函数立即可用
document.addEventListener('DOMContentLoaded', () => {
  // 重新绑定函数到全局作用域，确保可用
  window.loadOriginalImage = loadOriginalImage;
  
  console.log('Progressive image loading system initialized');
  
  // 检查是否有遗漏的渐进式图片需要处理
  const progressiveImages = document.querySelectorAll('img[id^="progressive-img-"]');
  console.log('Found progressive images:', progressiveImages.length);
  
  progressiveImages.forEach(img => {
    // 检查图片是否还是LQIP状态（模糊且是小图片）且未被处理过
    if (img.src.includes('/img/') && img.src.includes('-24.jpeg') && 
        img.style.filter.includes('blur') && !processedImages.has(img.id)) {
      const originalSrc = img.closest('picture')?.getAttribute('data-original-src');
      if (originalSrc) {
        console.log('Processing missed progressive image:', img.id, originalSrc);
        // 延迟一点时间再处理，避免与onload事件冲突
        setTimeout(() => {
          loadOriginalImage(img.id, originalSrc);
        }, 500);
      }
    }
  });
});


