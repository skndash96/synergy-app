import {bleManager} from "./bleManager";
import { PermissionsAndroid, Platform } from "react-native";

export const onData = (data: string) => {
  return {
    value: parseFloat(data) || 0,
    timestamp: Date.now()
  };
};

export const requestBluetoothPermission = async () => {
  if (Platform.OS === 'ios') {
    return true
  }

  if (Platform.OS === 'android' && PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION) {
    const apiLevel = parseInt(Platform.Version.toString(), 10)

    if (apiLevel < 31) {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      return granted === PermissionsAndroid.RESULTS.GRANTED
    }

    if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN && PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ])

      return (
        result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
        result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
        result['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
      )
    }
  }

  console.log('BLE Permission Not Granted');

  return false;
}

// React.useEffect(() => {
//   const subscription = bleManager.onStateChange(state => {
//     if (state === 'PoweredOn') {
//       scanAndConnect()
//       subscription.remove()
//     }
//   }, true)

//   return () => subscription.remove()
// }, [bleManager]);

export const scanAndConnect = () => {
  bleManager.startDeviceScan(null, null, (error, device) => {
    if (error || !device) {
      // Handle error (scanning will be stopped automatically)
      console.log('BLE Scan Error');
      return
    }

    console.log('BLE Device found', device.name);

    // Check if it is a device you are looking for based on advertisement data
    // or other criteria.
    if (device.name === 'TI BLE Sensor Tag' || device.name === 'SensorTag') {
      // Stop scanning as it's not necessary if you are scanning for one device.
      bleManager.stopDeviceScan()

      // Proceed with connection.
      device
        .connect()
        .then(device => {
          return device.discoverAllServicesAndCharacteristics()
        })
        .then(device => {
          // Do work on device with services and characteristics
        })
        .catch(error => {
          // Handle errors
          console.log('BLE Failed to connect', error);
        })
    }
  })
}