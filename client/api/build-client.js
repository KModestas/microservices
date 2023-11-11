import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on the server

    // domain needs to be the ingess-nginx controller
    return axios.create({
      baseURL: 'http://www.YOURDOMAIN.com',
      // forward all headers from initial request (includes cookie, host etc). 
      // Its basically as though the client made a direct request to ingres-nginx directly!
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: '/',
    });
  }
};
