import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const ModalPdf = (props) => {
  const {
    onClose
  } = props;
  
  const [modal, setModal] = useState(true);
  
  const toggle = () => {
    onClose();
    setModal(!modal);
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(props.children);
  }
  
  return (
    <div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Pages</ModalHeader>
        <ModalBody>
          {props.children}
        </ModalBody>
        <ModalFooter>
          <Button onClick={copyToClipboard}>Copy To Clipboard</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
  
export default ModalPdf;