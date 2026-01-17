export interface User {
	id: string;
	username: string;
	email: string;
}

export interface CreateUserRequest {
	username: string;
	email: string;
	password: string;
}

export interface AuthRequest {
	email: string;
	password: string;
}

export interface AuthResponse {
	message: string;
	result: { token: string };
}

export interface Account {
	id: string;
	type: "Debit" | "Credit";
	userId: string;
}

export interface Card {
	id: string;
	accountId: string;
	type: "Debit" | "Credit";
	is_blocked: boolean;
	number: string;
	dueDate: string;
	functions: "Debit" | "Credit";
	cvc: string;
	paymentDate: string | null;
	name: string;
}

export enum TipoTransacao {
	SAQUE = "Saque",
	PIX = "PIX",
	TED = "TED",
	DEPOSITO = "Deposito",
	TRANSFERENCIA = "Transferencia",
}

export type TransactionType = "Credit" | "Debit";

export interface Transaction {
	id: string;
	accountId: string;
	type: TransactionType;
	value: number;
	date: string;
	from?: string;
	to?: string;
	anexo?: string;
	category?: TransactionCategory;
	description?: string;
}

export interface CreateTransactionRequest {
	accountId: string;
	type: TransactionType;
	value: number;
	from?: string;
	to?: string;
	anexo?: string;
}

export type TransactionCategory =
	| "alimentacao"
	| "transporte"
	| "moradia"
	| "saude"
	| "educacao"
	| "lazer"
	| "compras"
	| "servicos"
	| "investimentos"
	| "salario"
	| "freelance"
	| "outros";

export const CATEGORY_CONFIG: Record<
	TransactionCategory,
	{ label: string; icon: string; color: string }
> = {
	alimentacao: { label: "Alimentação", icon: "🍽️", color: "#FF6B6B" },
	transporte: { label: "Transporte", icon: "🚗", color: "#4ECDC4" },
	moradia: { label: "Moradia", icon: "🏠", color: "#45B7D1" },
	saude: { label: "Saúde", icon: "💊", color: "#96CEB4" },
	educacao: { label: "Educação", icon: "📚", color: "#FFEAA7" },
	lazer: { label: "Lazer", icon: "🎮", color: "#DDA0DD" },
	compras: { label: "Compras", icon: "🛒", color: "#F39C12" },
	servicos: { label: "Serviços", icon: "🔧", color: "#9B59B6" },
	investimentos: { label: "Investimentos", icon: "📈", color: "#27AE60" },
	salario: { label: "Salário", icon: "💰", color: "#2ECC71" },
	freelance: { label: "Freelance", icon: "💼", color: "#3498DB" },
	outros: { label: "Outros", icon: "📌", color: "#95A5A6" },
};

export interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

export interface AccountState {
	accounts: Account[];
	cards: Card[];
	selectedAccount: Account | null;
	balance: number;
	isLoading: boolean;
	error: string | null;
}

export interface TransactionFilters {
	type: TransactionType | "all";
	category: TransactionCategory | "all";
	startDate: string | null;
	endDate: string | null;
	searchTerm: string;
}

export interface TransactionState {
	transactions: Transaction[];
	filteredTransactions: Transaction[];
	isLoading: boolean;
	error: string | null;
	filters: TransactionFilters;
	pagination: {
		page: number;
		pageSize: number;
		totalItems: number;
		totalPages: number;
	};
}
