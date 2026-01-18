import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import useStore from "@bytebank/root/bytebank-store";
import { useAuth } from "../hooks/useAuth";

interface Transaction {
	id: string;
	type: "Credit" | "Debit";
	value: number;
	date: string;
	category?: string;
}

const COLORS = [
	"#47A138",
	"#FF6B6B",
	"#4ECDC4",
	"#45B7D1",
	"#96CEB4",
	"#FFEAA7",
	"#DDA0DD",
	"#F39C12",
];

const Dashboard: React.FC = () => {
	console.log('🎯 [Dashboard] COMPONENTE MONTADO - INÍCIO');
	
	const { user, accountId, isAuthenticated } = useAuth();
	const [isHydrated, setIsHydrated] = useState(false);
	const [isLoadingData, setIsLoadingData] = useState(false);
	const [dataLoaded, setDataLoaded] = useState(false);
	
	console.log('🎯 [Dashboard] Estado inicial:', { 
		user, 
		accountId, 
		isAuthenticated,
		userName: user?.username 
	});
	
	// Acessar dados e ações da store
	const transactionsState = useStore((state) => state.transactions);
	const accountState = useStore((state) => state.account);
	const fetchAccount = useStore((state) => state.fetchAccount);
	const fetchTransactions = useStore((state) => state.fetchTransactions);
	
	console.log('🎯 [Dashboard] Store data:', {
		transactionsState,
		accountState,
		transactionsCount: transactionsState?.transactions?.length || 0
	});

	// Aguarda a hidratação do Zustand (persist)
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsHydrated(true);
		}, 100);
		return () => clearTimeout(timer);
	}, []);

	// Buscar dados ao montar - consolidado para evitar timing issues
	useEffect(() => {
		const loadData = async () => {
			if (!isAuthenticated || !isHydrated || isLoadingData || dataLoaded) return;
			
			setIsLoadingData(true);
			console.log('[Dashboard] Iniciando carregamento de dados...');
			
			try {
				// Sempre busca account primeiro para garantir selectedAccount
				if (!accountState?.selectedAccount) {
					console.log('[Dashboard] Carregando account...');
					await fetchAccount();
				}
			} catch (error) {
				console.error('[Dashboard] Erro ao carregar account:', error);
			} finally {
				setIsLoadingData(false);
			}
		};
		
		loadData();
	}, [isAuthenticated, isHydrated, accountState?.selectedAccount, fetchAccount, isLoadingData, dataLoaded]);

	// Carrega transactions quando selectedAccount estiver disponível
	useEffect(() => {
		const loadTransactions = async () => {
			const currentAccountId = accountState?.selectedAccount?.id;
			if (currentAccountId && isHydrated && !dataLoaded) {
				console.log('[Dashboard] Carregando transactions para accountId:', currentAccountId);
				try {
					await fetchTransactions(currentAccountId);
					setDataLoaded(true);
				} catch (error) {
					console.error('[Dashboard] Erro ao carregar transactions:', error);
				}
			}
		};
		loadTransactions();
	}, [accountState?.selectedAccount?.id, isHydrated, fetchTransactions, dataLoaded]);

	// Escutar eventos de transação criada
	useEffect(() => {
		const handleRefresh = () => {
			console.log('[Dashboard] Evento recebido, recarregando transações');
			if (accountId) {
				fetchTransactions(accountId);
			}
		};
		window.addEventListener("mfe:transaction-created", handleRefresh as any);
		return () =>
			window.removeEventListener("mfe:transaction-created", handleRefresh as any);
	}, [accountId, fetchTransactions]);

	// Usar transações da store
	const transactions = transactionsState?.transactions || [];
	const userName = user?.username || "Usuário";
	
	console.log('[Dashboard] Renderizando com:', {
		accountId,
		isAuthenticated,
		transactionsCount: transactions.length,
		transactions: transactions.slice(0, 3), // primeiras 3 para debug
		transactionsState
	});

	const summary = useMemo(() => {
		return transactions.reduce(
			(acc, t) => {
				if (t.value > 0) acc.income += t.value;
				else acc.expenses += Math.abs(t.value);
				acc.count++;
				acc.balance = acc.income - acc.expenses;
				return acc;
			},
			{ income: 0, expenses: 0, balance: 0, count: 0 },
		);
	}, [transactions]);

	const chartData = useMemo(() => {
		const months: Record<string, { income: number; expenses: number }> = {};
		const now = new Date();
		for (let i = 5; i >= 0; i--) {
			const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
			months[d.toLocaleDateString("pt-BR", { month: "short" })] = {
				income: 0,
				expenses: 0,
			};
		}
		transactions.forEach((t) => {
			const key = new Date(t.date).toLocaleDateString("pt-BR", {
				month: "short",
			});
			if (months[key]) {
				if (t.value > 0) months[key].income += t.value;
				else months[key].expenses += Math.abs(t.value);
			}
		});
		return Object.entries(months).map(([month, data]) => ({ month, ...data }));
	}, [transactions]);

	const categoryData = useMemo(() => {
		const cats: Record<string, number> = {};
		transactions
			.filter((t) => t.value < 0)
			.forEach((t) => {
				const cat = t.category || "outros";
				cats[cat] = (cats[cat] || 0) + Math.abs(t.value);
			});
		return Object.entries(cats)
			.map(([name, value]) => ({ name, value }))
			.sort((a, b) => b.value - a.value);
	}, [transactions]);

	const formatCurrency = (v: number) =>
		new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(v);
	// Aguarda hidratação antes de verificar
	if (!isHydrated) {
		return (
			<div className="dash:bg-gray-100 dash:flex dash:items-center dash:justify-center">
				<div className="dash:animate-spin dash:rounded-full dash:h-12 dash:w-12 dash:border-t-2 dash:border-b-2 dash:border-[#47A138]"></div>
			</div>
		);
	}
	// Loading state
	if (transactionsState?.isLoading || accountState?.isLoading) {
		return (
			<div className="dash:bg-gray-100 dash:flex dash:items-center dash:justify-center">
				<div className="dash:animate-spin dash:rounded-full dash:h-12 dash:w-12 dash:border-t-2 dash:border-b-2 dash:border-[#47A138]"></div>
			</div>
		);
	}

	// Não autenticado
	if (!isAuthenticated) {
		return (
			<div className="dash:bg-gray-100 dash:flex dash:items-center dash:justify-center dash:p-8">
				<div className="dash:text-center">
					<p className="dash:text-gray-600">Faça login para acessar o dashboard</p>
				</div>
			</div>
		);
	}

	return (
		<div>
			<main className="dash:mx-auto">
				{/* Saudação */}
				<div className="dash:mb-8">
					<h2 className="dash:text-2xl dash:font-semibold dash:text-black">
						Olá, {userName}! 👋
					</h2>
					<p className="dash:text-gray-600">Aqui está o resumo das suas finanças</p>
				</div>

				{/* Cards de resumo */}
				<div className="dash:grid dash:grid-cols-2 dash:lg:grid-cols-4 dash:gap-8 dash:mb-10">
					{[
						{
							label: "Receitas",
							value: summary.income,
							icon: "📈",
							color: "dash:text-green-600",
							bg: "dash:bg-green-50",
						},
						{
							label: "Despesas",
							value: summary.expenses,
							icon: "📉",
							color: "dash:text-red-600",
							bg: "dash:bg-red-50",
						},
						{
							label: "Saldo",
							value: summary.balance,
							icon: "💰",
							color: summary.balance >= 0 ? "dash:text-blue-600" : "dash:text-orange-600",
							bg: "dash:bg-blue-50",
						},
						{
							label: "Transações",
							value: summary.count,
							icon: "📊",
							color: "dash:text-purple-600",
							bg: "dash:bg-purple-50",
							isCurrency: false,
						},
					].map((card) => (
						<div
							key={card.label}
							className="dash:bg-white dash:rounded-[5px] dash:border dash:border-solid dash:border-[#ccc] dash:p-4 dash:shadow-sm"
						>
							<div className="dash:flex dash:items-center dash:gap-3">
								<div
									className={`dash:w-12 dash:h-12 ${card.bg} dash:rounded-lg dash:flex dash:items-center dash:justify-center dash:text-xl`}
								>
									{card.icon}
								</div>
								<div>
									<p className="dash:text-sm dash:text-gray-500">{card.label}</p>
									<p className={`dash:text-xl dash:font-semibold ${card.color}`}>
										{card.isCurrency === false
											? card.value
											: formatCurrency(card.value)}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Gráficos */}
				<div className="dash:grid dash:lg:grid-cols-2 dash:gap-8 dash:mb-10">
					{/* Evolução */}
					<div className="dash:rounded-[5px] dash:border dash:border-solid dash:border-[#ccc] dash:p-6 dash:shadow-sm">
						<h3 className="dash:text-[20px] dash:font-semibold dash:text-black dash:mb-8 dash:text-center">
							Evolução Financeira
						</h3>
						<ResponsiveContainer width="100%" height={300}>
							<AreaChart data={chartData}>
								<defs>
									<linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor="#47A138" stopOpacity={0.3} />
										<stop offset="95%" stopColor="#47A138" stopOpacity={0} />
									</linearGradient>
									<linearGradient
										id="colorExpenses"
										x1="0"
										y1="0"
										x2="0"
										y2="1"
									>
										<stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
										<stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
								<XAxis
									dataKey="month"
									tick={{ fontSize: 12 }}
									stroke="#94a3b8"
								/>
								<YAxis
									tick={{ fontSize: 12 }}
									stroke="#94a3b8"
									tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
								/>
								<Tooltip formatter={(value: number) => formatCurrency(value)} />
								<Legend />
								<Area
									type="monotone"
									dataKey="income"
									name="Receitas"
									stroke="#47A138"
									fill="url(#colorIncome)"
									strokeWidth={2}
								/>
								<Area
									type="monotone"
									dataKey="expenses"
									name="Despesas"
									stroke="#ef4444"
									fill="url(#colorExpenses)"
									strokeWidth={2}
								/>
							</AreaChart>
						</ResponsiveContainer>
					</div>

					{/* Categorias */}
					<div className="dash:rounded-[5px] dash:border dash:border-solid dash:border-[#ccc] dash:p-6 dash:shadow-sm">
						<h3 className="dash:text-[20px] dash:font-semibold dash:text-black dash:mb-8 dash:text-center">
							Despesas por Categoria
						</h3>
						<div className="dash:flex dash:flex-col dash:lg:flex-row dash:items-center dash:gap-6">
							<div className="dash:w-full dash:lg:w-1/2">
								<ResponsiveContainer width="100%" height={250}>
									<PieChart>
										<Pie
											data={categoryData}
											cx="50%"
											cy="50%"
											innerRadius={60}
											outerRadius={100}
											paddingAngle={2}
											dataKey="value"
										>
											{categoryData.map((item, index) => (
												<Cell
													key={item.name}
													fill={COLORS[index % COLORS.length]}
												/>
											))}
										</Pie>
										<Tooltip
											formatter={(value: number) => formatCurrency(value)}
										/>
									</PieChart>
								</ResponsiveContainer>
							</div>
							<div className="dash:w-full dash:lg:w-1/2 dash:space-y-2">
								{categoryData.slice(0, 5).map((item, i) => (
									<div key={item.name} className="dash:flex dash:items-center dash:gap-3">
										<div
											className="dash:w-3 dash:h-3 dash:rounded-full"
											style={{ backgroundColor: COLORS[i % COLORS.length] }}
										/>
										<span className="dash:flex-1 dash:text-sm dash:text-gray-600 dash:capitalize">
											{item.name}
										</span>
										<span className="dash:text-sm dash:font-medium">
											{formatCurrency(item.value)}
										</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Comparativo mensal */}
				<div className="dash:rounded-[5px] dash:border dash:border-solid dash:border-[#ccc] dash:p-6 dash:shadow-sm">
					<h3 className="dash:text-[20px] dash:font-semibold dash:text-black dash:mb-8 dash:text-center">
						Comparativo Mensal
					</h3>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={chartData}>
							<CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
							<XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
							<YAxis
								tick={{ fontSize: 12 }}
								stroke="#94a3b8"
								tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
							/>
							<Tooltip formatter={(value: number) => formatCurrency(value)} />
							<Legend />
							<Bar
								dataKey="income"
								name="Receitas"
								fill="#47A138"
								radius={[4, 4, 0, 0]}
							/>
							<Bar
								dataKey="expenses"
								name="Despesas"
								fill="#ef4444"
								radius={[4, 4, 0, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</main>
		</div>
	);
};

export default Dashboard;
