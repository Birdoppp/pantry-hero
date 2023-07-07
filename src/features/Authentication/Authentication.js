import axios from "axios";

const authApiUrl = "https://frontend-educational-backend.herokuapp.com";

async function sendUserRegistration( userInformation ){
    try {
        return await axios.post(`${ authApiUrl }/api/auth/signup`, userInformation);

    } catch ( e ) {
        if ( e.response.status === 400 ) {
            return e.response;
        } else {
            console.error( e );
        }
    }
}

async function sendUserLogin ( userInformation ) {
    try {
        return await axios.post(`${ authApiUrl }/api/auth/signin`, userInformation);
    } catch ( e ) {
        if( e.response.status === 401 ) {
            return e.response;
        } else {
            console.error( e );
        }
    }
}

export { sendUserRegistration, sendUserLogin }