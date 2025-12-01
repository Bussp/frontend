import { DataTable } from 'react-native-paper';
import { styleGlobalRanking } from "../styles/stylesRanking";
import { GlobalRankResponse, RankUserRequest, RankUserResponse } from '@/api/src/models/ranking.types';

export default function RankingLocal({ Data } : {Data : RankUserResponse}) {
    return (
        <DataTable style={styleGlobalRanking.container}>
            <DataTable.Header style={styleGlobalRanking.container}>
                <DataTable.Title numeric>Rank</DataTable.Title>
                <DataTable.Title>Nome</DataTable.Title>
                <DataTable.Title numeric>Pontos</DataTable.Title>
            </DataTable.Header>

            <DataTable.Row>
                <DataTable.Cell numeric>#{Data.position}</DataTable.Cell>
                <DataTable.Cell>{Data.position}</DataTable.Cell>
                <DataTable.Cell numeric>{item.score}</DataTable.Cell>
            </DataTable.Row>
        </DataTable>
    )
}