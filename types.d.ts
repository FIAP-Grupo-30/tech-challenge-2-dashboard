/// <reference types="react" />
/// <reference types="zustand" />

declare module "@bytebank/base/bytebank-base" {
	import type { ComponentType } from "react";
	const BaseApp: ComponentType;
	export default BaseApp;
}

declare module "@bytebank/financeiro/bytebank-financeiro" {
	import type { ComponentType } from "react";
	const FinanceiroApp: ComponentType;
	export default FinanceiroApp;
}

declare module "@bytebank/root/bytebank-store" {
	import type { StoreApi, UseBoundStore } from "zustand";

	export interface User {
		id: string;
		username: string;
		email: string;
	}

	export interface Account {
		id: string;
		type: "Debit" | "Credit";
		userId: string;
	}

	export interface Transaction {
		id: string;
		accountId: string;
		type: "Credit" | "Debit";
		value: number;
		date: string;
		from?: string;
		to?: string;
		anexo?: string;
		category?: string;
		description?: string;
	}

	export interface AuthState {
		user: User | null;
		token: string | null;
		isAuthenticated: boolean;
		isLoading: boolean;
		error: string | null;
	}

	export interface AccountState {
		accounts: Account[];
		selectedAccount: Account | null;
		balance: number;
		isLoading: boolean;
		error: string | null;
	}

	export interface TransactionState {
		transactions: Transaction[];
		filteredTransactions: Transaction[];
		isLoading: boolean;
		error: string | null;
		filters: any;
		pagination: {
			page: number;
			pageSize: number;
			totalItems: number;
			totalPages: number;
		};
	}

	export interface CreateTransactionRequest {
		accountId: string;
		type: "Credit" | "Debit";
		value: number;
		from?: string;
		to?: string;
		anexo?: string;
	}

	export interface AuthRequest {
		email: string;
		password: string;
	}

	export interface CreateUserRequest {
		username: string;
		email: string;
		password: string;
	}

	export type Store = {
		// Auth slice
		auth: AuthState;
		login: (credentials: AuthRequest) => Promise<void>;
		register: (userData: CreateUserRequest) => Promise<void>;
		logout: () => Promise<void>;
		checkAuth: () => Promise<void>;
		clearError: () => void;
		setUser: (user: User | null) => void;

		// Transaction slice
		transactions: TransactionState;
		fetchTransactions: (accountId: string) => Promise<void>;
		createTransaction: (data: CreateTransactionRequest) => Promise<void>;
		setFilters: (filters: any) => void;
		clearFilters: () => void;
		setPage: (page: number) => void;

		// Account slice
		account: AccountState;
		fetchAccount: () => Promise<void>;
		selectAccount: (account: Account) => void;
		clearAccount: () => void;
	};

	const useStore: UseBoundStore<StoreApi<Store>>;
	export default useStore;
}
		selectAccount: (accountId: string) => void;
		updateBalance: (balance: number) => void;
		clearAccount: () => void;
	};

	const store: UseBoundStore<StoreApi<Store>>;
	export default store;
}
