import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import AppPage from './pages/AppPage';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<AppPage />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;