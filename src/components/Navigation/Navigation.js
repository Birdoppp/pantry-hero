import React, {useState, useEffect, useContext} from 'react';

// DEPENDENCIES
import { NavLink } from "react-router-dom";

// COMPONENTS
import Button from "../Button/Button";
import AuthPopup from "../AuthPopup/AuthPopup";
import HamburgerMenu from "../HamburgerMenu/HamburgerMenu";

// HELPERS
import { handleConfirmation } from "../../helpers/handleConfirmation";
import { useForm } from 'react-hook-form';
import { validateEmail } from "../../helpers/validateEmail";
import { validatePassword } from "../../helpers/validatePassword";
import { sendUserRegistration, sendUserLogin } from "../../features/Authentication/Authentication";

// CONTEXT
import { AuthContext } from "../../context/AuthProvider";

// IMAGES
import { ReactComponent as Logo } from "../../assets/icon-logo.svg";

// STYLES
import "./Navigation.css";

function Navigation() {
    const { register, reset, handleSubmit, formState: { errors }, watch } = useForm( {mode: "onSubmit"} );
    const { isAuth, login } = useContext( AuthContext );
    const [ showLoginPopup, setShowLoginPopup ] = useState(false);
    const [ showRegisterPopup, setShowRegisterPopup ] = useState(false);
    const [ showErrorMessage, setShowErrorMessage ] = useState(false);
    const [ serverResponse, setServerResponse ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);

    // USE EFFECTS
    useEffect(() => {
        if (showErrorMessage) {
            const timeout = setTimeout(() => {
                setShowErrorMessage(false);
                setServerResponse( null );
            }, 3000 );

            return () => {
                clearTimeout( timeout );
            };
        }
    }, [showErrorMessage]);

    // HANDLERS
    async function handleLoginSubmit( userData ) {
        if ( !serverResponse ) {
            setIsLoading ( true );

            const user = {
                username: userData.username,
                password: userData.password
            }

            try {
                await sendUserLogin( user ).then( (data) => {
                    setServerResponse( data );
                    if ( data.status === 200 ) {
                        const token = data.data.accessToken;

                        localStorage.setItem( "token", token );
                        login( token, "/pantry" );

                        resetAuthPopup();
                        setShowLoginPopup( false );
                    } else if ( data.status === 401 ) {
                        setIsLoading( false );
                        setShowErrorMessage( true );
                        reset();
                    }
                } );
            } catch ( e ) {
                console.error( e )
            }
        }
    }

    async function handleRegisterSubmit( userData ) {
        if ( !serverResponse ) {
            setIsLoading( true );

            const newUser = {
                username: userData.username,
                email: userData.username,
                password: userData.password,
                role: ["user"]
            };

            try {
                const serverReply = await sendUserRegistration( newUser );
                setServerResponse( serverReply );
            } catch ( e ) {
                console.error( e );
            }

            setIsLoading( false );
            reset();
        } else if ( serverResponse.status === 200 ) {
            resetAuthPopup();
            setShowRegisterPopup( false );
        } else {
            resetAuthPopup();
        }
    }

    function resetAuthPopup() {
        setIsLoading( false );
        setServerResponse( null );
        reset();
    }

    function validatePasswordMatch( value ) {
        const firstPassword = watch("password");

        if (value !== firstPassword) {
            return "Passwords do not match";
        }

        return true;
    }

    return (
        <>
            <nav className="navigation-bar">
                <div className="app-logo">
                    <Logo className="logo" />
                    <h2 className="logo-title">Pantry Hero</h2>
                </div>

                { isAuth &&
                    <ul className="page-link-list">
                        <li>
                            <NavLink
                                className={({ isActive }) =>
                                    isActive ? 'page-link active-menu-link' : 'page-link default-menu-link'
                                }
                                to="/pantry"
                            >
                                My pantry
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className={({ isActive }) =>
                                    isActive ? 'page-link active-menu-link' : 'page-link default-menu-link'
                                }
                                to="/shoppinglist"
                            >
                                Shopping list
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className={({ isActive }) =>
                                    isActive ? 'page-link active-menu-link' : 'page-link default-menu-link'
                                }
                                to="/recipes"
                            >
                                Recipes
                            </NavLink>
                        </li>
                    </ul>
                }

                { ( !isAuth ) ? (
                    <div className="auth-buttons">
                        <Button
                            textValue="Log in"
                            type="button"
                            clickHandler={ () => setShowLoginPopup( true ) }
                            filledStatus={ false }
                            color="black"
                        />

                        <Button
                            textValue="Register"
                            type="button"
                            clickHandler={ () => setShowRegisterPopup( true ) }
                            filledStatus={ true }
                            color="black"
                        />
                    </div>
                ) : (
                    <HamburgerMenu/>
                )}

            </nav>

            { showLoginPopup && (
                <AuthPopup
                    onConfirm={ () => {
                        if (errors) {
                            setShowErrorMessage( true );
                        }
                        handleSubmit( handleLoginSubmit )();
                    } }
                    onCancel={ () => {
                        resetAuthPopup();
                        handleConfirmation(false, setShowLoginPopup);
                    } }
                >
                    { isLoading ? (
                        <div className="auth-message">
                            <h2>Logging in</h2>
                            <p>Awaiting response from server...</p>
                        </div>
                    ) : (
                        <>
                            <h2>Log in to your account</h2>

                            <form
                                id="user-login"
                                className="auth-form"
                            >
                                <div className="input-wrapper">
                                    <label htmlFor="input-username">
                                        Email
                                    </label>

                                    <input
                                        type="text"
                                        id="input-username"
                                        autoComplete="off"
                                        {...register("username", {
                                            required: {
                                                value: true,
                                                message: "You need to enter a username"
                                            },
                                            validate: validateEmail
                                        })}
                                    />
                                    {errors.username && showErrorMessage && <p className="auth-error">{ errors.username.message }</p>}
                                </div>

                                <div className="input-wrapper">
                                    <label htmlFor="input-user-password">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        id="input-password"
                                        autoComplete="off"
                                        {...register("password", {
                                            required: {
                                                value: true,
                                                message: "You need to enter a password"
                                            }
                                        })}
                                    />
                                    {serverResponse && serverResponse.status === 401 && showErrorMessage && <p className="auth-error">Invalid password or username.</p>}
                                    {errors.password && showErrorMessage && <p className="auth-error">{ errors.password.message }</p>}
                                </div>
                            </form>
                        </>
                    )}
                </AuthPopup>
            ) }

            { showRegisterPopup && (
                <AuthPopup
                    onConfirm={ () => {
                        if ( errors ) {
                            setShowErrorMessage( true );
                        }
                        handleSubmit( handleRegisterSubmit )();
                    } }
                    onCancel={ () => {
                        resetAuthPopup();
                        handleConfirmation(false, setShowRegisterPopup);
                    } }
                >
                    { isLoading ? (
                        <div className="auth-message">
                            <h2>Creating account</h2>
                            <p>Awaiting response from server...</p>
                        </div>
                    ) : serverResponse ? (
                        <div className="auth-message">
                            <h2>Creating account</h2>
                            <p>{ serverResponse.data.message }</p>
                        </div>
                    ) : (
                        <>
                            <h2>Create an account</h2>

                            <form
                                id="user-registration"
                                className="auth-form"
                            >
                                <div className="input-wrapper">
                                    <label htmlFor="input-username">
                                        Email
                                    </label>

                                    <input
                                        type="text"
                                        id="input-username"
                                        autoComplete="off"
                                        {...register("username", {
                                            required: {
                                                value: true,
                                                message: "You need to enter a username"
                                            },
                                            validate: validateEmail
                                        })}
                                    />
                                    {errors.username && showErrorMessage && <p className="auth-error">{ errors.username.message }</p>}
                                </div>

                                <div className="input-wrapper">
                                    <label htmlFor="input-user-password">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        id="input-password"
                                        autoComplete="off"
                                        {...register("password", {
                                            required: {
                                                value: true,
                                                message: "You need to enter a password"
                                            },
                                            validate: validatePassword
                                        })}
                                    />
                                    {errors.password && showErrorMessage && <p className="auth-error">{ errors.password.message }</p>}
                                </div>

                                <div className="input-wrapper">
                                    <label htmlFor="input-user-password">
                                        Confirm password
                                    </label>

                                    <input
                                        type="password"
                                        id="input-password-confirm"
                                        autoComplete="off"
                                        {...register("password-confirm", {
                                            required: {
                                                value: true,
                                                message: "You need to enter a password"
                                            },
                                            validate: validatePasswordMatch
                                        })}
                                    />
                                    {errors["password-confirm"] && <p className="auth-error">{ errors["password-confirm"].message }</p>}
                                </div>
                            </form>
                        </>
                    ) }
                </AuthPopup>
            ) }
        </>
    );
}

export default Navigation;