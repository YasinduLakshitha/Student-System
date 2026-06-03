import { Provider } from 'react-redux';
import { store } from './app/store';
import Router from './app/router';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
}

export default App;
