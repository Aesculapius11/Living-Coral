// 存储已处理的图片ID，避免重复处理
const processedImages = new Set();

function getFallbackFormats(ext, domain) {
  const common = ['.webp', '.jpg', '.jpeg', '.png', '.avif'];
  if (domain.includes('img.antares.xin')) {
    if (ext === 'webp') return ['.png', '.avif', '.jpeg', '.jpg'];
    if (ext === 'png') return ['.avif', '.jpeg', '.jpg'];
    if (ext === 'avif') return ['.jpg', '.jpeg'];
    if (ext === 'jpg' || ext === 'jpeg') return ['.webp', '.png'];
    return common;
  } else {
    if (ext === 'avif') return ['.webp', '.jpg', '.jpeg', '.png'];
    if (ext === 'webp') return ['.jpg', '.jpeg', '.png'];
    if (ext === 'jpg' || ext === 'jpeg') return ['.png', '.webp'];
    if (ext === 'png') return ['.jpg', '.jpeg', '.webp'];
    return common;
  }
}

function loadOriginalImage(imageId, originalSrc) {
  const img = document.getElementById(imageId);
  if (!img || processedImages.has(imageId)) return;
  processedImages.add(imageId);

  const ext = originalSrc.split('.').pop().toLowerCase();
  const fallbackFormats = getFallbackFormats(ext, originalSrc);

  function tryLoad(src, formats) {
    const testImg = new Image();
    const timeout = setTimeout(() => {
      if (formats.length) {
        const next = formats.shift();
        tryLoad(originalSrc.replace(/\.[^.]+$/, next), formats);
      } else {
        img.style.filter = 'none';
        img.style.transition = 'filter 0.3s ease';
      }
    }, 5000);

    testImg.onload = function() {
      clearTimeout(timeout);
      img.src = src;
      img.style.filter = 'none';
      img.style.transition = 'filter 0.3s ease';
      img.removeAttribute('width');
      img.removeAttribute('height');
      img.style.cssText = 'width:100%;max-width:100%;height:auto;display:block;object-fit:cover;';
    };

    testImg.onerror = function() {
      clearTimeout(timeout);
      if (formats.length) {
        const next = formats.shift();
        tryLoad(originalSrc.replace(/\.[^.]+$/, next), formats);
      } else {
        img.style.filter = 'none';
        img.style.transition = 'filter 0.3s ease';
      }
    };

    testImg.src = src;
  }

  tryLoad(originalSrc, [...fallbackFormats]);
}

window.loadOriginalImage = loadOriginalImage;

document.addEventListener('DOMContentLoaded', () => {
  window.loadOriginalImage = loadOriginalImage;
  document.querySelectorAll('img[id^="progressive-img-"]').forEach(img => {
    if (
      img.src.includes('/img/') &&
      img.src.includes('-24.jpeg') &&
      img.style.filter.includes('blur') &&
      !processedImages.has(img.id)
    ) {
      const originalSrc = img.closest('picture')?.getAttribute('data-original-src');
      if (originalSrc) {
        setTimeout(() => loadOriginalImage(img.id, originalSrc), 500);
      }
    }
  });
});