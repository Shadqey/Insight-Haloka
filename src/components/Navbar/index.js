import React,{useContext} from 'react';
import {
  NavBtn,
  NavBtnLink
} from './NavbarElements';
import { NavLink } from "react-router-dom";
import AuthContext from '../../authorization/AuthContext'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FaUserCircle } from 'react-icons/fa';
import '../../static/css/Navbar.css'
import halokaLogo from '../../assets/img/haloka-logo.png';

const HalokaNavbar = () => {
    let {user, logoutUser} = useContext(AuthContext)
    return (
      <Navbar className='navbar-container' fixed='top' variant='light'> {/* Add the fixed='top' prop */}
      <Container className='box'>
        <Navbar.Brand href="/" className="justify-content-start">
          <img src={halokaLogo} alt="Haloka Logo" style={{ width: '100px', paddingBottom: '6px' }} />
        </Navbar.Brand>
        {user ? (
          <Navbar.Collapse className="justify-content-end ml-auto"> {/* Use Navbar.Collapse for responsive behavior */}
            <Nav>
              <NavLink to="client/" className='nav-link'>Clients</NavLink>
              {user.group.find((role) => ['Manager', 'Partnership'].includes(role)) && (
                <NavLink to="product/" className='nav-link'>Services</NavLink>
              )}
              {user.group.find((role) => ['Manager', 'Partnership'].includes(role)) && (
                <NavLink to="/reports/" className='nav-link'>Reports</NavLink>
              )}
            </Nav>
            <Nav>
              <NavLink to={'user/detail/' + user.user_id} className='nav-link'>
                <FaUserCircle size="30px" style={{marginTop:5}}/>
              </NavLink>
            </Nav>
          </Navbar.Collapse>
        ) : (
          <Nav className="justify-content-end">
            <Nav.Link to='login/'>Log In</Nav.Link> {/* Use Nav.Link instead of NavBtnLink */}
          </Nav>
        )}
      </Container>
    </Navbar>
  );
};

export default HalokaNavbar;
