import { useLocation, Navigate, Outlet } from 'react-router-dom'
import React, { useContext } from 'react'
import AuthContext from '../authorization/AuthContext'

const PrivateRoute = ({allowedRoles}) => {
    let {user} = useContext(AuthContext)
    const location = useLocation();

    return(
        user.group.find(role=>allowedRoles?.includes(role)) 
        ? <Outlet />
        : user ?
            <Navigate to="/unauthorized" state={{ from: location }} replace />
            : <Navigate to="/login" state={{ from: location }} replace />  
    );
}

export default PrivateRoute;