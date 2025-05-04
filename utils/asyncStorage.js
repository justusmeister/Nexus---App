import AsyncStorage from "@react-native-async-storage/async-storage";

export const setAsyncItem = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    }
    catch (error) {
        console.log(`An Error appeart while setting AsyncStorage: ${error}`);
    }
}

export const getAsyncItem = async (key, value) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    }
    catch (error) {
        console.log(`An Error appeart while retrieving AsyncStorage: ${error}`);
    }
}


export const removeAsyncItem = async (key, value) => {
    try {
        await AsyncStorage.removeItem(key);
    }
    catch (error) {
        console.log(`An Error appeart while deleting AsyncStorage: ${error}`);
    }
}
