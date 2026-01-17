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
	import type {
		AccountState,
		AuthRequest,
		AuthState,
		CreateTransactionRequest,
		CreateUserRequest,
		TransactionFilters,
		TransactionState,
		User,
	} from "./src/model/types";

	// Tipo Store completo baseado em RootState (AuthSlice & TransactionSlice & AccountSlice)
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
		setFilters: (filters: Partial<TransactionFilters>) => void;
		clearFilters: () => void;
		setPage: (page: number) => void;

		// Account slice
		account: AccountState;
		fetchAccount: () => Promise<void>;
		selectAccount: (accountId: string) => void;
		updateBalance: (balance: number) => void;
		clearAccount: () => void;
	};

	const store: UseBoundStore<StoreApi<Store>>;
	export default store;
}
