(function (global) {
  const storage = global.SkillSwapDemo.storage;
  const notifications = global.SkillSwapDemo.notifications;

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function getFormErrorField(fieldId) {
    return document.getElementById(fieldId + '-error');
  }

  function setError(fieldId, message) {
    const errorEl = getFormErrorField(fieldId);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.hidden = !message;
    }
  }

  function setupDemoLogin() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = document.getElementById('login-email');
      const password = document.getElementById('login-password');
      const emailValue = email && email.value.trim();
      const passwordValue = password && password.value.trim();

      if (!emailValue || !validateEmail(emailValue)) {
        notifications.showToast('error', 'Введите корректный email для демо-входа.');
        return;
      }
      if (!passwordValue || passwordValue.length < 6) {
        notifications.showToast('error', 'Пароль должен содержать минимум 6 символов.');
        return;
      }

      notifications.showToast('success', 'Демо-режим: вход успешно подготовлен.');
      window.location.href = 'dashboard.html';
    });
  }

  function setupRegisterForm() {
    const form = document.getElementById('register-form');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const firstName = document.getElementById('first-name');
      const lastName = document.getElementById('last-name');
      const email = document.getElementById('register-email');
      const university = document.getElementById('university');
      const password = document.getElementById('register-password');
      const confirm = document.getElementById('confirm-password');
      const terms = document.getElementById('terms');

      if (!firstName || !lastName || !email || !university || !password || !confirm) {
        notifications.showToast('error', 'Заполните все поля, чтобы продолжить.');
        return;
      }

      const fullName = `${firstName.value.trim()} ${lastName.value.trim()}`.trim();
      if (!fullName || !validateEmail(email.value.trim())) {
        notifications.showToast('error', 'Проверьте имя, фамилию и email.');
        return;
      }
      if (password.value.trim().length < 6) {
        notifications.showToast('error', 'Пароль должен иметь минимум 6 символов.');
        return;
      }
      if (password.value.trim() !== confirm.value.trim()) {
        notifications.showToast('error', 'Пароли не совпадают.');
        return;
      }
      if (!terms || !terms.checked) {
        notifications.showToast('warning', 'Необходимо согласиться с условиями.');
        return;
      }

      storage.updateUser({
        name: fullName,
        email: email.value.trim(),
        university: university.value.trim(),
        course: '1 курс',
        availability: 'По согласованию'
      });
      notifications.showToast('success', 'Демо-регистрация сохранена локально.');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 600);
    });
  }

  function setupEditProfileForm() {
    const form = document.getElementById('edit-profile-form');
    if (!form) return;

    const user = storage.getCurrentUser();
    const nameInput = document.getElementById('edit-name');
    const surnameInput = document.getElementById('edit-surname');
    const universityInput = document.getElementById('edit-university');
    const courseInput = document.getElementById('edit-course');
    const descriptionInput = document.getElementById('edit-description');
    const skillsInput = document.getElementById('edit-skills');
    const learningInput = document.getElementById('edit-learning');
    const availabilityInput = document.getElementById('edit-availability');

    if (nameInput) nameInput.value = user.name.split(' ')[0] || user.name;
    if (surnameInput) surnameInput.value = user.name.split(' ').slice(1).join(' ') || '';
    if (universityInput) universityInput.value = user.university || '';
    if (courseInput) courseInput.value = user.course || '';
    if (descriptionInput) descriptionInput.value = user.description || '';
    if (skillsInput) skillsInput.value = Array.isArray(user.skills) ? user.skills.join(', ') : '';
    if (learningInput) learningInput.value = Array.isArray(user.learningGoals) ? user.learningGoals.join(', ') : '';
    if (availabilityInput) availabilityInput.value = user.availability || '';

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const fullName = `${nameInput.value.trim()} ${surnameInput.value.trim()}`.trim();
      if (!fullName || !universityInput.value.trim()) {
        notifications.showToast('error', 'Имя и учебное заведение обязательны.');
        return;
      }

      storage.updateUser({
        name: fullName,
        university: universityInput.value.trim(),
        course: courseInput.value.trim(),
        description: descriptionInput.value.trim(),
        skills: skillsInput.value.split(',').map((item) => item.trim()).filter(Boolean),
        learningGoals: learningInput.value.split(',').map((item) => item.trim()).filter(Boolean),
        availability: availabilityInput.value.trim()
      });

      notifications.showToast('success', 'Профиль обновлён в демо-режиме.');
      setTimeout(() => {
        window.location.href = 'profile.html';
      }, 500);
    });
  }

  function setupReviewForm() {
    const form = document.getElementById('review-form');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const teacher = document.getElementById('review-teacher');
      const skill = document.getElementById('review-skill');
      const rating = document.getElementById('review-rating');
      const comment = document.getElementById('review-comment');

      if (!teacher || !skill || !rating || !comment) return;

      if (!teacher.value.trim() || !skill.value.trim() || !comment.value.trim()) {
        notifications.showToast('error', 'Заполните все поля отзыва.');
        return;
      }

      const newReview = {
        id: `review-${Date.now()}`,
        teacher: teacher.value.trim(),
        skill: skill.value.trim(),
        rating: Number(rating.value),
        comment: comment.value.trim(),
        date: new Date().toISOString().slice(0, 10)
      };

      storage.addReview(newReview);
      notifications.showToast('success', 'Отзыв добавлен в демо-список.');
      form.reset();
    });
  }

  global.SkillSwapDemo = global.SkillSwapDemo || {};
  global.SkillSwapDemo.forms = {
    init: function () {
      setupDemoLogin();
      setupRegisterForm();
      setupEditProfileForm();
      setupReviewForm();
    }
  };
})(window);
