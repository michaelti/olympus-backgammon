import { createGlobalStyle } from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';

export default createGlobalStyle`
    /** Height convenience for app and its parents **/
    html, body, #root, .App {
        height: 100%;
    }
`;
