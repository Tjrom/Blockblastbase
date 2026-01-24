# Block Blast - Puzzle Game on Base

Block Blast puzzle game with on-chain leaderboard on Base Sepolia. Drag and drop blocks to clear lines and compete for the top score!

**Live URL:** https://blockblastbase.vercel.app

**Base Mini App:** Published on Base App

## Установка

```bash
npm install
```

## Запуск

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## On-chain Leaderboard (Base Sepolia)

### 1) Деплой контракта лидерборда

Скопируй `env.example` → `.env` и заполни:
- `PRIVATE_KEY` — приватный ключ кошелька-деплоера (с тестовым ETH)
- `BASE_SEPOLIA_RPC` — можно оставить `https://sepolia.base.org`

Деплой:

```bash
npm run deploy:base-sepolia
```

Команда выведет адрес контракта.

### 2) Подключить контракт к сайту

В `.env` добавь:
- `NEXT_PUBLIC_LEADERBOARD_ADDRESS=0x...`

Либо просто вставь адрес в поле **Leaderboard contract address** на странице игры.

## Деплой

### Vercel

Проект уже задеплоен на Vercel: https://blockblastbase.vercel.app

Для обновления просто запушите изменения в `main` ветку:
```bash
git push origin main
```

### Base Mini App

Проект настроен как Base Mini App:
- Манифест: `/.well-known/farcaster.json`
- Account Association настроен
- Embed мета-теги настроены
- URL: https://blockblastbase.vercel.app

### Смарт-контракт (Base Sepolia)

```bash
# Деплой контракта лидерборда
npm run deploy:base-sepolia
```

После деплоя добавь адрес контракта в `.env`:
```
NEXT_PUBLIC_LEADERBOARD_ADDRESS=0x...
```
