import React, { createContext, useEffect, useState } from "react";

// DEPENDENCIES
import axios from "axios";
import { useNavigate } from "react-router-dom";

// COMPONENTS
import LoadingIcon from "../components/LoadingIcon/LoadingIcon";

// HELPERS
import { checkTokenValidity } from "../helpers/checkTokenValidity";

export const AuthContext = createContext( null );

function AuthContextProvider({ children }) {
    const navigate = useNavigate();
    const [ authState, setAuthState ] = useState({
        user: null,
        status: "pending",
    });

    async function login( token, redirect ) {
        try {
            const { data: { username } } = await axios.get("https://frontend-educational-backend.herokuapp.com/api/user", {
                headers : {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${ token }`
                }
            });

            setAuthState({
                isAuth: true,
                user: {
                    username,
                },
                status: "done",
            });

            if ( redirect ) navigate( "/pantry" );
        } catch ( e ) {
            if ( e.response.status === 401 ) {
                logout();
            } else {
                console.error( e );
            }
        }
    }

    function logout() {
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
                status: "done",
            });
        }
    }, [] );

    const data = {
        ...authState,
        login: login,
        logout: logout,
    };

    return  (
        <AuthContext.Provider value={ data }>
            { authState.status === "pending" ?
                <LoadingIcon/> : children
            }
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;