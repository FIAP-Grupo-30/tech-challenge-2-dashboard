import Dashboard from './components/Dashboard';

function App() {
  return (
    <>
      <bytebank-header
        logo-url="http://localhost:9001/logo-green.svg"
        logo-small-url="http://localhost:9001/logo-small.svg"
      />

      <main className="bg-[#e4e2e2] pt-10 pb-10 pl-4 pr-4">
        {/* suas rotas */}
        <div className="container mx-auto max-w-[1550px] bg-[#FFF] rounded-[12px] mx-auto p-12">              
          <Dashboard />
        </div>
      </main>

      <bytebank-footer 
        asset-base="http://localhost:9001"
        logo-url="logo-white.svg" 
      />
      
    </>
  );
}

export default App;
