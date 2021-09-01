import '../../index.css';
import httpCommon from '../../http-common';
import React, { useEffect, useState } from "react";
import $ from 'jquery';

function Users() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    httpCommon.get('/users')
      .then(
        (result) => {
          setIsLoaded(true);
          setUsers(result.data.users);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div class="container-fluid bg-grey" style ={{width:"80%"}}>
        <table class="table table-striped">
          <thead>
          <tr>
              <th scope="col"> user id</th>
              <th scope="col"> firstname </th>
              <th scope="col"> lastname </th>
              <th scope="col"> location </th>
            </tr>
          </thead>
          <tbody>

            {users.map(user => (
                <tr>
                  <td> <input class={user.id} type="text" id={user.id + "_id"} disabled="disabled" defaultValue={user.id} style={{ backgroundColor: "inherit" }} /> </td>
                  <td> <input class={user.id} type="text" id={user.id + "_firstname"} disabled="disabled" defaultValue={user.firstname} style={{ backgroundColor: "inherit" }} /> </td>
                  <td> <input class={user.id} type="text" id={user.id + "_lastname"} disabled="disabled" defaultValue={user.lastname} style={{ backgroundColor: "inherit" }} /> </td>
                  <td> <input class={user.id} type="text" id={user.id + "_location"} disabled="disabled" defaultValue={user.location} style={{ backgroundColor: "inherit" }} /> </td>
                </tr>
              ))}


          </tbody>
        </table>
      </div>

    );
  }
}

export default Users;

