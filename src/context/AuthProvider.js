import React, {createContext, useEffect, useState} from "react";
import jwtDecode from "jwt-decode";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {checkTokenValidity} from "../helpers/checkTokenValidity";

export const AuthContext = createContext( null );

function AuthContextProvider({ children }) {
    const navigate = useNavigate();
    const [ authState, setAuthState ] = useState({
        user: null,
        status: "pending",
    });

    async function login( token, redirect ) {
        const decoded = jwtDecode( token );

        try {
            const { data: { username } } = await axios.get(" https://frontend-educational-backend.herokuapp.com/api/user", {
                headers : {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ token }`
                }
            });

            setAuthState({
                isAuth: true,
                user: {
                    username,
                },
                status: "done",
            });

            if ( redirect ) navigate("/pantry");
        } catch ( e ) {
            console.error( e );
        }
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

        if ( token && token !== "undefined" && checkTokenValidity( token ) ) {
            void login( token );
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
            { authState.status === "pending" ?
                <p>Loading...</p> : children
            }
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;