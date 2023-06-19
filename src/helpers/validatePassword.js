export function validatePassword( value ) {
    const hasCapitalLetters = /[A-Z]/.test( value );
    const hasNumbers = /\d/.test( value );
    const hasSymbols = /[@$!%*?&]/.test( value );

    if ( !value ) {
        return "Password is required";
    } else if ( !hasCapitalLetters ) {
        return "Invalid password, no capital letters";
    } else if ( !hasNumbers ) {
        return "Invalid password, no numbers";
    } else if ( !hasSymbols ) {
        return "Invalid password, no symbols";
    } else if ( value.length < 10 ) {
        return "Invalid password, too short";
    }

    return true;
}