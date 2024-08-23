export const isTokenPresent = (): boolean => {
    // Get all cookies as a single string
    const cookies = document.cookie;
    // Split the cookies string into individual cookies
    const cookiesArray = cookies.split('; ');

    // Iterate over the cookies array to find the desired cookie
    for (let cookie of cookiesArray) {
      // Extract the cookie name and value
      const [name] = cookie.split('=');
      if (name === 'token') {
        return true; // Token cookie is present
      }
    }

    return false; // Token cookie is not present
  };
