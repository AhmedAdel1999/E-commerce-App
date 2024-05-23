import React from 'react';
import ReactDOM from 'react-dom';
import { persistStore } from 'reduxjs-toolkit-persist';
import { ToastProvider } from 'react-toast-notifications';
import { PersistGate } from 'reduxjs-toolkit-persist/es/integration/react';
import { store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import LandingPage from './pages/landingPage/landingPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const LazyApp = React.lazy(()=>import("./App"))

let persistor = persistStore(store);
ReactDOM.render(
  <React.StrictMode>
    <ToastProvider placement="top-right">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <React.Suspense fallback={<LandingPage />}>
            <LazyApp />
          </React.Suspense>
        </PersistGate>
      </Provider>
    </ToastProvider> 
  </React.StrictMode>,
  document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
