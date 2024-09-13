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
    } catch (error) {
      return
    }
};

export const azureLogin = async () => {
    await initializeMsal(); // Ensure MSAL is initialized before login
    try {
    
        await pca.loginPopup(loginRequest);
        return pca.getAllAccounts();
    } catch (error) {

        return [];
    }
};

