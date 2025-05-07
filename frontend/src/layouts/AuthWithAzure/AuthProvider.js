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

// export const azureLogin = async () => {
//     await initializeMsal(); // Ensure MSAL is initialized before login
//     try {
    
//         await pca.loginPopup(loginRequest);
//         return pca.getAllAccounts();
//     } catch (error) {

//         return [];
//     }
// };

// export const azureLogin = async () => {
//     await initializeMsal();
//     try {
//         await pca.loginPopup(loginRequest);
//         return pca.getAllAccounts();
//     } catch (error) {
//         if (error.errorCode === 'user_cancelled') {
//             alert("Login popup was closed. Please try again.");
//         } else {
//             console.error("Login error:", error);
//         }
//         return [];
//     }
// };
export const azureLogin = async () => {
    await initializeMsal();
    try {
        const accounts = pca.getAllAccounts();

       console.log(" azureLogin Accounts:", accounts);

        // If user is already signed in, try silent token acquisition
        if (accounts.length > 0) {
            const response = await pca.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            });
            return accounts;
        }

        // If no account found, do login with popup
        await pca.loginPopup(loginRequest);
        return pca.getAllAccounts();

    } catch (error) {
        console.error("MSAL login error:", error);
        if (error.errorCode === 'user_cancelled') {
            alert("Login popup was closed. Please try again.");
        } else {
            console.error("MSAL login failed:", error);
            alert("Login failed. Please check console for details.");
        }
        return [];
    }
};


