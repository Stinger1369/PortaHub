import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, selectUser } from '../../store/features/user/userSlice';
import { useNavigate } from 'react-router-dom'; // Import du hook useNavigate
import Modal from '../ModalSign/Modal'; // Assurez-vous d'importer le modal
import './Signup.css';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialisation du hook useNavigate
  const userState = useSelector(selectUser); // Récupère l'état utilisateur depuis Redux
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Pour gérer l'état du modal

  const handleSubmit = (e) => {
    e.preventDefault();

    // Vérification des mots de passe
    if (password !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    // Vérification du numéro de téléphone (format basique)
    const phoneRegex = /^(?:\+33|0)[6-7]\d{8}$/; // Format français
    if (!phoneRegex.test(phone)) {
      setErrorMessage('Le numéro de téléphone est invalide.');
      return;
    }

    const userData = {
      email,
      password,
      firstName,
      lastName,
      phone,
    };

    // Dispatch du thunk pour l'inscription
    dispatch(signupUser(userData))
      .unwrap() // Permet de capturer l'état de réussite ou d'échec
      .then(() => {
        setErrorMessage(''); // Réinitialise les erreurs en cas de succès
        setIsModalOpen(true); // Ouvre le modal de confirmation
      })
      .catch((error) => {
        setErrorMessage(error); // Affiche l'erreur en cas d'échec
      });
  };

  // Fonction pour fermer le modal et rediriger
  const handleModalClose = () => {
    setIsModalOpen(false);
    // Ajout d'un délai pour fermer le modal avant la redirection
    setTimeout(() => {
      navigate('/confirmation'); // Redirige vers la page de confirmation après fermeture du modal
    }, 500); // Délais de 500ms, ajustez si nécessaire
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Prénom"
          required
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Nom"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Téléphone (06 ou 07...)"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirmer le mot de passe"
          required
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {userState.status === 'loading' && <p>Inscription en cours...</p>}
        <button type="submit" disabled={userState.status === 'loading'}>
          S’inscrire
        </button>
      </form>
      {userState.status === 'success' && <p className="success-message">Inscription réussie !</p>}

      {/* Modal de confirmation */}
      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <h3>Inscription réussie !</h3>
        <p>Vous allez être redirigé vers la page de validation de votre compte.</p>
        <button onClick={handleModalClose}>Fermer</button>
      </Modal>
    </div>
  );
};

export default Signup;
