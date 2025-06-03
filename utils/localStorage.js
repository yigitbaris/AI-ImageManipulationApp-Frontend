import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = (name, obj) => {
  return new Promise((resolve, reject) => {
    let jsonOfItem = JSON.stringify(obj);
    AsyncStorage.setItem(name, jsonOfItem)
      .then((r) => resolve(jsonOfItem))
      .catch((e) => reject(e));
  });
};

export const readData = (name) => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(name)
      .then((r) => resolve(JSON.parse(r)))
      .catch((e) => reject(e));
  });
};

export const readMultiData = (name1, name2, ...args) => {
  return new Promise((resolve, reject) => {
    AsyncStorage.multiGet([name1, name2, ...args])
      .then((r) => {
        resolve(r);
      })
      .catch((e) => reject(e));
  });
};

export const removeItem = (name) => {
  return new Promise((resolve, reject) => {
    AsyncStorage.removeItem(name);
  });
};
