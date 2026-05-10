# GrowVault

Goal-based savings mini app for MiniPay. Set a target, deposit cUSD, earn milestone badges.

## Features
- Create named, emoji goals with a target amount and deadline
- Soft lock (5% early withdrawal penalty) or Hard lock (locked until deadline/goal)
- Social contributions — anyone can deposit to your goal by goalId
- Milestone badges at 25%, 50%, 75%, 100% completion
- Full withdrawal on completion

## Setup
```bash
cd contracts && npm install
npm run deploy:alfajores

cd frontend && npm install
# paste deployed address into lib/contracts.ts
npm run dev
```
