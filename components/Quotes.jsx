import { View, Text, Button } from "react-native";

export default function Quotes()
{
    return (
        <View>
            <Text>Hallo meine Freunde!</Text>
            <Button title="Weiter" onPress={() => alert("Karsten leckt Eier")} />
        </View>
    );
}