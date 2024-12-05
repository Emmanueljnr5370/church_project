import { createContext, useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [permission, setPermission] = useState(null);
    const navigate = useNavigate();

    const signIn = (data) => {
        setUser(data)
        localStorage.setItem('id', data._id);
        localStorage.setItem('user', JSON.stringify(data));
    }

    const signOut = () => {
        setUser(null);
        navigate("/");
        localStorage.setItem('id', '')
        localStorage.setItem('token', '')
    }

    const permissions = (data) => {
        setPermission(data);
        localStorage.setItem('permission', JSON.stringify(data));
    }
    return(
        <UserContext.Provider value={{user, permission, signIn, signOut, permissions}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUserContext = () => {
    return useContext(UserContext);
}