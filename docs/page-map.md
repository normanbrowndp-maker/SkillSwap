# Карта переходов между страницами

## Основные сценарии

### Публичная навигация
- Главная страница → Каталог навыков → Подробности навыка → Поиск партнёров → Профиль студента → Бронирование
- Главная страница → О проекте → Понимание модели обмена знаниями
- Главная страница → Вход / Регистрация

### Личный кабинет
- Личный кабинет → Профиль → Редактирование профиля
- Личный кабинет → Расписание → Бронирование
- Личный кабинет → Занятия → Отзывы
- Личный кабинет → Кошелёк → История SkillPoints

## Структура ссылок

- `index.html` → `pages/skills.html`, `pages/matches.html`, `pages/about.html`, `pages/login.html`, `pages/register.html`
- `pages/login.html` → `pages/register.html`, `pages/dashboard.html`
- `pages/register.html` → `pages/login.html`, `pages/dashboard.html`
- `pages/dashboard.html` → `pages/profile.html`, `pages/edit-profile.html`, `pages/skills.html`, `pages/matches.html`, `pages/schedule.html`, `pages/sessions.html`, `pages/wallet.html`, `pages/reviews.html`
- `pages/profile.html` → `pages/edit-profile.html`, `pages/matches.html`, `pages/schedule.html`
- `pages/skills.html` → `pages/skill-details.html`, `pages/matches.html`
- `pages/skill-details.html` → `pages/matches.html`, `pages/student-profile.html`
- `pages/matches.html` → `pages/student-profile.html`, `pages/booking.html`
- `pages/student-profile.html` → `pages/booking.html`
- `pages/schedule.html` → `pages/booking.html`, `pages/sessions.html`
- `pages/booking.html` → `pages/sessions.html`
- `pages/sessions.html` → `pages/reviews.html`
- `pages/wallet.html` → `pages/dashboard.html`
- `pages/reviews.html` → `pages/sessions.html`
- `pages/about.html` → `../index.html`, `pages/skills.html`, `pages/matches.html`

## Примечание

Переходы между страницами в Step 1 демонстрационные. Реальные ограничения доступа и бизнес-логика будут добавлены на следующих этапах.
