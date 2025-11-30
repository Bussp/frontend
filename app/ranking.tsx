import { View, Text } from 'react-native';
import { stylesRanking } from './styles/stylesRanking';
import RankingGlobal from "./components/globalRanking";
import { PaperProvider } from 'react-native-paper';

const test = [
    {
        position : 1,
        name : "Lica",
        score : 230
    },
    {
        position : 2,
        name : "Mariana",
        score : 240
    },
    {
        position : 3,
        name : "Carolina",
        score : 250
    },
]

export default function Ranking() {
    return (
        <View style={stylesRanking.container}>
            <RankingGlobal DataArray={test}></RankingGlobal>
        </View>
    );
}