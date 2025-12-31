import React from 'react';

const App: React.FC = () => {
  return (
    <div style={{ 
      minHeight: 'calc(100vh - 64px)', 
      backgroundColor: '#f5f5f5',
      padding: '48px 24px'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '48px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#47A138',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '40px'
          }}>
            📊
          </div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            color: '#000',
            marginBottom: '16px'
          }}>
            Hello World - Dashboard
          </h1>
          <p style={{ 
            fontSize: '1.125rem', 
            color: '#666',
            marginBottom: '32px'
          }}>
            Micro-frontend Dashboard carregado com sucesso! 🎉
          </p>
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '2px dashed #47A138',
            borderRadius: '12px',
            padding: '32px',
            marginTop: '24px'
          }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#166534',
              marginBottom: '12px'
            }}>
              📋 Área de Desenvolvimento
            </h2>
            <p style={{ color: '#15803d', marginBottom: '16px' }}>
              Aqui devem ficar os <strong>Dashboards</strong> e <strong>Gráficos</strong>:
            </p>
            <ul style={{ 
              textAlign: 'left', 
              color: '#166534',
              maxWidth: '400px',
              margin: '0 auto',
              lineHeight: '2'
            }}>
              <li>📈 Gráficos de receitas e despesas</li>
              <li>📊 Resumo financeiro</li>
              <li>🎯 Metas e objetivos</li>
              <li>📉 Análise de gastos por categoria</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
