import React from 'react';
import ReactDOM from 'react-dom';
// main routes
import AppRoutes from './routes';
import { Provider } from 'react-redux';
import store from './store';
ReactDOM.render(
    <Provider store={store}>
        <AppRoutes />
    </Provider>,
    document.getElementById('react-app')
)