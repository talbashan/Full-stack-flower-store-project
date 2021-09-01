import React from 'react';

export const LoginForm = ({ onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>

      <div className="form-group">
        <span class="glyphicon glyphicon-user"></span>
        <label htmlFor="name">User name</label>
        <input className="form-control" id="username" />
      </div>
      <div className="form-group">
        <span class="glyphicon glyphicon-lock"></span>
        <label htmlFor="Password">Password</label>
        <input className="form-control" id="password" />
      </div>
      <div className="form-group">
        <button className="form-control btn btn-primary" type="submit" style={{backgroundColor: 'rgb(199, 190, 250)'}}>
          Submit
        </button>
      </div>
    </form>
  );
};
export default LoginForm;

