import CryptoJS from "crypto-js";
const Encrypted_key = "cfcfcgjh-hghgh-3hgh4ge-6refcg-hgfhf75rtdcgfcbv";

export const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), Encrypted_key).toString();
}

export const decryptData = (ciphertext) => {
    const byte = CryptoJS.AES.decrypt(ciphertext, Encrypted_key);
    try {
        return JSON.parse(byte.toString(CryptoJS.enc.Utf8))
    }
    catch (error) {
        return null;
    }
}

export const getSessionStorage = (key) => {
    const data = sessionStorage.getItem(key);
    if (data) {
        const result = decryptData(data);
        return result;
    }
    return null;
};

export const setSessionStorage = (key, data) => {
    const encryptedData = encryptData(data);
    sessionStorage.setItem(key, encryptedData)
};

export const checkAuthExist = () => {
    const userData = getSessionStorage("user");
    if (userData) {
        const expiryDate = userData.APIToken.ExpiryDate;
        if (expiryDate) {
            const date = new Date(expiryDate);
            const current = new Date();
            if (date > current) {
                return true;
            }
            sessionStorage.removeItem("loggedIn");
            return false;
        } else {
            sessionStorage.removeItem("loggedIn");
            return false;
        }
    }
    else {
        sessionStorage.removeItem("loggedIn");
        return false;
    }
};