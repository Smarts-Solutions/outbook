const config = {
    auth: {
        clientId: '611f720d-ef87-4438-a9a4-16a3da9e5855', // Replace with your Application (client) ID
        authority: 'https://login.microsoftonline.com/consumers', // Replace with your Tenant ID
        redirectUri: `${window.location.origin}`, // Replace with your Redirect URI
    },
    cache: {
        cacheLocation: 'sessionStorage', // Recommended to avoid page reload issues
        storeAuthStateInCookie: false, // Recommended for single-page applications
    }
};

export default config;
