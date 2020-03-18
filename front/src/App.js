import React, { useState, useEffect } from "react";

import userService from './services/user.service';

function App() {
  const [ users, setUsers ] = useState(null);

  useEffect(() => {
    if (!users) {
      getUsers();
    }
  })

  const getUsers = async () => {
    let res = await userService.getAll();
    setUsers(res);
  }

  const renderUser = user => {
    return (
      <li key={user._id} className="list__item user">
        <h3 className="user__name">{user.name}</h3>
        <h3 className="user__lastName">{user.lastName}</h3>
      </li>
    );
  };

  return (
    <div className="App">
      <ul className="list">
        {(users && users.length > 0) ? (
          users.map(user => renderUser(user))
        ) : (
          <p>No users found</p>
        )}
      </ul>
    </div>
  );
}

export default App;