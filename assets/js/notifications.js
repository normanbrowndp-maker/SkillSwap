(function (global) {
  function ensureContainer() {
    let container = document.getElementById('skillswap-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'skillswap-toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      Object.assign(container.style, {
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        display: 'grid',
        gap: '12px',
        zIndex: '9999',
        maxWidth: '320px',
        width: 'min(320px, calc(100vw - 24px))'
      });
      document.body.appendChild(container);
    }
    return container;
  }

  function showToast(type, message) {
    const container = ensureContainer();
    const item = document.createElement('div');
    const tone = {
      success: '#39866F',
      error: '#B85B54',
      warning: '#B78932',
      info: '#345995'
    }[type] || '#345995';

    item.textContent = message;
    item.setAttribute('role', 'status');
    Object.assign(item.style, {
      background: tone,
      color: '#fff',
      borderRadius: '12px',
      padding: '12px 14px',
      boxShadow: '0 12px 24px rgba(23, 43, 77, 0.18)',
      fontSize: '0.92rem',
      lineHeight: '1.5',
      opacity: '0',
      transform: 'translateY(8px)',
      transition: 'opacity 220ms ease, transform 220ms ease',
      pointerEvents: 'auto'
    });

    container.appendChild(item);
    requestAnimationFrame(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(6px)';
      setTimeout(() => item.remove(), 220);
    }, 2800);
  }

  function createConfirmDialog(title, message, onConfirm) {
    let dialog = document.getElementById('skillswap-demo-dialog');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'skillswap-demo-dialog';
      dialog.setAttribute('aria-modal', 'true');
      dialog.style.minWidth = '320px';
      dialog.style.maxWidth = '420px';
      dialog.style.border = '1px solid #E2E8F0';
      dialog.style.borderRadius = '18px';
      dialog.style.padding = '0';
      dialog.style.boxShadow = '0 18px 38px rgba(23, 43, 77, 0.12)';
      dialog.innerHTML = `
        <div style="padding: 1.25rem 1.25rem 1rem;">
          <h3 style="margin: 0 0 0.5rem; color: #172B4D;">${title}</h3>
          <p style="margin: 0 0 1rem; color: #637083;">${message}</p>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button type="button" class="btn btn-ghost" data-close-dialog>Отмена</button>
            <button type="button" class="btn btn-primary" data-confirm-dialog>Подтвердить</button>
          </div>
        </div>
      `;
      document.body.appendChild(dialog);
    }

    dialog.querySelector('[data-close-dialog]').onclick = () => {
      dialog.close();
    };
    dialog.querySelector('[data-confirm-dialog]').onclick = () => {
      dialog.close();
      if (typeof onConfirm === 'function') {
        onConfirm();
      }
    };

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', 'open');
    }

    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      dialog.close();
    }, { once: true });
  }

  global.SkillSwapDemo = global.SkillSwapDemo || {};
  global.SkillSwapDemo.notifications = {
    showToast,
    createConfirmDialog
  };
})(window);
