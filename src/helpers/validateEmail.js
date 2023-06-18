export function validateEmail( value )  {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if ( !value ) {
        return "Email is required";
    } else if ( !emailRegex.test( value ) ) {
        return "Invalid email address";
    }
    return true;
};