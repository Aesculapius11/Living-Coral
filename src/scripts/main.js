// 主题切换
const ANIMATION_DURATION = 500; // 按钮动画时长（毫秒）
let isAnimating = false; // 防止快速点击时的问题

function applyTheme(theme) {
  const root = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  
  if (theme === 'dark') {
    root.classList.add('dark');
    if (meta) meta.setAttribute('content', '#0a0a0a');
  } else {
    root.classList.remove('dark');
    if (meta) meta.setAttribute('content', '#ffffff');
  }
}

function disableButtonAnimations() {
  const button = document.getElementById('themeToggle');
  if (button) {
    button.classList.add('theme-no-animate');
  }
}

function enableButtonAnimations() {
  const button = document.getElementById('themeToggle');
  if (button) {
    button.classList.remove('theme-no-animate');
  }
}

function setButtonState(theme, animate = false) {
  const button = document.getElementById('themeToggle');
  if (button) {
    const isPressed = theme === 'dark' ? 'true' : 'false';
    
    // 如果状态没有改变，则不需要更新
    if (button.getAttribute('aria-pressed') === isPressed) {
      return;
    }
    
    // 如果需要播放动画，添加一个动画类
    if (animate) {
      button.classList.add('theme-animating');
    }
    
    button.setAttribute('aria-pressed', isPressed);
    
    // 移除动画类（在下一帧移除以确保动画完成后清理）
    if (animate) {
      setTimeout(() => {
        button.classList.remove('theme-animating');
      }, ANIMATION_DURATION);
    }
  }
}

function getCurrentTheme() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function initTheme() {
  try {
    const saved = localStorage.getItem('theme');
    const theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // 应用主题到根元素
    applyTheme(theme);
    
    // 移除 theme-no-animate 类，启用后续的过渡
    const button = document.getElementById('themeToggle');
    if (button) {
      button.classList.remove('theme-no-animate');
    }
    
    try { localStorage.setItem('theme', theme); } catch (e) {}
  } catch (e) {}
}

function toggleTheme() {
  // 防止快速多次点击
  if (isAnimating) return;
  
  const currentTheme = getCurrentTheme();
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  const button = document.getElementById('themeToggle');
  
  if (!button) return;
  
  isAnimating = true;
  
  // 立即改变按钮状态以启动动画
  setButtonState(nextTheme, true);
  
  // 等待动画完成后再切换主题
  setTimeout(() => {
    applyTheme(nextTheme);
    try { localStorage.setItem('theme', nextTheme); } catch (e) {}
    isAnimating = false;
  }, ANIMATION_DURATION);
}

// 移动端直接切换，没有延迟
function toggleThemeMobile() {
  const currentTheme = getCurrentTheme();
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  // 直接应用主题，没有延迟
  applyTheme(nextTheme);
  try { localStorage.setItem('theme', nextTheme); } catch (e) {}
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();

  // 桌面端黑暗模式切换按钮（带动画，有延迟）
  const btn = document.getElementById('themeToggle');
  if (btn) btn.addEventListener('click', toggleTheme);

  // 移动端黑暗模式切换按钮（直接切换，无延迟）
  const mobileThemeBtn = document.getElementById('themeToggleMobile');
  if (mobileThemeBtn) mobileThemeBtn.addEventListener('click', toggleThemeMobile);

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




