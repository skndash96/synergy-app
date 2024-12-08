import { addData } from '@/lib/sample';
import { Feather } from '@expo/vector-icons';
import { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Platform, Alert, Modal } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { addCollection, getDbUser, InsertValue, setDbUser, User } from '@/lib/storage';
import { useSQLiteContext } from 'expo-sqlite';
import { UserModal } from '@/components/UserModal';
import { onData, requestBluetoothPermission } from '@/lib/ble';
import { firestore } from '@/lib/firebase';
import { doc, increment, onSnapshot, setDoc } from 'firebase/firestore';
import * as Network from 'expo-network';
import { bleManager } from '@/lib/bleManager';

const screenWidth = Dimensions.get('window').width;

export default function Tab() {
  const initialData = new Array(20).fill({
    timestamp: Date.now(),
    value: 0
  });

  const db = useSQLiteContext();

  const [data, setData] = useState<InsertValue[]>(initialData);
  const [connected, setConnected] = useState(false);
  const [isGoing, setIsGoing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [about, setAbout] = useState(0);
  const networkState = Network.useNetworkState();

  const handleGoing = () => {
    setIsGoing(c => !c);
  };

  const initBT = () => {
    if (checkConn()) {
      bleManager.discoverAllServicesAndCharacteristicsForDevice("HC-05").then((d) => onData(d.id));
    }
  };

  useLayoutEffect(() => {
    if (!networkState.isInternetReachable) {
      return;
    }

    requestBluetoothPermission().then((granted: boolean) => {
      if (!granted) {
        Alert.alert("Bluetooth Permission Denied", "Please enable Bluetooth to connect to a device");
      }
    }).catch((e: Error) => {
      console.log("Bluetooth Permission Error:", e.message);
    });

    getDbUser(db).then((u: User | null) => {
      setUser(u);
    })
    .catch((e: Error) => {
      console.log("User NOT fetched:", e.message);
    });

    const unsub = onSnapshot(doc(firestore, "fake", "1"), doc => {
      console.log("About:", doc.data()?.value);
      const data = doc.data();
      setAbout(data?.value || 0);
      setConnected(data?.connected || false);
    });

    initBT();
    
    return unsub;
  }, [networkState]);

  useLayoutEffect(() => {
    if (!networkState.isInternetReachable) {
      return;
    }

    if (!user) {
      return;
    }

    if (!connected) {
      return;
    }

    if (!isGoing) {
      if (data.some(d => d.value > 1)) {
        addCollection(db, data).then((name: string) => {
          console.log("Activity saved:", name);
          setData(initialData);
        }).catch((e: Error) => {
          console.log("Activity NOT saved:", e.message);
        });

        const sum = data.reduce((acc, d) => acc + d.value, 0);

        setDoc(doc(firestore, "scores", user.rollNo), {
          name: user.name,
          value: increment((sum/10)/data.length)
        }, {
          merge: true
        }).then(() => {
          console.log("Score updated");
        }).catch((e: Error) => {
          console.log("Score NOT saved:", e.message);
        });
      }
    } else {
      const interval = setInterval(() => {
        setData((prev: any) => [...prev, addData(about)])
      }, 250);

      return () => clearInterval(interval);
    };
  }, [user, networkState, connected, isGoing, about]);

  const handleUser = async (u: User) => {
    await setDbUser(db, u);
    setUser(u);
  };

  return (
    <View style={{
      padding: 10
    }}>
      <Modal visible={!networkState.isInternetReachable}>
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Text style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "red"
          }}>
            No Internet Connection
          </Text>
        </View>
      </Modal>

      <UserModal
        visible={!user}
        onSubmit={handleUser}
      />

      {user && (
        <Text style={{
          marginBottom: 20
        }}>
          Hello, {user.name} ({user.rollNo})!
        </Text>
      )}

      <View style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <TouchableOpacity disabled={!connected} onPress={handleGoing}>
          <View style={{
            width: 200,
            height: 200,
            borderWidth: 2,
            borderColor: "skyblue",
            backgroundColor: "white",
            borderRadius: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: connected ? "5px 5px 10px rgba(96, 173, 255, 0.2)" : "",
            opacity: !connected ? 0.5 : 1
          }}>
            <Feather size={40} name="bluetooth" />
            <Text style={{
              fontSize: 16,
              fontWeight: "bold"
            }}>
              {
                isGoing ? "Stop" : "Start"
              }
            </Text>
            <Text style={{
              fontSize: 16,
              fontWeight: "bold",
              color: connected ? "green" : "red"
            }}>
              {
                connected ? "Connected" : "Disconnected"
              }
            </Text>
          </View>
        </TouchableOpacity>

        <LineChart
          style={{
            marginTop: 40,
            width: "100%"
          }}
          bezier
          data={{
            labels: new Array(19).fill("").concat("Now"),
            datasets: [{
              data: data.slice(-20).map((d: InsertValue) => d.value)
            }]
          }}
          width={screenWidth - 20}
          height={200}
          yAxisSuffix='V'
          yAxisInterval={1}
          fromZero={true}
          withDots={false}
          withInnerLines={false}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            backgroundGradientFrom: "#Fefefe",
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: "#ffffff",
            backgroundGradientToOpacity: 0.5,
            strokeWidth: 2, // optional, default 3
            barPercentage: 0.5,
            useShadowColorFromDataset: false // optional
          }}
        />
      </View>
    </View>
  );
}

function checkConn() {
  //@ts-ignore
  return 1 === '1';
}