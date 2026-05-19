# GrowVault

Goal-based savings mini app for MiniPay on Celo. Set a savings target, deposit cUSD, and earn milestone badges as you progress toward your goal.

## Value Proposition

Saving money is hard without accountability. GrowVault lets users in emerging markets commit to a savings goal — school fees, a phone, a business deposit — with a real on-chain lock that makes breaking the commitment costly. Friends and family can contribute too, turning personal goals into community efforts.

## Features

- **Named, emoji goals** — personalise each goal with a name and icon
- **Soft lock** — 5% fee on early withdrawal (accountability with flexibility)
- **Hard lock** — funds held until deadline or goal is met (maximum commitment)
- **Social contributions** — anyone can deposit to a goal by sharing its ID
- **Milestone badges** — claimed on-chain at 25%, 50%, 75%, and 100% completion
- **Stats dashboard** — live view of total goals, cUSD locked in vault, and penalty pool

## Tech Stack

- **Smart contract**: Solidity, Hardhat, OpenZeppelin — deployed on Celo
- **Frontend**: Next.js 14, wagmi v2, viem, Tailwind CSS
- **Token**: cUSD (Celo Dollar)
- **Target wallet**: MiniPay

## Setup

```bash
cd contracts && npm install
npm run deploy:alfajores

cd frontend && npm install
# paste deployed address into lib/contracts.ts
npm run dev
```

## Roadmap

**Shipped**
- [x] Goal creation with soft/hard lock modes
- [x] Social contributions (anyone deposits to a goal)
- [x] Milestone badges at 25%, 50%, 75%, 100%
- [x] Stats dashboard (goals created, cUSD locked, penalty pool)

**Next**
- [ ] Yield integration — earn while saving (Mento / Uniswap LP)
- [ ] Push notifications for milestone events
- [ ] Group goals — shared savings pools
- [ ] MiniPay listing

## Go-To-Market

Target users are MiniPay users in sub-Saharan Africa saving toward specific short-term goals (school fees, devices, healthcare). Initial distribution via Celo/MiniPay community channels, with referral mechanics through shareable goal links ("help me reach my goal").
