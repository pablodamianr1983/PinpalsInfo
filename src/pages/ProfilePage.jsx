import React from 'react';
import Profile from '../components/Profile';
import './ProfilePage.css'; // Importa los estilos personalizados (aunque ahora esté vacío)

const ProfilePage = () => {
  return (
    <>
      {/* Si agregas más contenido, asegúrate de usar divs separados */}
      <div className="profile-section">
        <Profile />
      </div>
    </>
  );
};

export default ProfilePage;
