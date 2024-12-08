import { firestore } from "@/lib/firebase";
import { Score } from "@/lib/storage";
import { useIsFocused } from "@react-navigation/native";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function Leaderboard() {
  const [data, setData] = useState<Score[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) return;

    const data = [] as Score[];

    getDocs(query(collection(firestore, "scores"), orderBy("value", "desc"), limit(100)))
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        data.push({
          name: doc.data().name,
          rollNo: doc.id,
          value: doc.data().value
        });
      });
    }).then(() => {
      setData(data);
      console.log("Leaderboard data fetched: ", data.length);
    })
    .catch((e: Error) => {
      console.log("Error fetching leaderboard data:", e.message);
    });;
  }, [isFocused]);

  return (
    <ScrollView style={{
      padding: 10
    }}>
      <View style={{
        display: "flex",
        flexDirection: "column",
        gap: 5,
        marginTop: 10
      }}>
        {data.map((item, idx) => (
          <View key={item.rollNo} style={{
            padding: 10,
            backgroundColor: "white",
            display: "flex",
            flexDirection: "row",
            gap: 10,
            justifyContent: "space-between"
          }}>
            <View style={{
              display: "flex",
              flexDirection: "row",
              gap: 10
            }}>
              <Text>
                {
                  idx + 1
                }
              </Text>
              <Text>
                {item.name}
              </Text>
              <Text style={{
                opacity: 0.75,
                fontSize: 12
              }}>
                ({item.rollNo})
              </Text>
            </View>

            <Text>
              {item.value.toFixed(3)}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// const data = [
//   {
//     id: "110124030",
//     name: "Ahilan",
//     points: 95
//   },
//   {
//     id: "110124024",
//     name: "Mohkith Balaji",
//     points: 63
//   },
//   {
//     id: "112122025",
//     name: "Devika S",
//     points: 62
//   },
//   {
//     id: "110126025",
//     name: "Hiba R",
//     points: 62
//   },
//   {
//     id: "213124025",
//     name: "Benihin J",
//     points: 60
//   },
//   {
//     id: "110124029",
//     name: "Dash Skndash",
//     points: 51
//   },
//   {
//     id: "110124022",
//     name: "Sharan R",
//     points: 48
//   },
//   {
//     id: "110114025",
//     name: "Ambrish Mohan",
//     points: 40
//   },
//   {
//     id: "110124920",
//     name: "Vikas Sairam",
//     points: 32
//   },
// ];
