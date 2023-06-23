import jwtDecode from "jwt-decode";

export function checkTokenValidity( token ) {
    const decoded = jwtDecode( token );
    const expirationTime = decoded.exp * 1000;
    const isExpired = Date.now() > expirationTime;

    return !isExpired;
}