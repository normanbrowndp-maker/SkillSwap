(function (global) {
  const storage = global.SkillSwapDemo.storage;

  function mapLevel(level) {
    const values = {
      'начальный': 1,
      'medium': 2,
      'средний': 2,
      'advanced': 3,
      'продвинутый': 3,
      'c1': 3,
      'b2': 2,
      'б2': 2,
      'c2': 3
    };
    return values[String(level || '').toLowerCase()] || 1;
  }

  function scoreStudent(student, filters) {
    const skillTarget = (filters.skill || '').trim().toLowerCase();
    const skillMatch = student.skills.some((skillItem) => skillItem.name.toLowerCase() === skillTarget)
      ? 100
      : 0;

    if (!skillMatch) {
      return null;
    }

    const ratingScore = (student.rating / 5) * 100;
    const levelTarget = mapLevel(filters.level || 'Средний');
    const levelCandidate = mapLevel(student.skills[0].level);
    const levelGap = Math.abs(levelTarget - levelCandidate);
    const levelScore = 100 - Math.min(100, levelGap * 35);
    const scheduleScore = (student.timeSlots.includes(filters.day) || student.timeSlots.includes(filters.dayShort)) ? 100 : 70;
    const preferenceScore = student.format === filters.format || filters.format === 'Любой' ? 100 : 70;

    const total = Math.round(
      0.35 * skillMatch +
      0.25 * scheduleScore +
      0.2 * ratingScore +
      0.1 * levelScore +
      0.1 * preferenceScore
    );

    return { total, ratingScore, scheduleScore, levelScore, preferenceScore };
  }

  function applyFilters() {
    const form = document.getElementById('matches-form');
    const resultBox = document.getElementById('matches-results');
    if (!form || !resultBox) return;

    const skillInput = document.getElementById('match-skill');
    const levelInput = document.getElementById('match-level');
    const formatInput = document.getElementById('match-format');
    const dayInput = document.getElementById('match-day');

    const skill = (skillInput ? skillInput.value : '').trim() || 'Python';
    const level = levelInput ? levelInput.value : 'Средний';
    const format = formatInput ? formatInput.value : 'Онлайн';
    const day = dayInput ? dayInput.value : 'Пн';

    const state = storage.getState();
    const items = state.students
      .filter((student) => student.id !== state.user.id)
      .map((student) => {
        const scoreData = scoreStudent(student, { skill, level, format, day, dayShort: day.slice(0, 2) });
        if (!scoreData) return null;
        return { ...student, score: scoreData.total, scoreBreakdown: scoreData };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);

    if (!items.length) {
      resultBox.innerHTML = '<div class="empty-state">Подходящих студентов не найдено. Попробуйте изменить фильтры.</div>';
      return;
    }

    resultBox.innerHTML = items.map((student) => `
      <article class="card" data-reveal>
        <div class="section-title-row">
          <h3>${student.name}</h3>
          <span class="badge badge-blue">${student.score}%</span>
        </div>
        <p><strong>Навык:</strong> ${skill}</p>
        <p><strong>Уровень:</strong> ${student.skills[0].level}</p>
        <p><strong>Рейтинг:</strong> <span class="rating">★ ${student.rating}</span> (${student.reviews} отзывов)</p>
        <p><strong>Время:</strong> ${student.timeSlots.join(', ')}</p>
        <p><strong>Формат:</strong> ${student.format}</p>
        <p>${student.bio}</p>
        <div class="match-meta">
          <span>Совпадение: ${student.score}%</span>
          <span>График: ${student.scoreBreakdown.scheduleScore}%</span>
        </div>
        <div class="page-links">
          <a href="student-profile.html">Профиль</a>
          <a href="booking.html?teacher=${student.id}&skill=${encodeURIComponent(skill)}">Записаться</a>
        </div>
      </article>
    `).join('');
  }

  function bindMatchesPage() {
    const form = document.getElementById('matches-form');
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      applyFilters();
    });
    applyFilters();
  }

  global.SkillSwapDemo = global.SkillSwapDemo || {};
  global.SkillSwapDemo.matching = {
    bindMatchesPage,
    applyFilters,
    scoreStudent
  };
})(window);
