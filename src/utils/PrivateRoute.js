import { Navigate } from 'react-router-dom'
import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'

const PrivateRoute = ({children, ...rest}) => {
    let {user} = useContext(AuthContext)
    return(
        user ? (
                children
            ) : (
                <Navigate to="/login" /> 
            )
    );
}

export default PrivateRoute;