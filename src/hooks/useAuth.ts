import useStore from "@bytebank/root/bytebank-store";

interface AuthState {
	token: string | null;
	user: {
		id: string;
		username: string;
		email: string;
	} | null;
	accountId: string | null;
	isAuthenticated: boolean;
}

/**
 * Hook para acessar informações de autenticação da store Zustand global
 * compartilhada entre os microfrontends via module federation
 */
export function useAuth(): AuthState {
	const auth = useStore((state) => state.auth);
	const account = useStore((state) => state.account);

	// Obtém accountId do selectedAccount (não do user.id que é o ID do usuário)
	const accountId = account?.selectedAccount?.id || null;

	return {
		token: auth?.token || null,
		user: auth?.user || null,
		accountId,
		isAuthenticated: auth?.isAuthenticated || false,
	};
}
