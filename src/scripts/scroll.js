document.addEventListener('DOMContentLoaded', function() {
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');
  const throttleDelay = 200; // 节流间隔
  const finalCheckDelay = 500;    // 滚动停止后多久执行最终检查
  let lastScrollTime = 0;
  let timeoutId;

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function throttledToggleScrollToTopButton() {
    const currentTime = Date.now();
    const timeSinceLastScroll = currentTime - lastScrollTime;

    if (timeSinceLastScroll > throttleDelay) {

      lastScrollTime = currentTime;
      const scrollY = window.scrollY;
      //console.log("Scroll Y:", scrollY);

      if (scrollY > 300) {
        //console.log("Scroll > 300");
        if (scrollToTopBtn.classList.contains('hidden')) {

          scrollToTopBtn.classList.remove('hidden');
          scrollToTopBtn.classList.add('visible');
          scrollToTopBtn.classList.add('fall-down');
          scrollToTopBtn.classList.add('float');

          await delay(500);
          scrollToTopBtn.classList.remove('fall-down');
          //console.log("Fall-down animation finished");
        } else {
          //console.log("Button already visible");
        }
      } else if (scrollY < 100) {
        //console.log("Scroll < 100");
        if (scrollToTopBtn.classList.contains('visible')) {

          scrollToTopBtn.classList.add('rise-up');
          scrollToTopBtn.classList.remove('float');

          await delay(500);
          scrollToTopBtn.classList.remove('rise-up');
          scrollToTopBtn.classList.remove('visible');
          scrollToTopBtn.classList.add('hidden');
          //console.log("Rise-up animation finished");
        } else {
          //console.log("Button already hidden");
        }
      } else {
        //console.log("Scroll between 100 and 300 - No action");
      }
    } else {
      //console.log("Throttled - Skipping");
    }

    // 每次滚动都清除之前的timeout，并重新设置. 确保 **只有在滚动停止 `finalCheckDelay` 毫秒后，才会执行最终检查**
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
      //console.log("Final check executed");
      throttledToggleScrollToTopButton(); // 再次执行一次，确保状态正确
    }, finalCheckDelay);
  }

  window.addEventListener('scroll', throttledToggleScrollToTopButton);
  scrollToTopBtn.addEventListener('click', scrollToTop);
});