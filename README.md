# BlockBlast

Block Blast puzzle + on-chain leaderboard (Base Sepolia)

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

## Деплой на Vercel

Проект готов к деплою на Vercel. Просто подключите репозиторий GitHub к Vercel.
