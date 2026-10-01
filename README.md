# Recipe Sharing Platform 🍳

Платформа за споделяне на рецепти за еърфрайер и мултикукър

## Функционалности

✅ **Регистрация и вход** - Създаване на акаунт и секурна аутентикация
✅ **Профили на потребители** - Персонални профили с аватари и биография
✅ **Добавяне на рецепти** - Създаване на рецепти с инструкции и снимки
✅ **Категории** - Еърфрайер и мултикукър
✅ **Филтри** - По трудност, време за готвене и тагове
✅ **Оценки и коментари** - Оценяване и коментиране на рецепти
✅ **Любими рецепти** - Запазване на любимите си рецепти
✅ **Търсене** - Намиране на рецепти по име и описание
✅ **Адаптивен дизайн** - Работи на телефон и компютър

## Структура на проекта

```
.
├── models/              # Database models
│   ├── User.js
│   ├── Recipe.js
│   └── Comment.js
├── routes/              # API routes
│   ├── auth.js
│   ├── recipes.js
│   ├── users.js
│   └── comments.js
├── middleware/          # Custom middleware
│   ├── auth.js
│   └── validation.js
├── uploads/             # Uploaded images
├── server.js            # Main server file
├── package.json
└── README.md
```

## Инсталация

### Предварителни изисквания
- Node.js (v14 или по-ново)
- MongoDB (локално или cloud)

### Стъпки

1. **Клониране на репозитория**
```bash
git clone https://github.com/Dboyanova/recipe-sharing-platform.git
cd recipe-sharing-platform
```

2. **Инсталация на dependencies**
```bash
npm install
```

3. **Конфигуриране на .env файл**
Създайте `.env` файл в корена на проекта:
```
MONGODB_URI=mongodb://localhost:27017/recipe-platform
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

4. **Стартиране на сървъра**
```bash
npm run dev
```

Сървърът ще работи на `http://localhost:5000`

## API Endpoints

### Аутентикация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход

### Рецепти
- `GET /api/recipes` - Всички рецепти
- `GET /api/recipes/:id` - Една рецепта
- `POST /api/recipes` - Създаване на рецепта (авторизиран)
- `PUT /api/recipes/:id` - Редактиране на рецепта (авторизиран)
- `DELETE /api/recipes/:id` - Изтриване на рецепта (авторизиран)
- `POST /api/recipes/:id/rate` - Оценяване на рецепта (авторизиран)

### Потребители
- `GET /api/users/:id` - Профил на потребител
- `PUT /api/users/me` - Редактиране на профила (авторизиран)
- `POST /api/users/favorites/add` - Добавяне в любими (авторизиран)
- `POST /api/users/favorites/remove` - Премахване от любими (авторизиран)
- `GET /api/users/:id/favorites` - Любимите рецепти на потребител

### Коментари
- `POST /api/comments` - Добавяне на коментар (авторизиран)
- `DELETE /api/comments/:id` - Изтриване на коментар (авторизиран)

## Следващи стъпки

1. **Frontend приложение** - React, Vue или Angular
2. **Модериране на съдържание** - Администраторски панел
3. **Нотификации** - Известяване на потребители
4. **Social sharing** - Споделяне в социални мрежи
5. **Mobile app** - Native мобилно приложение

## Лицензия

MIT License - вижте LICENSE файла за повече информация
