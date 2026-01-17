import useStore from "@bytebank/root/bytebank-store";
import Dashboard from "./components/Dashboard";

function App() {
	const { count, inc } = useStore();

	return (
		<main className="bg-[#e4e2e2] pt-10 pb-10 pl-4 pr-4">
			<div>
				<span>{count}</span>
				<button type="button" onClick={inc}>
					one up
				</button>
			</div>

			<div className="container mx-auto max-w-[1550px] bg-[#FFF] rounded-[12px] mx-auto p-12">
				<Dashboard />
			</div>
		</main>
	);
}

export default App;
