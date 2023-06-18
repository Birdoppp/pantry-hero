import React, { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import Button from "../Button/Button";
import AuthPopup from "../AuthPopup/AuthPopup";
import { handleConfirmation } from "../../helpers/handleConfirmation";
import { useForm } from 'react-hook-form';
import { validateEmail } from "../../helpers/validateEmail";
import { validatePassword } from "../../helpers/validatePassword";
import {sendTestAuth} from "../../features/Authentication/Authentication";
import { ReactComponent as Logo } from "../../assets/icon-logo.svg";
import "./Navigation.css";

function Navigation() {
    const { register, reset, handleSubmit, formState: { errors }, watch } = useForm( {mode: "onSubmit"} );
    const [ showLoginPopup, setShowLoginPopup ] = useState(false);
    const [ showRegisterPopup, setShowRegisterPopup ] = useState(false);
    const [ showErrorMessage, setShowErrorMessage ] = useState(false);

    // HANDLERS
    function handleLoginSubmit( data ) {
        setShowLoginPopup( false )
        console.log(data);
        reset();
    }

    function handleRegisterSubmit( data ) {
        console.log( data );
        reset();
    }

    function validatePasswordMatch( value ) {
        const firstPassword = watch("password");

        if (value !== firstPassword) {
            return "Passwords do not match";
        }

        return true;
    }

    useEffect(() => {
        if (showErrorMessage) {
            const timeout = setTimeout(() => {
                setShowErrorMessage(false);
            }, 3000); // 3000 milliseconds = 3 seconds

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [showErrorMessage]);

    return (
        <>
            <nav className="navigation-bar">
                <div className="app-logo">
                    <Logo className="logo" />
                    <h2>Pantry Hero</h2>
                </div>

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
                {/*<button*/}
                {/*    type="button"*/}
                {/*    onClick={ () => {*/}
                {/*        void sendTestAuth();*/}
                {/*    } }*/}
                {/*> TEST </button>*/}
            </nav>

            { showLoginPopup && (
                <AuthPopup
                    onConfirm={() => {
                        if (errors) {
                            setShowErrorMessage( true );
                        }
                        handleSubmit( handleLoginSubmit )();
                    }}
                    onCancel={() => {
                        reset();
                        handleConfirmation(false, setShowLoginPopup);
                    }}
                    type="submit"
                    isRegistration={ true }
                >
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
                            {errors.username && showErrorMessage && <p className="auth-error">{errors.username.message}</p>}
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
                            {errors.password && showErrorMessage && <p className="auth-error">{errors.password.message}</p>}
                        </div>
                    </form>
                </AuthPopup>
            ) }

            { showRegisterPopup && (
                <AuthPopup
                    onConfirm={() => {
                        if (errors) {
                            setShowErrorMessage( true );
                        }
                        handleSubmit( handleRegisterSubmit )();
                    }}
                    onCancel={() => {
                        reset();
                        handleConfirmation(false, setShowRegisterPopup);
                    }}
                    type="submit"
                    isRegistration={ true }
                >
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
                            {errors.username && showErrorMessage && <p className="auth-error">{errors.username.message}</p>}
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
                            {errors.password && showErrorMessage && <p className="auth-error">{errors.password.message}</p>}
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
                            {errors["password-confirm"] && <p className="auth-error">{errors["password-confirm"].message}</p>}
                        </div>
                    </form>

                </AuthPopup>
            ) }
        </>
    );
}

export default Navigation;