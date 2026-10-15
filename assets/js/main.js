(function (global) {
  const storage = global.SkillSwapDemo.storage;
  const notifications = global.SkillSwapDemo.notifications;
  const animations = global.SkillSwapDemo.animations;
  const matching = global.SkillSwapDemo.matching;
  const forms = global.SkillSwapDemo.forms;

  function initGlobal() {
    if (typeof animations !== 'undefined' && animations.init) {
      animations.init();
    }
    if (typeof forms !== 'undefined' && forms.init) {
      forms.init();
    }
    if (typeof matching !== 'undefined' && matching.bindMatchesPage) {
      matching.bindMatchesPage();
    }
  }

  function safeText(value) {
    return (value || '').toString();
  }

  function initDashboardPage() {
    const state = storage.getState();
    const user = state.user;
    const balanceNode = document.getElementById('dashboard-balance');
    const userNameNode = document.getElementById('dashboard-user-name');
    const nextSessionNode = document.getElementById('next-session');
    const sessionListNode = document.getElementById('dashboard-sessions');
    const recommendationsNode = document.getElementById('dashboard-recommendations');

    if (userNameNode) {
      userNameNode.textContent = user.name || 'Студент';
    }
    if (balanceNode) {
      balanceNode.textContent = `${state.wallet.total - state.wallet.reserved} SP`;
    }

    const upcoming = state.sessions.filter((session) => session.status === 'upcoming');
    if (nextSessionNode && upcoming.length) {
      const next = upcoming[0];
      nextSessionNode.textContent = `${next.skill} · ${next.date} · ${next.time}`;
    }

    if (sessionListNode) {
      sessionListNode.innerHTML = upcoming.slice(0, 3).map((session) => `
        <li><strong>${session.skill}</strong> · ${session.partner} · ${session.date} · ${session.time}</li>
      `).join('') || '<li>Пока нет предстоящих занятий.</li>';
    }

    if (recommendationsNode) {
      recommendationsNode.innerHTML = state.students
        .filter((student) => student.id !== state.user.id)
        .slice(0, 3)
        .map((student) => `
          <li>
            <strong>${student.name}</strong> · ${student.skills[0].name} · рейтинг ${student.rating}
          </li>
        `)
        .join('');
    }
  }

  function initSkillsPage() {
    const searchField = document.getElementById('skill-search');
    const levelField = document.getElementById('skill-level');
    const cards = Array.from(document.querySelectorAll('[data-skill-card]'));
    const emptyState = document.getElementById('skills-empty-state');

    if (!cards.length) return;

    function applySkillFilters() {
      const query = (searchField ? searchField.value : '').trim().toLowerCase();
      const level = levelField ? levelField.value : 'all';
      let visible = 0;

      cards.forEach((card) => {
        const name = (card.dataset.name || '').toLowerCase();
        const category = (card.dataset.category || '').toLowerCase();
        const levelValue = card.dataset.level || 'beginner';
        const matchesQuery = !query || name.includes(query) || category.includes(query);
        const matchesLevel = level === 'all' || levelValue === level;
        const visibleCard = matchesQuery && matchesLevel;
        card.hidden = !visibleCard;
        if (visibleCard) visible += 1;
      });

      if (emptyState) {
        emptyState.hidden = visible !== 0;
      }
    }

    if (searchField) searchField.addEventListener('input', applySkillFilters);
    if (levelField) levelField.addEventListener('change', applySkillFilters);
    applySkillFilters();
  }

  function initBookingPage() {
    const form = document.getElementById('booking-form');
    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    const teacherId = params.get('teacher');
    const skillName = params.get('skill');
    const state = storage.getState();
    const teacher = state.students.find((item) => item.id === teacherId) || state.students[0];

    const teacherNode = document.getElementById('booking-teacher');
    const skillNode = document.getElementById('booking-skill');
    const costNode = document.getElementById('booking-cost');
    const durationNode = document.getElementById('booking-duration');
    const dateField = document.getElementById('booking-date');

    if (teacherNode) teacherNode.textContent = teacher.name;
    if (skillNode) skillNode.textContent = skillName || teacher.skills[0].name;
    if (costNode) costNode.textContent = '10 SP';
    if (durationNode) durationNode.textContent = '60 минут';
    if (dateField) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateField.min = tomorrow.toISOString().slice(0, 10);
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const date = document.getElementById('booking-date')?.value;
      const time = document.getElementById('booking-time')?.value;
      const note = document.getElementById('booking-note')?.value || '';

      if (!date || !time) {
        notifications.showToast('error', 'Выберите дату и время занятия.');
        return;
      }

      const wallet = storage.getState().wallet;
      const amount = 10;
      if (wallet.available < amount) {
        notifications.showToast('error', 'Недостаточно доступных SkillPoints для бронирования.');
        return;
      }

      const reservation = storage.reserveFunds(amount, `Бронирование: ${skillName || teacher.skills[0].name}`);
      if (!reservation.valid) {
        notifications.showToast('error', reservation.message);
        return;
      }

      storage.addSession({
        id: `session-${Date.now()}`,
        partner: teacher.name,
        skill: skillName || teacher.skills[0].name,
        date,
        time,
        status: 'upcoming',
        note
      });

      notifications.showToast('success', 'Занятие успешно забронировано в демо-режиме.');
      setTimeout(() => {
        window.location.href = 'sessions.html';
      }, 700);
    });
  }

  function initSessionsPage() {
    const state = storage.getState();
    const list = document.getElementById('sessions-list');
    if (!list) return;

    const sections = {
      upcoming: state.sessions.filter((session) => session.status === 'upcoming'),
      completed: state.sessions.filter((session) => session.status === 'completed'),
      cancelled: state.sessions.filter((session) => session.status === 'cancelled')
    };

    const buildSessionMarkup = (session) => `
      <li class="card" data-reveal>
        <div class="section-title-row">
          <strong>${session.skill}</strong>
          <span class="status ${session.status === 'upcoming' ? 'confirmed' : session.status === 'completed' ? 'pending' : 'cancelled'}">${session.status === 'upcoming' ? 'Предстоящее' : session.status === 'completed' ? 'Завершено' : 'Отменено'}</span>
        </div>
        <p>Партнёр: ${session.partner}</p>
        <p>Дата: ${session.date} · Время: ${session.time}</p>
        ${session.status === 'completed' ? '<a href="reviews.html">Оставить отзыв</a>' : ''}
        ${session.status === 'upcoming' ? '<button type="button" class="btn btn-ghost" data-cancel-session="' + session.id + '">Отменить</button>' : ''}
      </li>
    `;

    list.innerHTML = [
      `<li><h3>Предстоящие</h3><ul class="session-list">${sections.upcoming.map(buildSessionMarkup).join('') || '<li>Нет предстоящих занятий.</li>'}</ul></li>`,
      `<li><h3>Завершённые</h3><ul class="session-list">${sections.completed.map(buildSessionMarkup).join('') || '<li>Нет завершённых занятий.</li>'}</ul></li>`,
      `<li><h3>Отменённые</h3><ul class="session-list">${sections.cancelled.map(buildSessionMarkup).join('') || '<li>Нет отменённых занятий.</li>'}</ul></li>`
    ].join('');

    const buttons = document.querySelectorAll('[data-cancel-session]');
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const sessionId = button.getAttribute('data-cancel-session');
        notifications.createConfirmDialog('Отмена занятия', 'Вы действительно хотите отменить это занятие?', () => {
          const state = storage.getState();
          const target = state.sessions.find((session) => session.id === sessionId);
          if (!target) return;
          if (target.status !== 'upcoming') {
            notifications.showToast('warning', 'Это занятие нельзя отменить повторно.');
            return;
          }
          storage.updateSessionStatus(sessionId, 'cancelled');
          storage.releaseFunds(10, `Возврат после отмены: ${target.skill}`);
          notifications.showToast('info', 'Занятие отменено, резерв SkillPoints освобождён.');
          initSessionsPage();
        });
      });
    });
  }

  function initWalletPage() {
    const state = storage.getState();
    const total = document.getElementById('wallet-total');
    const available = document.getElementById('wallet-available');
    const reserved = document.getElementById('wallet-reserved');
    const transactions = document.getElementById('wallet-transactions');

    if (total) total.textContent = `${state.wallet.total} SP`;
    if (available) available.textContent = `${state.wallet.available} SP`;
    if (reserved) reserved.textContent = `${state.wallet.reserved} SP`;
    if (transactions) {
      transactions.innerHTML = state.wallet.transactions
        .map((item) => `
          <li>
            <div class="section-title-row">
              <strong>${safeText(item.label)}</strong>
              <span class="${Number(item.amount) >= 0 ? 'amount-positive' : 'amount-negative'}">${Number(item.amount) >= 0 ? '+' : '-'}${Math.abs(item.amount)} SP</span>
            </div>
            <small>${safeText(item.date)}</small>
          </li>
        `)
        .join('');
    }
  }

  function initReviewsPage() {
    const state = storage.getState();
    const list = document.getElementById('reviews-list');
    if (!list) return;
    list.innerHTML = state.reviews.map((review) => `
      <article class="card" data-reveal>
        <h3>${review.teacher}</h3>
        <p><strong>Навык:</strong> ${review.skill}</p>
        <p><strong>Рейтинг:</strong> ${review.rating}/5</p>
        <p><strong>Дата:</strong> ${review.date}</p>
        <p>${review.comment}</p>
      </article>
    `).join('');
  }

  function initProfilePage() {
    const state = storage.getState();
    const user = state.user;
    const blocks = {
      'profile-name': user.name,
      'profile-school': user.university,
      'profile-course': user.course,
      'profile-description': user.description,
      'profile-skills': Array.isArray(user.skills) ? user.skills.join(', ') : '',
      'profile-learning': Array.isArray(user.learningGoals) ? user.learningGoals.join(', ') : '',
      'profile-availability': user.availability
    };

    Object.entries(blocks).forEach(([id, value]) => {
      const node = document.getElementById(id);
      if (node) node.textContent = value;
    });
  }

  function initSchedulePage() {
    const cards = document.querySelectorAll('[data-slot]');
    cards.forEach((slot) => {
      slot.addEventListener('click', () => {
        cards.forEach((item) => item.classList.remove('selected'));
        slot.classList.add('selected');
      });
    });
  }

  function initDefaultDemoReset() {
    const resetButton = document.getElementById('reset-demo-state');
    if (!resetButton) return;
    resetButton.addEventListener('click', () => {
      notifications.createConfirmDialog('Сброс демо-состояния', 'Это действие вернёт проект к исходному демонстрационному состоянию.', () => {
        storage.resetState();
        notifications.showToast('info', 'Демо-состояние сброшено.');
        window.location.reload();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initGlobal();

    const page = document.body.dataset.page;
    if (page === 'dashboard') initDashboardPage();
    if (page === 'skills') initSkillsPage();
    if (page === 'matches') initMatchingPage();
    if (page === 'booking') initBookingPage();
    if (page === 'sessions') initSessionsPage();
    if (page === 'wallet') initWalletPage();
    if (page === 'reviews') initReviewsPage();
    if (page === 'profile' || page === 'edit-profile') initProfilePage();
    if (page === 'schedule') initSchedulePage();
    if (page === 'home') initDashboardPage();

    initDefaultDemoReset();
  });

  function initMatchingPage() {
    if (typeof matching !== 'undefined' && matching.bindMatchesPage) {
      matching.bindMatchesPage();
    }
  }

  global.SkillSwapDemo = global.SkillSwapDemo || {};
  global.SkillSwapDemo.main = {
    initDashboardPage,
    initBookingPage,
    initWalletPage,
    initSessionsPage,
    initProfilePage,
    initReviewsPage,
    initSkillsPage,
    initSchedulePage,
    initMatchingPage
  };
})(window);
