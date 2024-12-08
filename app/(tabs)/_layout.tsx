import { Feather, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: true
    }}>
      <Tabs.Screen
        name="(home)/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <FontAwesome5 name="home" color={color} />
        }}
      />

      <Tabs.Screen
        name="activity/index"
        options={{
          title: "Activity",
          tabBarIcon: ({ color }) => <Feather name="activity" color={color} />
        }}
      />

      <Tabs.Screen
        name="leaderboard/index"
        options={{
          title: "Leaderboard",
          tabBarIcon: ({ color }) => <FontAwesome5 name="medal" color={color} />
        }}
      />
    </Tabs>
  );
}
