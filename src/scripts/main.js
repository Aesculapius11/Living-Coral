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


