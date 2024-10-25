const config = {
    auth: {
        clientId: '611f720d-ef87-4438-a9a4-16a3da9e5855', //  Application (client) ID
        authority: 'https://login.microsoftonline.com/consumers', //personal account
        //authority: 'https://login.microsoftonline.com/organizations', //Accounts in any organizational directory
       // authority: 'https://login.microsoftonline.com/common', //Accounts in any organizational directory and personal Microsoft account

        //authority: 'https://login.microsoftonline.com/f8cdef31-a31e-4b4a-93e4-5f571e91255a', //Tenant ID
       // authority: 'https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad', //Tenant ID
        redirectUri: `${window.location.origin}`, //  Redirect URI
    },
    cache: {
        cacheLocation: 'sessionStorage', // Recommended to avoid page reload issues
        storeAuthStateInCookie: false, // Recommended for single-page applications
    }
};

export default config;
