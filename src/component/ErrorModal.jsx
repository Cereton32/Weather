import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

const ModalContent = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  text-align: center;
`;

Modal.setAppElement('#root');

const ErrorModal = ({ isOpen, onRequestClose, errorMessage }) => (
  <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
    <ModalContent>
      <h2>Error</h2>
      <p>{errorMessage}</p>
      <button onClick={onRequestClose}>Close</button>
    </ModalContent>
  </Modal>
);

export default ErrorModal;
