# Инструкция по восстановлению проекта Block Blast

Все файлы проекта сохранены в Git репозитории: `https://github.com/Tjrom/Blockblastbase.git`

## Быстрое восстановление

Если проект уже в папке `C:\Users\anyas\Desktop\blockblast`:

```bash
# 1. Перейти в папку проекта
cd C:\Users\anyas\Desktop\blockblast

# 2. Установить зависимости
npm install

# 3. Создать .env файл (если его нет)
copy env.example .env
# Затем отредактировать .env и добавить:
# PRIVATE_KEY=your_private_key
# BASE_SEPOLIA_RPC=https://sepolia.base.org
# NEXT_PUBLIC_LEADERBOARD_ADDRESS=your_contract_address (опционально)

# 4. Запустить dev сервер
npm run dev
```

## Восстановление из Git (если папка удалена)

```bash
# 1. Клонировать репозиторий
git clone https://github.com/Tjrom/Blockblastbase.git C:\Users\anyas\Desktop\blockblast

# 2. Перейти в папку
cd C:\Users\anyas\Desktop\blockblast

# 3. Установить зависимости
npm install

# 4. Создать .env файл
copy env.example .env
# Отредактировать .env

# 5. Запустить dev сервер
npm run dev
```

## Важные файлы проекта

### Основные файлы:
- `app/page.tsx` - Игровая логика
- `app/game.css` - Стили игры
- `app/layout.tsx` - Layout с мета-тегами
- `app/.well-known/farcaster.json/route.ts` - Base Mini App манифест

### Конфигурация:
- `package.json` - Зависимости и скрипты
- `next.config.js` - Next.js конфигурация
- `tsconfig.json` - TypeScript конфигурация
- `hardhat.config.ts` - Hardhat конфигурация
- `vercel.json` - Vercel конфигурация

### Контракты:
- `contracts/BlockBlastLeaderboard.sol` - Смарт-контракт лидерборда
- `scripts/deploy.ts` - Скрипт деплоя контракта
- `lib/leaderboardAbi.ts` - ABI контракта

### Изображения (генерируются динамически):
- `app/embed.png/route.tsx` - Embed изображение для постов
- `app/icon.png/route.tsx` - Иконка приложения
- `app/splash.png/route.tsx` - Splash screen
- `app/hero.png/route.tsx` - Hero изображение

## Деплой

### Vercel
Проект уже подключен к Vercel: https://blockblastbase.vercel.app
Изменения автоматически деплоятся при push в `main` ветку.

### Base Mini App
- Манифест: `/.well-known/farcaster.json`
- Account Association настроен
- URL: https://blockblastbase.vercel.app

## Команды

```bash
# Разработка
npm run dev          # Запуск dev сервера
npm run build        # Сборка проекта
npm run start        # Запуск production сервера

# Смарт-контракты
npm run hh:compile   # Компиляция контрактов
npm run deploy:base-sepolia  # Деплой контракта на Base Sepolia
```

## Git информация

- Репозиторий: https://github.com/Tjrom/Blockblastbase.git
- Ветка: main
- Последний коммит: все изменения сохранены

## Важно

- Файл `.env` НЕ сохранен в Git (для безопасности)
- Нужно создать `.env` из `env.example` после клонирования
- `node_modules/` не нужен в Git (устанавливается через `npm install`)
