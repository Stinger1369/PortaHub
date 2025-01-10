import './Header.css';
import { FaUser, FaUserPlus } from 'react-icons/fa';
import { useState } from 'react';
import Modal from '../ModalSign/Modal';
import Signup from '../Signup/Signup';

const Header = () => {
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);

  const openSignupModal = () => setSignupModalOpen(true);
  const closeSignupModal = () => setSignupModalOpen(false);

  return (
    <>
      <header className="header">
        {/* Logo */}
        <div className="logo">PortaHub</div>

        {/* Navigation avec icônes */}
        <nav className="nav-links">
          <div className="nav-icon" data-tooltip="Connexion">
            <FaUser />
          </div>
          <div
            className="nav-icon"
            data-tooltip="Inscription"
            onClick={openSignupModal}
          >
            <FaUserPlus />
          </div>
        </nav>
      </header>

      {/* Modal contenant le formulaire Signup */}
      <Modal isOpen={isSignupModalOpen} onClose={closeSignupModal}>
        <Signup />
      </Modal>
    </>
  );
};

export default Header;
