// Exemple : src/components/UserProfile.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/features/user/userSlice';

const UserProfile = () => {
  const user = useSelector(selectUser);  // Utilisation du sélecteur pour obtenir l'utilisateur du store

  if (!user) {
    return <div>Please log in.</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p>Name: {user.firstName} {user.lastName}</p>
      <p>Email: {user.email}</p>
      <p>Profile Picture: <img src={user.photo} alt="profile" /></p>
    </div>
  );
};

export default UserProfile;
