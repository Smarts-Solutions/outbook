import { PublicClientApplication } from '@azure/msal-browser';
import config from './AuthConfig';

const msalConfig = {
    auth: {
        clientId: config.auth.clientId,
        authority: config.auth.authority,
        redirectUri: config.auth.redirectUri,
    },
    cache: {
        cacheLocation: config.cache.cacheLocation,
        storeAuthStateInCookie: config.cache.storeAuthStateInCookie,
    }
};

const pca = new PublicClientApplication(msalConfig);

const loginRequest = {
    scopes: ['User.Read'],
};

// Initialize function
export const initializeMsal = async () => {
    try {
        await pca.initialize();
        console.log('MSAL initialized successfully');
    } catch (error) {
        console.error('Error initializing MSAL:', error);
    }
};

export const azureLogin = async () => {
    await initializeMsal(); // Ensure MSAL is initialized before login
    try {
        console.log('login Accounts',pca.getAllAccounts());
        await pca.loginPopup(loginRequest);
        return pca.getAllAccounts();
    } catch (error) {
        console.error(error);
        return [];
    }
};

