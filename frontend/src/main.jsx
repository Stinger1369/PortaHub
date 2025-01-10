import ReactDOM from 'react-dom/client'; // Import correct de createRoot
import { Provider } from 'react-redux';
import { store } from './store'; // Importer le store Redux
import App from './App';
// import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
