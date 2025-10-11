// 存储已处理的图片ID，避免重复处理
const processedImages = new Set();

function loadOriginalImage(imageId, originalSrc) {
  const img = document.getElementById(imageId);
  if (!img || processedImages.has(imageId)) return;
  processedImages.add(imageId);

  img.src = originalSrc;
  img.style.filter = 'none';
  img.style.transition = 'filter 0.3s ease';
  img.removeAttribute('width');
  img.removeAttribute('height');
  img.style.cssText = 'width:100%;height:100%;display:block;object-fit:cover;';
  img.loading = "lazy";
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