import { Image, ImageSourcePropType, Text, View } from 'react-native';
import { stylesUser } from './styles/stylesUser';

import { useCurrentUser, useUserHistory } from '@/api/src';
import { ActivityIndicator, Divider, Surface } from 'react-native-paper';

const icons: ImageSourcePropType[] = [
    require("@/assets/images/user_icons/1.png"),
    require("@/assets/images/user_icons/2.png"),
    require("@/assets/images/user_icons/3.png"),
    require("@/assets/images/user_icons/4.png"),
    require("@/assets/images/user_icons/5.png"),
    require("@/assets/images/user_icons/6.png"),
];

export default function User() {
    const { data, isLoading, isError, error } = useCurrentUser({ enabled: true });
    const { data: histData } = useUserHistory();
    console.log(data);
    console.log(histData);

    if (isLoading) return <ActivityIndicator />;
    if (isError) return <Text> {error.message} </Text>;

    let iconId = 0;
    for (const c of data?.name || []) {
        iconId += c.charCodeAt(0);
    }
    iconId = iconId % 6;

    return (
        <View style={stylesUser.container}>
            <Surface style={stylesUser.beautifulBody}>
                <Image style={stylesUser.icon} source={icons[iconId]}></Image>
                <Text style={stylesUser.username}>{data?.name}</Text>
                
                <Text style={{ fontSize: 20, marginTop: 30 }}>Score</Text>
                <Divider bold style={{ width: "70%", marginTop: 8 }} />
                <Surface style={stylesUser.scoreContainer}>
                    <Text style={{ fontSize: 56, marginRight: 24 }}>🚍</Text>
                    <View style={{ display: "flex", flexDirection: "column", paddingTop: 10 }}>
                        {/* <Text style={{ fontSize: 26, fontWeight: "bold" }}>{data?.score} pontos</Text> */}
                        <Text style={{ fontSize: 26, fontWeight: "bold" }}>6 pontos</Text>
                        <Text>totais</Text>
                    </View>
                </Surface>
            </Surface>
        </View>
    );
}