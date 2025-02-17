import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import "@fontsource/aileron";
import "@fontsource/lato";
import AuthContext from '../../authorization/AuthContext';
import '../../static/css/UserProfile.css';
import { Button } from "react-bootstrap";


const UserProfile = () => {
  
  let {logoutUser} = useContext(AuthContext)
  const { id } = useParams();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const url = 'http://localhost:8000';

  useEffect(() => {
    getUserById();
  });

  const getUserById = async () => {
    const response = await fetch(`${url}/api/account/detail/${id}/`);
    const data = await response.json();
    if (data.groups[0] === 1){
        setRole("Executive");
    }
    else if(data.groups[0] === 2){
        setRole("Manajer");
    }
    else if(data.groups[0] === 3){
        setRole("Partnership");
    }
    else if(data.groups[0] === 4){
      setRole("Finance");
  }
    else {
        setRole("Admin");
    }
    setEmail(data.email);
    setName(data.name);

  };

  return (
    <div>
      <div id='main-card'>
        <div id="title">
          <h1 class="title">My Profile</h1>
        </div>
        {/* <div class='container' id="sub-card"> */}
          <div class='row justify-content-md-center'>
            <div class="mini-card col col-lg-5">
              <h3 class="attribute">Id:</h3>
              <p>{id}</p>
            </div>
            <div class="col-md-auto"> {/* dikosongin saja */} </div>
            <div class="mini-card col col-lg-5">
              <h3 class="attribute">Name:</h3>
              <p>{name}</p>
            </div>            
          </div>
          <div class='row justify-content-md-center'>
            <div class="mini-card col col-lg-5">
              <h3 class="attribute">Email:</h3>
              <p>{email}</p>
            </div>
            <div class="col-md-auto"> {/* dikosongin saja */} </div>
            <div class="mini-card col col-lg-5">
              <h3 class="attribute">Role:</h3>
              <p>{role}</p>
            </div>            
          </div>
          <div className="d-flex justify-content-center">
            <button onClick={logoutUser} to='login/' style={{marginTop:50}}>Log Out</button>
          </div>
        </div>
        
      </div>
          // <div class="justify-content-center" id="user-page">
          //   <h1 class="d-flex justify-content-center">My Profile</h1>
          //   <br></br>

          //   <div class="d-flex justify-content-around">
          //     <div>
          //       <p><strong>ID</strong></p>
          //       <p>{id}</p>
          //       <br></br>
          //       <p><strong>Email</strong></p>
          //       <p>{email}</p>
          //     </div>
          //     <br></br>
          //     <div>
          //       <p><strong>Name</strong></p>
          //       <p>{name}</p>
          //       <br></br>
          //       <p><strong>Role</strong></p>
          //       <p>{role}</p>
          //     </div>
          //   </div>
          //   <div className="d-flex justify-content-center">
          //     <button onClick={logoutUser} to='login/'>Log Out</button>
          //   </div> 
          // </div>
  );
};

export default UserProfile;