import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

const ModalDuplicated = (props) => {
  const {
    onClose
  } = props;
  
  const [modal, setModal] = useState(true);
  
  const toggle = () => {
    onClose();
    setModal(!modal);
  }
  
  return (
    <div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Duplicates</ModalHeader>
        <ModalBody>
          {props.children}
        </ModalBody>
      </Modal>
    </div>
  );
}
  
export default ModalDuplicated;