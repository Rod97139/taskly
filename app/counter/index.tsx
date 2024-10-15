import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { theme } from "../../theme";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Duration, intervalToDuration, isBefore } from "date-fns";
import { TimeSegment } from "../../components/TimeSegment";

// 10 seconds from now
const timestamp = Date.now() + 10 * 1000;

type CountdownStatus = {
  isOverdue: boolean;
  distance: Duration;
};

export default function CounterScreen() {
  const [status, setStatus] = useState<CountdownStatus>({
    isOverdue: false,
    distance: {},
  });

  console.log("status", status);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const isOverdue = isBefore(timestamp, Date.now());
      const distance = intervalToDuration(
        isOverdue
          ? { start: timestamp, end: Date.now() }
          : { start: Date.now(), end: timestamp },
      );
      setStatus({ isOverdue, distance });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const scheduleNotification = async () => {
    const result = await registerForPushNotificationsAsync();

    if (result === "granted") {
      console.log("result", result);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "I'm a notification from your app! 📨",
        },
        trigger: {
          seconds: 5,
        },
      });
    } else {
      Alert.alert(
        "Unable to schedule notification",
        "Enable the notifications permission for Expo Go in settings",
      );
    }
  };

  return (
    <View style={[styles.container, status.isOverdue ? styles.containerLate : undefined]}>
      {status.isOverdue ? (
        <Text style={[styles.heading, status.isOverdue ? styles.whiteText : undefined]}>Things overdue by</Text>
      ) : (
        <Text style={[styles.heading, status.isOverdue ? styles.whiteText : undefined]}>Things due in...</Text>
      )}
      <View style={styles.row}>
        <TimeSegment unit="Days" number={status.distance.days ?? 0} textStyle={status.isOverdue ? styles.whiteText : undefined}/>
        <TimeSegment unit="Hours" number={status.distance.hours ?? 0} textStyle={status.isOverdue ? styles.whiteText : undefined}/>
        <TimeSegment unit="Minutes" number={status.distance.minutes ?? 0} textStyle={status.isOverdue ? styles.whiteText : undefined}/>
        <TimeSegment unit="Seconds" number={status.distance.seconds ?? 0} textStyle={status.isOverdue ? styles.whiteText : undefined}/>
      </View>
      <TouchableOpacity
        onPress={scheduleNotification}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>I've done the thing!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  containerLate: {
    backgroundColor: theme.colorRed,
  },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  whiteText: {
    color: theme.colorWhite,
  },

});
