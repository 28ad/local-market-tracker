import axios from "axios";

export const isTokenPresent = async (): Promise<{ authenticated: boolean; cmsAccess: boolean }> => {

  let authUser = {
    authenticated: false,
    cmsAccess: false,
  };

  // Get all cookies as a single string
  const cookies = document.cookie;
  // Split the cookies string into individual cookies
  const cookiesArray = cookies.split('; ');

  // Iterate over the cookies array to find the desired cookie
  for (let cookie of cookiesArray) {
    // Extract the cookie name and value
    const [name] = cookie.split('=');
    if (name === 'token') {
      try {
        const res = await axios.get('http://localhost:3000/authenticate');
        authUser.authenticated = true;

        console.log(res);

        if (res.data.user.isAdmin === 'true') {
          authUser.cmsAccess = true;
        } else {
          authUser.cmsAccess = false;
        }
      } catch (err) {
        console.log(err);
        authUser.authenticated = false;
        authUser.cmsAccess = false;
      }

      return authUser;
    }
  }

  return authUser;
};
