# RPG Legends

Web app mobile-first para fichas de personagens de RPG, feito com React, Vite e CSS puro.

## Requisitos

- Node.js 20 ou superior
- npm

## Instalacao

```bash
npm install
```

## Execucao local

```bash
npm run dev
```

Depois abra o endereco exibido no terminal. Por padrao, o projeto usa:

```bash
http://127.0.0.1:5173
```

## Build de producao

```bash
npm run build
```

Os arquivos finais serao gerados em `dist/`.

## Preview do build

```bash
npm run preview
```

## Deploy na Vercel

1. Suba o repositorio para o GitHub.
2. Na Vercel, clique em `Add New Project`.
3. Importe o repositorio `FernandoProjetosGitHub/RPG`.
4. Use as configuracoes padrao detectadas pela Vercel:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Clique em `Deploy`.

## Stack

- React
- Vite
- CSS puro
- Dados mockados/local state
