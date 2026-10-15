(function (global) {
  const STORAGE_KEY = 'skillswap_mvp_v1';

  const baseStudents = [
    {
      id: 's1',
      name: 'Иван Петров',
      role: 'Python mentor',
      skills: [{ name: 'Python', level: 'Продвинутый' }],
      rating: 4.9,
      reviews: 27,
      format: 'Онлайн',
      timeSlots: ['Пн', 'Ср', 'Пт'],
      preferredTime: '18:00–20:00',
      bio: 'Помогает структурировать обучение и объясняет логику программирования понятными примерами.'
    },
    {
      id: 's2',
      name: 'Мария Соколова',
      role: 'English tutor',
      skills: [{ name: 'Английский язык', level: 'C1' }],
      rating: 4.8,
      reviews: 22,
      format: 'Онлайн',
      timeSlots: ['Вт', 'Чт', 'Сб'],
      preferredTime: '17:30–19:30',
      bio: 'Готова помогать с разговорной практикой, произношением и подготовкой к экзаменам.'
    },
    {
      id: 's3',
      name: 'Анастасия Миронова',
      role: 'Design mentor',
      skills: [{ name: 'Графический дизайн', level: 'Средний' }],
      rating: 4.7,
      reviews: 19,
      format: 'Гибрид',
      timeSlots: ['Пт', 'Сб'],
      preferredTime: '15:00–17:00',
      bio: 'Помогает раскрыть визуальную задачу и выстроить логическую композицию для проекта.'
    },
    {
      id: 's4',
      name: 'Дмитрий Козлов',
      role: 'Math tutor',
      skills: [{ name: 'Математика', level: 'Продвинутый' }],
      rating: 5,
      reviews: 30,
      format: 'Онлайн',
      timeSlots: ['Пн', 'Вт', 'Чт'],
      preferredTime: '19:00–21:00',
      bio: 'Учит решать задачи системно и объясняет сложные формулы простым языком.'
    },
    {
      id: 's5',
      name: 'Елена Маркова',
      role: 'Excel mentor',
      skills: [{ name: 'Excel', level: 'Средний' }],
      rating: 4.6,
      reviews: 16,
      format: 'Онлайн',
      timeSlots: ['Ср', 'Пт'],
      preferredTime: '18:00–19:00',
      bio: 'Помогает быстро освоить формулы, таблицы и базовую автоматизацию в Excel.'
    },
    {
      id: 's6',
      name: 'Сергей Николаев',
      role: 'JS mentor',
      skills: [{ name: 'JavaScript', level: 'Продвинутый' }],
      rating: 4.9,
      reviews: 25,
      format: 'Онлайн',
      timeSlots: ['Пт', 'Сб'],
      preferredTime: '18:30–20:30',
      bio: 'Подсказывает, как быстро привыкнуть к логике JavaScript и строить понятные решения.'
    },
    {
      id: 's7',
      name: 'Ольга Баранова',
      role: 'Language mentor',
      skills: [{ name: 'Английский язык', level: 'B2' }],
      rating: 4.8,
      reviews: 18,
      format: 'Гибрид',
      timeSlots: ['Пн', 'Вт', 'Сб'],
      preferredTime: '16:00–18:00',
      bio: 'Сфокусирована на разговорной практике, грамматике и уверенности в устной речи.'
    },
    {
      id: 's8',
      name: 'Никита Лебедев',
      role: 'Python coach',
      skills: [{ name: 'Python', level: 'Средний' }],
      rating: 4.5,
      reviews: 14,
      format: 'Онлайн',
      timeSlots: ['Ср', 'Чт', 'Пт'],
      preferredTime: '17:00–19:00',
      bio: 'Помогает решать практические задачи и выбирать корректный порядок обучения.'
    }
  ];

  const baseState = {
    demoMode: true,
    user: {
      id: 'u-demo-1',
      name: 'Алина Кузнецова',
      email: 'alina@demo.skillwap',
      university: 'Московский государственный университет',
      course: '2 курс',
      description: 'Студентка, интересующаяся программированием, языками и проектами в области данных.',
      skills: ['Python', 'Excel', 'Public speaking'],
      learningGoals: ['Английский язык', 'Графический дизайн', 'Математика'],
      availability: 'Вечерние и выходные дни'
    },
    students: baseStudents,
    sessions: [
      {
        id: 'session-001',
        partner: 'Илья Лебедев',
        skill: 'Английский язык',
        date: '2026-10-20',
        time: '18:00',
        status: 'upcoming'
      },
      {
        id: 'session-002',
        partner: 'Марина Соколова',
        skill: 'Python',
        date: '2026-10-05',
        time: '19:30',
        status: 'completed'
      },
      {
        id: 'session-003',
        partner: 'Анна Попова',
        skill: 'Excel',
        date: '2026-10-12',
        time: '17:00',
        status: 'cancelled'
      }
    ],
    wallet: {
      total: 30,
      reserved: 0,
      available: 30,
      transactions: [
        {
          id: 'txn-001',
          type: 'credit',
          amount: 30,
          label: 'Стартовый баланс',
          date: '2026-10-01'
        }
      ]
    },
    reviews: [
      {
        id: 'review-001',
        teacher: 'Илья Лебедев',
        skill: 'Английский язык',
        rating: 5,
        comment: 'Понятные объяснения и полезная практика разговорной речи.',
        date: '2026-09-12'
      }
    ]
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeState(state) {
    const safeState = clone(baseState);
    if (!state || typeof state !== 'object') {
      return safeState;
    }

    safeState.demoMode = Boolean(state.demoMode !== false);
    safeState.user = { ...safeState.user, ...(state.user || {}) };
    safeState.students = Array.isArray(state.students) && state.students.length ? state.students : safeState.students;
    safeState.sessions = Array.isArray(state.sessions) ? state.sessions : safeState.sessions;
    safeState.wallet = {
      ...safeState.wallet,
      ...(state.wallet || {})
    };
    safeState.reviews = Array.isArray(state.reviews) ? state.reviews : safeState.reviews;
    safeState.user.skills = Array.isArray(state.user && state.user.skills) ? state.user.skills : safeState.user.skills;
    safeState.user.learningGoals = Array.isArray(state.user && state.user.learningGoals) ? state.user.learningGoals : safeState.user.learningGoals;

    const wallet = safeState.wallet;
    wallet.available = Number(wallet.total || 0) - Number(wallet.reserved || 0);

    return safeState;
  }

  function readState() {
    try {
      const raw = global.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return clone(baseState);
      }
      const parsed = JSON.parse(raw);
      return normalizeState(parsed);
    } catch (error) {
      return clone(baseState);
    }
  }

  function saveState(state) {
    const nextState = normalizeState(state);
    global.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    return clone(nextState);
  }

  function resetState() {
    saveState(clone(baseState));
    return readState();
  }

  const storageApi = {
    STORAGE_KEY,
    defaultState: clone(baseState),
    getState: function () {
      return readState();
    },
    saveState,
    resetState,
    getCurrentUser: function () {
      return readState().user;
    },
    updateUser: function (updates) {
      const state = readState();
      state.user = { ...state.user, ...updates };
      return saveState(state);
    },
    addSession: function (session) {
      const state = readState();
      state.sessions.unshift(session);
      return saveState(state);
    },
    updateSessionStatus: function (sessionId, status) {
      const state = readState();
      state.sessions = state.sessions.map((session) => {
        if (session.id === sessionId) {
          return { ...session, status };
        }
        return session;
      });
      return saveState(state);
    },
    addReview: function (review) {
      const state = readState();
      state.reviews.unshift(review);
      return saveState(state);
    },
    addTransaction: function (transaction) {
      const state = readState();
      state.wallet.transactions.unshift(transaction);
      state.wallet.total = Number(state.wallet.total || 0) + Number(transaction.amount || 0);
      state.wallet.available = Number(state.wallet.total || 0) - Number(state.wallet.reserved || 0);
      return saveState(state);
    },
    reserveFunds: function (amount, reason) {
      const state = readState();
      const bookingAmount = Number(amount || 0);
      if (bookingAmount <= 0) {
        return { valid: false, message: 'Сумма резерва должна быть больше нуля.' };
      }
      if (state.wallet.available < bookingAmount) {
        return { valid: false, message: 'Недостаточно доступных SkillPoints для этого занятия.' };
      }
      state.wallet.reserved = Number(state.wallet.reserved || 0) + bookingAmount;
      state.wallet.available = Number(state.wallet.total || 0) - Number(state.wallet.reserved || 0);
      state.wallet.transactions.unshift({
        id: `txn-${Date.now()}`,
        type: 'reserve',
        amount: -bookingAmount,
        label: reason || 'Резерв SkillPoints',
        date: new Date().toISOString().slice(0, 10)
      });
      saveState(state);
      return { valid: true, state: readState() };
    },
    releaseFunds: function (amount, reason) {
      const state = readState();
      const releaseAmount = Number(amount || 0);
      if (releaseAmount <= 0) {
        return { valid: false, message: 'Сумма возврата должна быть больше нуля.' };
      }
      state.wallet.reserved = Math.max(0, Number(state.wallet.reserved || 0) - releaseAmount);
      state.wallet.available = Number(state.wallet.total || 0) - Number(state.wallet.reserved || 0);
      state.wallet.transactions.unshift({
        id: `txn-${Date.now()}`,
        type: 'release',
        amount: releaseAmount,
        label: reason || 'Возврат SkillPoints',
        date: new Date().toISOString().slice(0, 10)
      });
      saveState(state);
      return { valid: true, state: readState() };
    }
  };

  global.SkillSwapDemo = global.SkillSwapDemo || {};
  global.SkillSwapDemo.storage = storageApi;
})(window);
