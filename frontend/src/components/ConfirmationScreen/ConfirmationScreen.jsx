import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { validateAccount } from '../../store/features/user/userSlice';
import './ConfirmationScreen.css';

const ConfirmationScreen = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [validationCode, setValidationCode] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(validateAccount({ email, validationCode }))
      .unwrap()
      .then((res) => {
        setMessage('Votre compte a été validé avec succès !');
      })
      .catch((err) => {
        setMessage(err);
      });
  };

  return (
    <div className="confirmation-container">
      <h2>Validation du compte</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre email"
          required
        />
        <input
          type="text"
          value={validationCode}
          onChange={(e) => setValidationCode(e.target.value)}
          placeholder="Code de validation"
          required
        />
        <button type="submit">Valider</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ConfirmationScreen;
