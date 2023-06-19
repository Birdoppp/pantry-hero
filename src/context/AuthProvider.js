import React, {createContext, useEffect, useState} from "react";
import jwtDecode from "jwt-decode";
import {useNavigate} from "react-router-dom";

export const AuthContext = createContext( null );

function AuthContextProvider({ children }) {
    const navigate = useNavigate();
    const [ authState, setAuthState ] = useState({
        user: null,
        status: "pending",
    });

    function login( token ) {
        const decoded = jwtDecode( token );

        setAuthState({
            isAuth: true,
            user: {
                username: decoded.sub,
            },
            status: "done",
        });

        navigate("/pantry");
    }

    function logout() {
        console.log("logging out")
        localStorage.removeItem("token");

        setAuthState({
            isAuth: false,
            user: null,
            status: "done",
        });

        navigate("/");
    }

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token && token !== "undefined") {
            login( token );
        } else {
            setAuthState({
                isAuth: false,
                user: null,
                status: 'done',
            });
        }
    }, []);

    const data = {
        ...authState,
        login: login,
        logout: logout,
    };

    return  (
        <AuthContext.Provider value={ data }>
            {authState.status === "pending"
                ? <p>Loading...</p>
                : children
            }
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;