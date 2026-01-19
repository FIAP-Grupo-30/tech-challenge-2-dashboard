# Dashboard - Microfrontend de Dashboard e Análises

## 📋 Visão Geral

O **@bytebank/dashboard** é um microfrontend remoto que fornece funcionalidades de dashboard com gráficos, análises e visualizações de dados financeiros.

## 🎯 Responsabilidades

### 1. **Dashboard Principal**
- Visualização de saldo e resumo financeiro
- Gráficos e métricas
- Análises de transações

### 2. **Visualizações**
- Gráficos de receitas e despesas
- Análise de categorias
- Tendências temporais

## 🏗️ Arquitetura

```
tech-challenge-2-dashboard/
├── src/
│   ├── bytebank-dashboard.tsx  # Entry point Module Federation
│   ├── App.tsx                  # Componente principal
│   ├── main.tsx                 # Ponto de entrada React
│   ├── components/
│   │   └── Dashboard.tsx       # Componente principal do dashboard
│   └── globals.css              # Estilos globais (Tailwind CSS v4)
├── vite.config.ts               # Configuração Vite + Module Federation
├── package.json
├── tsconfig.json
├── biome.json                   # Configuração BiomeJS
├── .tool-versions               # Versão Node.js (asdf)
└── README.md
```

## 📦 Exportações

O @bytebank/dashboard exporta o componente principal via Module Federation:

```typescript
// Entry point: src/bytebank-dashboard.tsx
import React from 'react';
import App from './App';
import './globals.css';

const Dashboard = () => {
  return <App />;
};

export default Dashboard;
```

## 🧩 Componentes

### Dashboard

**Localização:** `src/components/Dashboard.tsx`

Componente principal que renderiza gráficos, métricas e análises usando Recharts.

## 🔄 Integração com Store Global

O microfrontend dashboard pode acessar a store Zustand global via Module Federation:

```typescript
// Importar store via Module Federation
import useStore from '@bytebank/root/bytebank-store';

// Usar a store nos componentes
const auth = useStore((state) => state.auth);
const transactions = useStore((state) => state.transactions);
const account = useStore((state) => state.account);
```

## 🎨 Estilos Globais

**Localização:** `src/globals.css`

```css
@import 'tailwindcss';

/* Variáveis CSS ByteBank */
:root {
  --bytebank-green: #47A138;
  --bytebank-green-dark: #3a8a2e;
  --bytebank-green-light: #59b449;
  --bytebank-black: #000000;
  --bytebank-gray: #CCCCCC;
  --bytebank-gray-light: #e4e1e1;
  --bytebank-gray-medium: #666666;
}

/* Classes customizadas do ByteBank */
@layer components {
  .btn-bytebank-primary { /* ... */ }
  .btn-bytebank-secondary { /* ... */ }
  /* ... */
}
```

### Uso de Prefixos Tailwind CSS

⚠️ **IMPORTANTE**: Este projeto utiliza o prefixo `dash:` para todas as classes Tailwind CSS para evitar conflitos com outros microfrontends.

#### Configuração

O prefixo é configurado no arquivo `src/globals.css`:

```css
@import "tailwindcss" prefix(dash);
```

#### Como Usar Classes Tailwind

Todas as classes Tailwind usadas diretamente no JSX devem incluir o prefixo `dash:`:

```tsx
// ✅ CORRETO - Com prefixo
<div className="dash:flex dash:items-center dash:justify-center">
  <p className="dash:text-2xl dash:font-bold dash:text-white">Conteúdo</p>
</div>

// ❌ ERRADO - Sem prefixo (pode causar conflitos)
<div className="flex items-center justify-center">
  <p className="text-2xl font-bold text-white">Conteúdo</p>
</div>
```

#### Variantes e Responsividade

Para variantes como `hover:`, `focus:`, e breakpoints responsivos (`md:`, `lg:`, etc.), use o formato `[prefixo]:[variante]:[classe]`:

```tsx
// Hover
<button className="dash:bg-green-500 dash:hover:bg-green-600">

// Responsividade
<div className="dash:flex dash:flex-col dash:md:flex-row">

// Classes arbitrárias
<div className="dash:bg-[#47A138] dash:w-[170px]">
```

#### No @apply (globals.css)

Quando usar `@apply` dentro de `@layer components`, use o formato `[prefixo]:[variante]:[classe]`:

```css
@layer components {
  .minha-classe {
    @apply dash:bg-white dash:hover:bg-gray-100 dash:md:flex;
  }
}
```

#### Classes Customizadas (NÃO precisam de prefixo)

Classes customizadas definidas em `@layer components` (como `.btn-bytebank-primary`) **NÃO** precisam de prefixo, pois já são nomes únicos:

```tsx
// ✅ CORRETO - Classe customizada sem prefixo
<button className="btn-bytebank-primary">Clique aqui</button>
```

## 🛠️ Comandos

### Desenvolvimento
```bash
npm run dev
```
Inicia o servidor de desenvolvimento na porta 9003.

### Build
```bash
npm run build
```
Cria build de produção na pasta `dist/`.

### Preview
```bash
npm run preview
```
Serve o build de produção para testes.

### Linting e Formatação
```bash
npm run lint      # Verifica problemas de código
npm run format    # Formata o código
npm run check     # Executa lint + format
```

## 📊 Dependências

### Produção
```json
{
  "react": "^19.2.3",
  "react-dom": "^19.2.3",
  "react-router-dom": "^7.12.0",
  "recharts": "^2.12.0"
}
```

### Desenvolvimento
```json
{
  "vite": "^7.3.1",
  "@originjs/vite-plugin-federation": "^1.4.1",
  "@vitejs/plugin-react": "^5.1.2",
  "@tailwindcss/vite": "^4.1.18",
  "tailwindcss": "^4.1.18",
  "@biomejs/biome": "^2.3.11",
  "@types/react": "^19.2.8",
  "@types/react-dom": "^19.2.3",
  "typescript": "^5.9.3"
}
```

## 🔍 Troubleshooting

### Module Federation não funciona
Verificar se o remote está configurado corretamente no root-config e se a porta 9003 está acessível.

### Estilos não aplicados
Verificar se o plugin `@tailwindcss/vite` está configurado no `vite.config.ts` e se `globals.css` importa `@import 'tailwindcss';`.

### Gráficos não renderizam
Verificar se o Recharts está instalado e se os dados estão sendo passados corretamente.

## 🔧 Gerenciamento de Versões

### Node.js
O projeto utiliza **Node.js LTS 24.12.0**, gerenciado via **asdf**. A versão está especificada no `package.json` (engines) e no `.tool-versions`.

Para configurar o ambiente:
```bash
asdf install nodejs 24.12.0
asdf local nodejs 24.12.0
```

### Plataforma de hospedagem

Vercel - https://vercel.com/


## 👥 Equipe

**FIAP Grupo 30 - Tech Challenge 2**

## 📄 Licença

MIT License
