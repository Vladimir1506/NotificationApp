import {Alert, Button, View, Platform} from 'react-native';
import * as Notifications from 'expo-notifications';
import {useEffect} from "react";
import * as Constants from "expo-constants";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export default function App() {
    useEffect(() => {
        (async () => {
            const {status} = Notifications.getPermissionsAsync()
            if (status !== 'granted') {
                const {status} = Notifications.requestPermissionsAsync()
                if (status !== 'granted') {
                    // return Alert.alert('Permission required', 'Push notifications need to appropriate permissions')
                }
            }
            const projectId = 'fdee7f45-c68b-4d88-a980-96970baa1562'
            const token = await Notifications.getExpoPushTokenAsync({
                projectId
            })
            // console.log('token')
            // console.log(token)
            if (Platform.OS === 'android') {
                Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.DEFAULT
                })
            }
        })()
    }, []);

    useEffect(() => {
        console.log('===')
        const subscription = Notifications.addNotificationReceivedListener((not) => {
            console.log('recieved')
            console.log(not.request.content.data.data)
        })
        const subscription2 = Notifications.addNotificationResponseReceivedListener((not) => {
            console.log('response')
            console.log(not.notification.request.content.data.data)
        })
        return () => {
            console.log('removed')
            subscription.remove()
            subscription2.remove()
        }
    }, []);

    const pushNotifHandler = () => {
        fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "to": "ExponentPushToken[bCRw50Cg1UcjiNBc2qAotq]",
                "title": "hello",
                "body": "world"
            })
        })
    }
    const notifHandler = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "You've got mail! 📬",
                body: 'Here is the notification body',
                data: {data: 'goes here'},
            },
            trigger: {seconds: 1},
        });
    }
    return <View
        style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-around',
        }}>
        <Button
            title="Press to schedule a notification"
            onPress={notifHandler}/>
        <Button
            title="Send Push notification"
            onPress={pushNotifHandler}/>
    </View>
}
