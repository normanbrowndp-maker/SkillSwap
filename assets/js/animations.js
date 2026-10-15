(function (global) {
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealElements() {
    if (prefersReducedMotion) {
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('[data-reveal]').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(14px)';
      el.style.transition = 'opacity 420ms ease, transform 420ms cubic-bezier(0.22, 1, 0.36, 1)';
      observer.observe(el);
    });
  }

  function initPageEntrance() {
    const main = document.querySelector('main');
    if (!main) return;
    if (prefersReducedMotion) {
      main.style.opacity = '1';
      main.style.transform = 'none';
      return;
    }
    main.style.opacity = '0';
    main.style.transform = 'translateY(8px)';
    main.style.transition = 'opacity 320ms ease, transform 320ms cubic-bezier(0.22, 1, 0.36, 1)';
    requestAnimationFrame(() => {
      main.style.opacity = '1';
      main.style.transform = 'translateY(0)';
    });
  }

  global.SkillSwapDemo = global.SkillSwapDemo || {};
  global.SkillSwapDemo.animations = {
    init: function () {
      initPageEntrance();
      revealElements();
    }
  };
})(window);
