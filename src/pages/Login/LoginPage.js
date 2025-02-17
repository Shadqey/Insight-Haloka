import React, {useContext} from 'react'
import AuthContext from '../../authorization/AuthContext'
import '../../static/css/LoginPage.css'
import "@fontsource/aileron";
import "@fontsource/lato";
import '../../static/css/font.css';
import '../../static/css/Button.css';
import '../../static/css/card.css';

const LoginPage = () => {
  let {loginUser} = useContext(AuthContext)
  return (
    <div className='d-flex align-items-center justify-content-center w-100' id='loginPage'>
      <div className='login'>
        <h1 className='mb-3'>Insight Haloka</h1>
        <form className='needs-validation' onSubmit={loginUser}>
          <div className='form-group was-validated mb-2'>
            <label htmlFor='email' className='form-label'>Email Address</label>
            <input type="text" name='email' className="form-control" placeholder='Enter email' required/>
            <div className='invalid-feedback'>
              Please enter your email
            </div>
          </div>
          <div className='form-group was-validated mb-2'>
            <label htmlFor='password' className='form-label'>Password</label>
            <input type="password" name='password' className="form-control" placeholder='Enter password' required/>
            <div className='invalid-feedback'>
              Please enter your password
            </div>
          </div>
          <button className="btn btn-primary w-100 mt-2" type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
