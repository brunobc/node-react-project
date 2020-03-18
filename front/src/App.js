import React, { useState, useEffect } from 'react';

import {
  Button,
  Container,
  Input,
  Progress,
  Table,
  Label
} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';

import ModalPdf from './components/ModalPdf';
import ModalDuplicated from './components/ModalDuplicated';

import userService from './services/user.service';
import uploadService from './services/upload.service';
import TableRow from './components/TableRow';
import InputFile from './components/InputFile';

function App() {
  const [ users, setUsers ] = useState( null);
  const [ selectedFile, setSelectedFile ] = useState(null);
  const [ loaded, setLoaded ] = useState(0);
  const [ intervals, setIntervals ] = useState(null);
  const [ user, setUser ] = useState({id: '', name: '', lastName: ''});
  const [ isEditing, setIsEditing ] = useState(false);
  const [ hasDuplicate, setHasDuplicate ] = useState(false);
  const [ duplicates, setDuplicates ] = useState([]);

  useEffect(() => {
    if (!users) {
      getUsers();
    }
  })

  const getUsers = async () => {
    let res = await userService.getAll();
    setUsers(res);
  }

  const countDuplicated = names => names.reduce((prev, curr) => {
    (prev[`${curr.name}${curr.lastName}`] = prev[`${curr.name}${curr.lastName}`] || []).push(curr)
    return prev;
  }, {});

  const uploadPdf = async () => {
    const data = new FormData();
    data.append('file', selectedFile);
    try {
      let res = await uploadService.upload(data, {
        onUploadProgress: ProgressEvent => {
          setLoaded(ProgressEvent.loaded / ProgressEvent.total * 100);
        }
      });
      console.log(res);
      setUsers(res.users);
      toast.success('upload success');
      const duplicatedsTotal = countDuplicated(res.users);
      const duplicatedsValue = Object.keys(duplicatedsTotal).filter((value) => duplicatedsTotal[value].length > 1);

      if (duplicatedsTotal[duplicatedsValue] && duplicatedsTotal[duplicatedsValue].length > 1) {
        setHasDuplicate(true);
        setDuplicates(duplicatedsTotal[duplicatedsValue]);
      }
    } catch (e) {
      toast.error('upload fail');
      console.log(selectedFile)
    }
  }

  const pagesToPrint = () => {
    const usersSelected = users.filter((userSelected) => userSelected.checked);
    let numPages = usersSelected.reduce((prev, curr) => {
      prev.push(curr.page);
      return prev;
    }, []);
    const intervals = [];
    let start = numPages[0];
    let end = '';
    for (let i = 0; i < numPages.length; i++) {
      const page = numPages[i];
      end = page;
      if (intervals.length === 0) {
        intervals.push({ start, end });
      }
      else if (intervals[intervals.length - 1].end + 1 === end) {
        intervals[intervals.length - 1].end = end;
      }
      else {
        start = end;
        intervals.push({ start, end: start });
      }
    }
  
    const intervalsToPrintPdf = intervals.map((i_1) => {
      if (i_1.start === i_1.end) {
        return `${i_1.start}`;
      }
      return `${i_1.start} - ${i_1.end}`;
    });
    setIntervals(intervalsToPrintPdf.join(', '));
  }

  const addEmployee = async () => {
    let res = await userService.add(user.name, user.lastName);
    setUsers([...users, res.user]);
    setUser({id: '', name: '', lastName: ''});
  }
  
  const selectEmployeeToEdit = (user) => {
    console.log(user);
    setUser({ id: user.id, name: user.name, lastName: user.lastName})
    setIsEditing(true);
  }

  const editEmployee = async () => {
    let res = await userService.edit(user.name, user.lastName, user.id);
    setUser({id: '', name: '', lastName: ''});
    setIsEditing(false);
    let newUsers = [...users];
    let userFind = users.find((u) => u.id === user.id);
    userFind.name = user.name;
    userFind.lastName = user.lastName;
    setUsers(newUsers);
  }

  const updateUser = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value
    })
  }

  const deleteEmployee = async () => {
    let res = await userService.delete(user.id);
    if (!res.error) {
      setUsers(users.filter(u => u.id !== user.id));
      setUser({id: '', name: '', lastName: ''});
      setIsEditing(false);
    }
  }

  return (
    <Container>
      <div className="form-group">
        <ToastContainer />
      </div>

      <InputFile selectedFile={setSelectedFile}/>
      <Progress className="mt15" max="100" color="success" value={loaded} >{Math.round(loaded, 2) }%</Progress>
      <Button type="button" className="btn btn-success btn-block mt15" onClick={uploadPdf}>Upload</Button>

      <h5 className="mt15">Fortaleza employees: {users ? (users.length) : ''}</h5>
      <div className="scroll-table mt15">
        <Table dark>
        <thead>
          <tr>
            <th>Print</th>
            <th>Name</th>
            <th>Last Name</th>
            <th>Page</th>
            <th></th>
          </tr>
        </thead>
          <tbody>
            {(users && users.length > 0) ? (
              users.map(userList => {
                const id = `${userList.id}${userList.page || ''}`;
                return <TableRow user={userList} key={id} edit={selectEmployeeToEdit}/>
              })
              ) : (<tr><td>No users found</td></tr>)}
          </tbody>
        </Table>
      </div>

      <Button type="button" className="btn btn-success btn-block mt15" onClick={pagesToPrint}>Pages to print</Button>
      
      {intervals && <ModalPdf onClose={() => setIntervals(null)}>{intervals}</ModalPdf>}
      {
        hasDuplicate &&
        <ModalDuplicated onClose={() => setHasDuplicate(false)}>
          <h6>{ duplicates[0] ? `${duplicates[0].name} ${duplicates[0].lastName}` : ''}</h6>
          {duplicates.map((employee) => <div key={`${employee.id}${employee.page}`}>{employee.nameComplete} (page {employee.page})</div>)}
        </ModalDuplicated>
      }

      <div className="mt15">
        <Label>Name</Label>
        <Input type="text" value={user.name} name="name" onChange={updateUser}/>
        <Label>Last name</Label>
        <Input type="text" value={user.lastName} name="lastName" onChange={updateUser}/>
        {
          isEditing ? (
            <>
            <Button className="float-right mt15" outline color="secondary" onClick={editEmployee}>Edit Employee</Button>
            <Button className="float-right mt15" outline color="danger" onClick={deleteEmployee}>Delete Employee</Button>
            </>
          ) : (
            <Button className="float-right mt15" outline color="secondary" onClick={addEmployee}>Add Employee</Button>   
          )
        }
      </div>
    </Container>
  );
}

export default App;
