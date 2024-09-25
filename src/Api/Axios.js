import axios from "axios";
import { BASEURL } from "./Api";
import Cookie from 'cookie-universal'


const cookie=Cookie();
const token=cookie.get('token');


export const Axios=axios.create({
    baseURL: BASEURL,
    headers:{
        Authorization:'Bearer '+token,
        'ngrok-skip-browser-warning': '69420'
    }

})