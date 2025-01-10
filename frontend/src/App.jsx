import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homescreen from './pages/Home/Homescreen'; // Votre écran d'accueil
import Header from './components/header/Header';
import Signup from './components/Signup/Signup';
import UserProfile from './components/UserProfile';
import ConfirmationScreen from './components/ConfirmationScreen/ConfirmationScreen';

const App = () => {
  return (
    <Router
      future={{
        v7_startTransition: true, // Active la gestion des transitions pour v7
        v7_relativeSplatPath: true, // Change la gestion des chemins relatifs pour v7
      }}
    >
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Homescreen />} /> {/* Définir le chemin par défaut */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/confirmation" element={<ConfirmationScreen />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
