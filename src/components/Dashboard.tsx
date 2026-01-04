import React, { useState, useEffect, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

interface Transaction {
  id: string;
  type: 'Credit' | 'Debit';
  value: number;
  date: string;
  category?: string;
}

const COLORS = ['#47A138', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#F39C12'];

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userName, setUserName] = useState('Usuário');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('bytebank_token');
        if (!token) { setIsLoading(false); return; }

        // Decode username from token
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUserName(payload.username || 'Usuário');
        } catch {}

        const accRes = await fetch('http://localhost:3000/account', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const accData = await accRes.json();
        const accId = accData.result?.account?.[0]?.id;

        if (accId) {
          const stmtRes = await fetch(`http://localhost:3000/account/${accId}/statement`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const stmtData = await stmtRes.json();
          setTransactions(stmtData.result?.transactions || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    const handleRefresh = () => fetchData();
    window.addEventListener('bytebank-event', handleRefresh as any);
    return () => window.removeEventListener('bytebank-event', handleRefresh as any);
  }, []);

  const summary = useMemo(() => {
    return transactions.reduce((acc, t) => {
      if (t.value > 0) acc.income += t.value;
      else acc.expenses += Math.abs(t.value);
      acc.count++;
      acc.balance = acc.income - acc.expenses;
      return acc;
    }, { income: 0, expenses: 0, balance: 0, count: 0 });
  }, [transactions]);

  const chartData = useMemo(() => {
    const months: Record<string, { income: number; expenses: number }> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months[d.toLocaleDateString('pt-BR', { month: 'short' })] = { income: 0, expenses: 0 };
    }
    transactions.forEach((t) => {
      const key = new Date(t.date).toLocaleDateString('pt-BR', { month: 'short' });
      if (months[key]) {
        if (t.value > 0) months[key].income += t.value;
        else months[key].expenses += Math.abs(t.value);
      }
    });
    return Object.entries(months).map(([month, data]) => ({ month, ...data }));
  }, [transactions]);

  const categoryData = useMemo(() => {
    const cats: Record<string, number> = {};
    transactions.filter((t) => t.value < 0).forEach((t) => {
      const cat = t.category || 'outros';
      cats[cat] = (cats[cat] || 0) + Math.abs(t.value);
    });
    return Object.entries(cats).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const formatCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#47A138]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="mx-auto">
        {/* Saudação */}
        <div className='mb-8'>
          <h2 className="text-2xl font-semibold text-black">Olá, {userName}! 👋</h2>
          <p className="text-gray-600">Aqui está o resumo das suas finanças</p>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {[
            { label: 'Receitas', value: summary.income, icon: '📈', color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Despesas', value: summary.expenses, icon: '📉', color: 'text-red-600', bg: 'bg-red-50' },
            { label: 'Saldo', value: summary.balance, icon: '💰', color: summary.balance >= 0 ? 'text-blue-600' : 'text-orange-600', bg: 'bg-blue-50' },
            { label: 'Transações', value: summary.count, icon: '📊', color: 'text-purple-600', bg: 'bg-purple-50', isCurrency: false },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-[5px] border border-solid border-[#ccc] p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${card.bg} rounded-lg flex items-center justify-center text-xl`}>{card.icon}</div>
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className={`text-xl font-semibold ${card.color}`}>
                    {card.isCurrency === false ? card.value : formatCurrency(card.value)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gráficos */}
        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          {/* Evolução */}
          <div className="rounded-[5px] border border-solid border-[#ccc] p-6">
            <h3 className="text-[20px] font-semibold text-black mb-8">Evolução Financeira</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#47A138" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#47A138" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Area type="monotone" dataKey="income" name="Receitas" stroke="#47A138" fill="url(#colorIncome)" strokeWidth={2} />
                <Area type="monotone" dataKey="expenses" name="Despesas" stroke="#ef4444" fill="url(#colorExpenses)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Categorias */}
          <div className="rounded-[5px] border border-solid border-[#ccc] p-6">
            <h3 className="text-[20px] font-semibold text-black mb-8">Despesas por Categoria</h3>
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="w-full lg:w-1/2">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                      {categoryData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full lg:w-1/2 space-y-2">
                {categoryData.slice(0, 5).map((item, i) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="flex-1 text-sm text-gray-600 capitalize">{item.name}</span>
                    <span className="text-sm font-medium">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comparativo mensal */}
        <div className="rounded-[5px] border border-solid border-[#ccc] p-6">
          <h3 className="text-[20px] font-semibold text-black mb-8">Comparativo Mensal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="income" name="Receitas" fill="#47A138" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
