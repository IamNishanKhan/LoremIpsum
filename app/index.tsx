import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { registerForPushNotificationsAsync, initializeNotificationListeners } from "./notificationService";

export default function Index() {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>("");

  useEffect(() => {
    console.log("[DEBUG] Index useEffect triggered");

    // Register for push notifications and get token
    registerForPushNotificationsAsync()
      .then((token) => {
        console.log("[DEBUG] Token set in state:", token);
        setExpoPushToken(token);
      })
      .catch((error: any) => {
        console.log("[DEBUG] Error in useEffect:", error);
        setExpoPushToken(`${error}`);
      });

    // Initialize global notification listeners
    const cleanup = initializeNotificationListeners();

    // Cleanup listeners on unmount
    return cleanup;
  }, []);

  // Redirect to /auth/welcome
  return <Redirect href="/auth/welcome" />;
}
