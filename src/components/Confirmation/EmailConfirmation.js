// import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
 
const EmailConfirmation = ({ showModal, hideModal, confirmModal, id, message }) => {
  return (
      <Modal show={showModal} onHide={hideModal}>
      <Modal.Header>
        <Modal.Title>Notify Client ?</Modal.Title>
      </Modal.Header>
      <Modal.Body><div className="alert alert-warning">{message}</div></Modal.Body>
      <Modal.Footer>
        <Button variant="default" onClick={hideModal}>
          No
        </Button>
        <Button variant="success" onClick={() => confirmModal(id) }>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
 
export default EmailConfirmation;