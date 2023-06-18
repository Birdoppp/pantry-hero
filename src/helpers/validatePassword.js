export function validatePassword( value ) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;

    if ( !value ) {
        return "Password is required";
    } else if ( !passwordRegex.test( value ) ) {
        return "Invalid password."
        //return "Invalid password. It should contain at least 10 characters, including a lowercase letter, an uppercase letter, a number, and a special symbol (@$!%*?&).";
    }

    return true;
}