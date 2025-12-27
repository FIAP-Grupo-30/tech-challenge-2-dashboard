# Dashboard - Visão Geral ByteBank

## 📋 Visão Geral

O **@bytebank/dashboard** é o microfrontend responsável por exibir a visão geral da conta do usuário no ByteBank. Ele apresenta informações consolidadas, resumos de transações recentes, gráficos de gastos e insights financeiros.

Este MFE é ativado quando o usuário acessa as rotas `/` (home) ou `/dashboard`.

## 🎯 Responsabilidades

### 1. **Página Inicial (Home)**
- Primeira tela que o usuário vê após login
- Mensagem de boas-vindas personalizada
- Visão geral do saldo e contas

### 2. **Resumo Financeiro**
- Saldo atual da conta selecionada
- Total de receitas do mês
- Total de despesas do mês
- Comparação com mês anterior

### 3. **Transações Recentes**
- Últimas 5-10 transações
- Link rápido para extrato completo
- Indicadores visuais por tipo

### 4. **Gráficos e Visualizações**
- Gráfico de receitas vs despesas
- Gráfico de gastos por categoria
- Evolução do saldo ao longo do tempo
- Metas de economia

### 5. **Atalhos Rápidos**
- Botões para ações comuns (transferência, depósito)
- Acesso rápido a outras seções
- Notificações importantes

## 🏗️ Arquitetura

```
tech-challenge-2-dashboard/
├── src/
│   ├── bytebank-dashboard.tsx      # Entry point Single-SPA
│   ├── App.tsx                     # Componente raiz
│   ├── globals.css                 # Estilos Tailwind
│   └── components/
│       └── Dashboard.tsx           # Componente principal
├── vite.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## 📦 Estrutura de Componentes

### Entry Point - `bytebank-dashboard.tsx`

Configuração Single-SPA React:

```typescript
import React from 'react';
import * as ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import App from './App';
import './globals.css';

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: App,
  errorBoundary(err: Error) {
    console.error('@bytebank/dashboard error:', err);
    return <div className="text-red-500 p-4">Erro no módulo dashboard</div>;
  },
});

export const { bootstrap, mount, unmount } = lifecycles;
```

### App Component - `App.tsx`

Container principal que renderiza o Dashboard:

```typescript
import React from 'react';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard />
    </div>
  );
};

export default App;
```

### Dashboard Component - `components/Dashboard.tsx`

Componente principal com todas as seções do dashboard:

#### **Estado e Dados**

```typescript
import React, { useState, useEffect } from 'react';

interface DashboardState {
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  recentTransactions: Transaction[];
  isLoading: boolean;
}

const Dashboard: React.FC = () => {
  const [state, setState] = useState<DashboardState>({
    balance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    recentTransactions: [],
    isLoading: true,
  });
  
  const [user, setUser] = useState<User | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  
  useEffect(() => {
    loadDashboardData();
  }, [selectedAccount]);
  
  const loadDashboardData = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const token = localStorage.getItem('bytebank_token');
      const accountId = localStorage.getItem('bytebank_selected_account');
      
      if (!accountId || !token) {
        console.warn('Usuário não autenticado ou sem conta selecionada');
        return;
      }
      
      // Buscar dados da conta
      const accountRes = await fetch(`http://localhost:8080/account/${accountId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const accountData = await accountRes.json();
      
      // Buscar transações recentes
      const transactionsRes = await fetch(
        `http://localhost:8080/account/${accountId}/statement`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const transactionsData = await transactionsRes.json();
      
      // Calcular métricas
      const transactions = transactionsData.result?.transactions || [];
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const monthlyTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });
      
      const income = monthlyTransactions
        .filter(t => t.type === 'DEPOSIT')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = monthlyTransactions
        .filter(t => t.type === 'WITHDRAWAL' || t.type === 'TRANSFER')
        .reduce((sum, t) => sum + t.amount, 0);
      
      setState({
        balance: accountData.result?.balance || 0,
        monthlyIncome: income,
        monthlyExpenses: expenses,
        recentTransactions: transactions.slice(0, 5),
        isLoading: false,
      });
      
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };
  
  // ... resto do componente
};
```

#### **Renderização**

```tsx
return (
  <div className="container mx-auto px-4 py-8">
    {/* Header */}
    <header className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Olá, {user?.name || 'Usuário'}! 👋
      </h1>
      <p className="text-gray-600 mt-2">
        Bem-vindo ao seu dashboard financeiro
      </p>
    </header>
    
    {isLoading ? (
      <LoadingState />
    ) : (
      <>
        {/* Cards de Resumo */}
        <SummaryCards
          balance={state.balance}
          income={state.monthlyIncome}
          expenses={state.monthlyExpenses}
        />
        
        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Coluna Principal (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <RecentTransactions transactions={state.recentTransactions} />
            <SpendingChart transactions={state.recentTransactions} />
          </div>
          
          {/* Sidebar (1/3) */}
          <div className="space-y-6">
            <QuickActions />
            <SavingsGoal />
            <MonthlyInsights
              income={state.monthlyIncome}
              expenses={state.monthlyExpenses}
            />
          </div>
        </div>
      </>
    )}
  </div>
);
```

## 🎨 Componentes Visuais

### SummaryCards

Cards com métricas principais:

```tsx
interface SummaryCardsProps {
  balance: number;
  income: number;
  expenses: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ balance, income, expenses }) => {
  const savings = income - expenses;
  const savingsPercent = income > 0 ? ((savings / income) * 100).toFixed(1) : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Saldo Atual */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">Saldo Atual</p>
            <p className="text-3xl font-bold mt-2">
              R$ {balance.toFixed(2)}
            </p>
          </div>
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            💰
          </div>
        </div>
      </div>
      
      {/* Receitas do Mês */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Receitas do Mês</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              R$ {income.toFixed(2)}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-2xl">
            ↑
          </div>
        </div>
      </div>
      
      {/* Despesas do Mês */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Despesas do Mês</p>
            <p className="text-2xl font-bold text-red-600 mt-2">
              R$ {expenses.toFixed(2)}
            </p>
          </div>
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-2xl">
            ↓
          </div>
        </div>
      </div>
      
      {/* Economia do Mês */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Economia do Mês</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              R$ {savings.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {savingsPercent}% da receita
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl">
            💎
          </div>
        </div>
      </div>
    </div>
  );
};
```

### RecentTransactions

Lista de transações recentes:

```tsx
interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Transações Recentes
        </h2>
        <a
          href="/financeiro"
          className="text-green-600 hover:text-green-700 text-sm font-medium"
        >
          Ver todas →
        </a>
      </div>
      
      {transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhuma transação encontrada
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <TransactionIcon type={transaction.type} />
                <div>
                  <p className="font-medium text-gray-900">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-bold ${
                  transaction.type === 'DEPOSIT'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {transaction.type === 'DEPOSIT' ? '+' : '-'} R${' '}
                  {transaction.amount.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TransactionIcon: React.FC<{ type: string }> = ({ type }) => {
  const config = {
    DEPOSIT: { icon: '↑', bg: 'bg-green-100', color: 'text-green-600' },
    WITHDRAWAL: { icon: '↓', bg: 'bg-red-100', color: 'text-red-600' },
    TRANSFER: { icon: '→', bg: 'bg-blue-100', color: 'text-blue-600' },
  };
  
  const c = config[type] || config.DEPOSIT;
  
  return (
    <div className={`w-10 h-10 rounded-full ${c.bg} ${c.color} flex items-center justify-center text-xl`}>
      {c.icon}
    </div>
  );
};
```

### QuickActions

Botões de ação rápida:

```tsx
const QuickActions: React.FC = () => {
  const actions = [
    {
      label: 'Nova Transferência',
      icon: '💸',
      color: 'bg-blue-500',
      onClick: () => console.log('Transferência'),
    },
    {
      label: 'Depositar',
      icon: '➕',
      color: 'bg-green-500',
      onClick: () => console.log('Depósito'),
    },
    {
      label: 'Sacar',
      icon: '➖',
      color: 'bg-red-500',
      onClick: () => console.log('Saque'),
    },
    {
      label: 'Ver Extrato',
      icon: '📄',
      color: 'bg-gray-500',
      onClick: () => (window.location.href = '/financeiro'),
    },
  ];
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Ações Rápidas
      </h2>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`${action.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity`}
          >
            <div className="text-3xl mb-2">{action.icon}</div>
            <div className="text-sm font-medium">{action.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
```

### SavingsGoal

Meta de economia:

```tsx
const SavingsGoal: React.FC = () => {
  const [goal, setGoal] = useState(5000);
  const [current, setCurrent] = useState(3250);
  const progress = (current / goal) * 100;
  
  return (
    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
      <h2 className="text-lg font-bold mb-4">Meta de Economia</h2>
      
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span>Progresso</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        
        <div className="w-full bg-purple-400 bg-opacity-30 rounded-full h-3">
          <div
            className="bg-white rounded-full h-3 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-purple-100 text-xs">Atual</p>
          <p className="text-xl font-bold">R$ {current.toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p className="text-purple-100 text-xs">Meta</p>
          <p className="text-xl font-bold">R$ {goal.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-purple-400 border-opacity-30">
        <p className="text-purple-100 text-xs">
          Faltam R$ {(goal - current).toFixed(2)} para alcançar sua meta! 🎯
        </p>
      </div>
    </div>
  );
};
```

### MonthlyInsights

Insights do mês:

```tsx
interface MonthlyInsightsProps {
  income: number;
  expenses: number;
}

const MonthlyInsights: React.FC<MonthlyInsightsProps> = ({ income, expenses }) => {
  const savings = income - expenses;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;
  
  const insights = [
    {
      icon: '📊',
      text: `Você economizou ${savingsRate.toFixed(1)}% da sua receita este mês`,
      type: savingsRate > 20 ? 'positive' : 'warning',
    },
    {
      icon: '💡',
      text: savings > 0
        ? 'Continue assim! Suas finanças estão saudáveis.'
        : 'Atenção! Suas despesas estão maiores que receitas.',
      type: savings > 0 ? 'positive' : 'negative',
    },
    {
      icon: '🎯',
      text: `Meta recomendada: economizar ${(income * 0.2).toFixed(2)} por mês`,
      type: 'info',
    },
  ];
  
  const typeStyles = {
    positive: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    negative: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Insights do Mês
      </h2>
      
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${typeStyles[insight.type]}`}
          >
            <div className="flex items-start gap-2">
              <span className="text-xl">{insight.icon}</span>
              <p className="text-sm flex-1">{insight.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### SpendingChart

Gráfico de gastos (futuro com Chart.js):

```tsx
const SpendingChart: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  // Agrupar por categoria
  const categoryTotals = transactions
    .filter(t => t.type !== 'DEPOSIT')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
  
  const categories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  
  const maxValue = Math.max(...categories.map(([, v]) => v));
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Gastos por Categoria
      </h2>
      
      <div className="space-y-4">
        {categories.map(([category, amount]) => {
          const percentage = (amount / maxValue) * 100;
          
          return (
            <div key={category}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {category}
                </span>
                <span className="text-sm font-bold text-gray-900">
                  R$ {amount.toFixed(2)}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 rounded-full h-2 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

## 🔄 Integração com @bytebank/base

### Futura Integração Redux

```typescript
import { useAppSelector, useAuth, useAccount, useTransactions } from '@bytebank/base';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { selectedAccount, balance } = useAccount();
  const { transactions } = useTransactions();
  
  // Estado já gerenciado pelo Redux
  const monthlyIncome = useMemo(() => {
    return transactions
      .filter(t => isCurrentMonth(t.date) && t.type === 'DEPOSIT')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);
  
  // ... resto do componente
};
```

### Event Listeners

```typescript
import { on, ByteBankEvents } from '@bytebank/base';

useEffect(() => {
  // Atualizar quando houver nova transação
  const unsubscribe = on(ByteBankEvents.TRANSACTION_CREATED, () => {
    loadDashboardData();
  });
  
  return unsubscribe;
}, []);
```

## 🎯 Rotas Ativas

- `/` - Home (página inicial)
- `/dashboard` - Dashboard

## 🚀 Funcionalidades Futuras

### 1. Gráficos Interativos com Chart.js
### 2. Notificações e Alertas
### 3. Comparação com Meses Anteriores
### 4. Categorização Automática de Transações
### 5. Recomendações de Economia

## 🛠️ Comandos

```bash
npm install
npm run dev
npm run build
npm run preview
```

## 👥 Equipe

**FIAP Grupo 30 - Tech Challenge 2**
