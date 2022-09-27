import { Route, Routes } from 'react-router-dom';
import './styles/App.css';
import Home from './pages/Home';
import NotFound from './pages/NotFound.jsx';
import { GlobalContext } from './contexts/GlobalContext';
function App() {
  return (
    <div className="App">
      <GlobalContext.Provider value={{}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </GlobalContext.Provider>
    </div>
  );
}

export default App;
