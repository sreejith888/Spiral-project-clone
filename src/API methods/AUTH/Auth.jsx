import CryptoJS from "crypto-js";
const Encrypted_Key = "cfcfcgjh-hghgh-3hgh4ge-6refcg-hgfhf75rtdcgfcbv";

export const checkAuthExist = () => {
    const userData = getSessionStorage("user");
    if (userData) {
        const expiryDate = userData.ApiToken.ExpiryDate;
        if (expiryDate) {
            const date = new Date(expiryDate);
            const now = new Date();
            // now.setMinutes(now.getMinutes() + 58);
            if (date > now) {
                return true;
            }
            sessionStorage.removeItem("IsLoggedIn");
            return false;
        } else {
            sessionStorage.removeItem("IsLoggedIn");
            return false;
        }
    } else {
        sessionStorage.removeItem("IsLoggedIn");
        return false;
    }
};

export const checkBMSessionExist = () => {
    const session = getSessionStorage("bmsession");
    if (session && session.Token) {
        if (session.Expiry) {
            const date = new Date(session.Expiry);
            const now = new Date();
            if (date > now) {
                return true;
            }
            return false;
        }
        return false;
    } else {
        return false;
    }
};

export const setSessionStorage = (key, data) => {
    const encryptedData = encryptData(data);
    sessionStorage.setItem(key, encryptedData);
};

export const getSessionStorage = (key) => {
    const data = sessionStorage.getItem(key);
    if (data) {
        const result = decryptData(data);
        return result;
    }
    return null;
};

export const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), Encrypted_Key).toString();
};

export const decryptData = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, Encrypted_Key);
    try {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (err) {
        return null;
    }
};
