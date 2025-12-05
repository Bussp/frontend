import { ScrollView, View } from 'react-native';
import { stylesRanking } from './styles/stylesRanking';
import RankingGlobal from "./components/globalRanking";

export default function Ranking() {

    return (
        <View style={stylesRanking.container}>
            <RankingGlobal></RankingGlobal>
        </View>
    );
}