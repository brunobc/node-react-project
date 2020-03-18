import React from 'react';
import { Button } from 'reactstrap';

const TableRow = (props) => {
  const { id, user, edit } = props;
  const name = user.name.charAt(0) + user.name.toLowerCase().slice(1);
  const lastName = user.lastName.charAt(0) + user.lastName.toLowerCase().slice(1);

  return (
    <tr key={id} className="list__item user" title={user.nameComplete}>
      <td>{user.page ? (
        <input
          type="checkbox"
          id={id}
          name={id}
          value={user.checked}
          defaultChecked={user.checked}
          onClick={() => {user.checked = !user.checked}}
          ></input>
        ) : ''}
      </td>
      <td>{name}</td>
      <td>{lastName}</td>
      <td>{user.page ? user.page  : ''}</td>
      <td>
        <Button color="info" onClick={() => edit(user)}>Edit</Button>
      </td>
    </tr>
  );
}

export default TableRow;