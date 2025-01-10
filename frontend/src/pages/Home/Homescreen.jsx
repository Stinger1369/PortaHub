// src/pages/Home/Homescreen.jsx

import './Homescreen.css'; // Optionnel, si vous souhaitez ajouter du style

const Homescreen = () => {
  return (
    <div className="homescreen-container">
      <h1>Bienvenue sur l'écran d'accueil !</h1>
      <p>Ceci est la page d'accueil de votre application.</p>
      <button onClick={() => alert('Bienvenue !')}>
        Cliquez ici
      </button>
    </div>
  );
};

export default Homescreen;
