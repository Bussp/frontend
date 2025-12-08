import { stylesUser } from '@/styles/stylesUser';
import { Alert, Image, ImageSourcePropType, Text, View } from 'react-native';

import { HistoryResponse, type TripHistoryEntry, useCurrentUser, useLogout, type User, useUserHistory } from '@/api/src';
import { useAuth } from '@/api/src/providers/AuthProvider';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator, Button, DataTable, Divider, Surface } from 'react-native-paper';
import { removeSearch } from '@/api/src/utils/removeSearchHistory';

const icons: ImageSourcePropType[] = [
    require("@/assets/images/user_icons/1.png"),
    require("@/assets/images/user_icons/2.png"),
    require("@/assets/images/user_icons/3.png"),
    require("@/assets/images/user_icons/4.png"),
    require("@/assets/images/user_icons/5.png"),
    require("@/assets/images/user_icons/6.png"),
];

const UserFieldTitle = ({ title }: { title: string }) => <>
    <Text style={stylesUser.userFieldTitle}>{title}</Text>
    <Divider bold style={stylesUser.divider} />
</>;

const UserScore = ({ data }: { data: User | undefined }) => <>
    <Surface style={stylesUser.scoreContainer}>
        <Text style={{ fontSize: 56, marginRight: 24 }}>🚍</Text>
        <View style={{ display: "flex", flexDirection: "column", paddingTop: 10 }}>
            <Text style={{ fontSize: 26, fontWeight: "bold" }}>{data?.score} gCO2</Text>
            <Text>totais</Text>
        </View>
    </Surface>
</>;

const UserHistory = ({ histData }: { histData: HistoryResponse | undefined }) => <>
    <Surface style={stylesUser.userHistoryTable}>
        <DataTable>
            <DataTable.Row>
                <DataTable.Cell style={{ flex: 1.8 }}>Data</DataTable.Cell>
                <DataTable.Cell style={{ flex: 1.8 }}>Linha</DataTable.Cell>
                <DataTable.Cell numeric>gCO2</DataTable.Cell>
            </DataTable.Row>

            {histData?.trips
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map((item : TripHistoryEntry, index) => (
                    <DataTable.Row key={index + 1}>
                        <DataTable.Cell style={{ flex: 1.8 }}>{item.date.slice(0, 10)}</DataTable.Cell>
                        <DataTable.Cell style={{ flex: 1.8 }}>{item.route.bus_line}</DataTable.Cell>
                        <DataTable.Cell numeric>{item.score}</DataTable.Cell>
                    </DataTable.Row>
                ))
            }
            {(histData?.trips.length || 0) > 10 && <DataTable.Row style={{ alignItems: "center" }}><Text>...</Text></DataTable.Row>}
        </DataTable>
    </Surface>
</>;

export default function Profile() {
    const { data, isLoading } = useCurrentUser({ enabled: true });
    const { data: histData } = useUserHistory();
    const { mutate: logoutMutation } = useLogout();
    const { logout: authLogout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        Alert.alert(
          "Logout",
          "Tem certeza que deseja sair?",
          [
            {
              text: "Cancelar",
              style: "cancel",
            },
            {
              text: "Sair",
              style: "destructive",
              onPress: async () => {
                // Clear auth state first
                await authLogout();
                // Clear React Query cache
                logoutMutation();
                // Navigation will be handled by _layout.tsx auth guard
                // Remove history cache
                await removeSearch();
              },
            },
          ]
        );
      };

    if (isLoading) {
        return (
            <View style={stylesUser.container}>
                <ActivityIndicator size="large" color="#0D8694" />
            </View>
        );
    }

    let iconId = 0;
    for (const c of data?.name || []) {
        iconId += c.charCodeAt(0);
    }
    iconId = iconId % 6;

    return (
        <View style={stylesUser.container}>
            <ScrollView style={stylesUser.scrollView} contentContainerStyle={stylesUser.beautifulBody}>
                
                <Image style={stylesUser.icon} source={icons[iconId]}></Image>
                <Text style={stylesUser.username}>{data?.name}</Text>
                
                <UserFieldTitle title='Economia' />
                <UserScore data={data} />

                <UserFieldTitle title='Viagens passadas' />
                <UserHistory histData={histData} />

                <UserFieldTitle title='Outras opções' />
                <Button icon="logout" onPress={handleLogout}>Logout</Button>
            </ScrollView>
        </View>
    );
}