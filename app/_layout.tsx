import { initDb } from "@/lib/storage";
import { Stack } from "expo-router";
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="test.db" onInit={async (db) => initDb(db)}>
      <Stack screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false
          }}
        />
      </Stack>
    </SQLiteProvider>
  );
}
