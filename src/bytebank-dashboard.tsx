import React from 'react';
import * as ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import App from './App';
import './globals.css';

console.log('🟢 @bytebank/dashboard - Módulo carregado com sucesso!');

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: App,
  errorBoundary(err: Error) {
    console.error('❌ @bytebank/dashboard error:', err);
    return <div className="text-red-500 p-4">Erro no módulo dashboard</div>;
  },
});

console.log('🟢 @bytebank/dashboard - Lifecycles configurados');

export const { bootstrap, mount, unmount } = lifecycles;
