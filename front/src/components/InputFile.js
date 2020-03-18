import React from 'react';
import { toast } from 'react-toastify';
import { Input } from 'reactstrap';

const InputFile = (props) => {
  const maxSelectFile = (event) => {
    let files = event.target.files; // create file object
    if (files.length > 1) { 
      const msg = 'Only 1 pdf can be uploaded at a time';
      event.target.value = null; // discard selected file
      toast.error(msg);
      return false;
    }
    return true;
  }
  
  const checkMimeType = (event) => {
    let files = event.target.files;
    let err = '';
    const types = ['application/pdf'];
    for(let x = 0; x<files.length; x++) {
      if (types.every(type => files[x].type !== type)) {
        err += files[x].type + ' is not a supported format\n';
      }
    };
    
    for(var z = 0; z<err.length; z++) {
      event.target.value = null;
      toast.error(err[z]);
    }
    return true; 
  }
  
  const checkFileSize = (event) => {
    let files = event.target.files;
    let size = 20000000;
    let err = ''; 
    for(let x = 0; x<files.length; x++) {
      if (files[x].size > size) {
        err += files[x].type + 'is too large, please pick a smaller file\n';
      }
    }
    for(let z = 0; z<err.length; z++) {
      toast.error(err[z]);
      event.target.value = null;
    }
    return true; 
  }
  
  const onChangeHandler = async (event) => {
    console.log(event.target.files[0]);
    if (maxSelectFile(event) && checkMimeType(event) && checkFileSize(event)) {
      props.selectedFile(event.target.files[0]);
    }
  }
  
  return (
    <Input className="mt15" type="file" name="file" onChange={onChangeHandler}/>
    );
  }
  
  export default InputFile;