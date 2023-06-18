import jwtDecode from "jwt-decode";
import axios from "axios";

const authApiUrl = "https://frontend-educational-backend.herokuapp.com";

async function sendTestAuth() {
    console.log("SENDING TEST AUTH")
    try {
        const result = await axios.get(`${authApiUrl}/api/test/all`);

        console.log(result);

    } catch ( e ) {
        console.error( e );
    }
}

export { sendTestAuth }