import { Collection, getCollectionValues, Value } from '@/lib/storage';
import { Ionicons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useState } from 'react'
import { Dimensions, Text, TouchableOpacity, View } from 'react-native'
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function ActivityCard({
  collection
}: {
  collection: Collection
}) {
  const db = useSQLiteContext();

  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Value[]>([]);

  const toggleOpen = async () => {
    if (values.length === 0 && !open) {
      const _values = await getCollectionValues(db, collection.id);
      setValues(_values);
    }

    setOpen(open => !open);
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleOpen}>
        <View style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          width: "100%"
        }}>
          <Text>
            {open ?
              <Ionicons name='caret-up-circle-outline' size={20} /> :
              <Ionicons name='caret-down-circle-outline' size={20} />
            }
          </Text>
          <Text>
            {timeAgo(collection.timestamp)}
          </Text>
          <Text style={{
            fontSize: 12,
            opacity: .5
          }}>
            {new Date(collection.timestamp).toLocaleDateString()}
          </Text>
          <Text style={{
            fontSize: 12,
            opacity: 0.5
          }}>
            {new Date(collection.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      </TouchableOpacity>

      {open && values.length > 0 && (
        <LineChart
          style={{
            width: "100%"
          }}
          bezier
          data={{
            labels: [values[0].timestamp.toString()].concat(new Array(values.length - 2).fill(""), values[values.length - 1].timestamp.toString()),
            datasets: [{
              data: values.map(d => d.value)
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
      )}
    </View>
  )
}

function timeAgo(epochTime: Date) {
  const now = Date.now();
  const diff = now - new Date(epochTime).valueOf();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (seconds < 60) {
      return `${seconds}s ago`;
  } else if (minutes < 60) {
      return `${minutes}m ago`;
  } else if (hours < 24) {
      return `${hours}h ago`;
  } else if (days < 30) {
      return `${days}d ago`;
  } else if (months < 12) {
      return `${months}mo ago`;
  } else {
      return `${years}y ago`;
  }
}
