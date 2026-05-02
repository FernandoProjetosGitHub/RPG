# RPG Legends

Web app mobile-first para fichas de personagens de RPG, feito com React, Vite e CSS puro.

## Requisitos

- Node.js 20 ou superior
- npm

## Instalação

```bash
npm install
```

## Execução local

```bash
npm run dev
```

Depois abra o endereço exibido no terminal. Por padrão, o projeto usa:

```bash
http://127.0.0.1:5173
```

## Build de produção

```bash
npm run build
```

Os arquivos finais serão gerados em `dist/`.

## Preview do build

```bash
npm run preview
```

## Deploy na Vercel

1. Suba o repositório para o GitHub.
2. Na Vercel, clique em `Add New Project`.
3. Importe o repositório `FernandoProjetosGitHub/RPG`.
4. Use as configurações padrão detectadas pela Vercel:
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
