import ActivityCard from '@/components/ActivityCard';
import { Collection, getAllCollections } from '@/lib/storage';
import { useIsFocused } from '@react-navigation/native';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'

export default function ActivityScreen() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const isFocused = useIsFocused();
  const db = useSQLiteContext();

  useEffect(() => {
    if (!isFocused) return;

    getAllCollections(db).then(res => {
      setCollections(res);
    }).catch(e => {
      console.error(e);
    });
  }, [isFocused]);

  return (
    <ScrollView style={{
      padding: 10
    }}>
      <View style={{
        display: "flex",
        width: "50%",
        gap: 20
      }}>
        {collections.map((c: Collection) => (
          <ActivityCard key={c.id} collection={c} />
        ))}
      </View>
    </ScrollView>
  )
}
