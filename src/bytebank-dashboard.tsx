// Single-spa entry for the dashboard microfrontend
import React from 'react';
import * as ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import App from './App.jsx';
import { createDomGetter } from '@bytebank/shared';

const lifecycles = singleSpaReact({
	React,
	ReactDOM,
	rootComponent: App,
	// Mount the dashboard inside the base app's main area so it appears between header and footer
	domElementGetter: createDomGetter('@bytebank/dashboard', 'mfe-dashboard-container'),
	errorBoundary(err, info, props) {
		console.error('❌ @bytebank/dashboard error:', err, info);
		return React.createElement('div', { style: { padding: 16, color: 'red' } }, 'Erro no módulo dashboard');
	},
});

export const { bootstrap, mount, unmount } = lifecycles;
