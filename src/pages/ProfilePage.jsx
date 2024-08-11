import React from 'react';
import Profile from '../components/Profile';
import './ProfilePage.css'; // Importa los estilos personalizados 

const ProfilePage = () => {
  return (
    <>
      {/* ----- */}
      <div className="profile-section">
        <Profile />
      </div>
    </>
  );
};

export default ProfilePage;
