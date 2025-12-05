import * as Location from "expo-location";

export const checkPermission = async () => {
  const hasPermission = await Location.requestForegroundPermissionsAsync();
  if(!(hasPermission.status === "granted")) {
    const permission = await askPermission();
    return permission
  }

  return true;
};

const askPermission = async () => {
  const permission = await Location.getForegroundPermissionsAsync();
  return permission.status === "granted";
};

/*
export const getUserLocation = async () => {
    const userLocation = await Location.getCurrentPositionAsync();
    return userLocation.coords;
};
*/

export const watchUserLocation = async (callback: (location: Location.LocationObjectCoords) => void) => {
  return await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 1000,     // 1 segundo
      distanceInterval: 1,    // 1 metro
    },
    (location) => callback(location.coords)
  );
};