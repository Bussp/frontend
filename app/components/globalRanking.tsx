import { DataTable } from 'react-native-paper';
import { styleGlobalRanking, styleGlobalRankingHeader, styleGlobalRankingLine } from "../styles/stylesRanking";
import { GlobalRankResponse } from '@/api/src/models/ranking.types';

export default function RankingGlobal({ DataArray }: { DataArray: GlobalRankResponse[] }) {
    return (
        <DataTable style={styleGlobalRanking.container}>
            <DataTable.Header style={styleGlobalRankingHeader.container}>
                <DataTable.Title></DataTable.Title>
                <DataTable.Title>Ranking Global</DataTable.Title>
                <DataTable.Title numeric></DataTable.Title>
            </DataTable.Header>

            <DataTable.Row style={styleGlobalRankingLine.row}>
                <DataTable.Cell>Rank</DataTable.Cell>
                <DataTable.Cell>Nome</DataTable.Cell>
                <DataTable.Cell numeric>Pontos</DataTable.Cell>
            </DataTable.Row>

            {DataArray.map((item, index) => (
                <DataTable.Row key={index + 1} style={styleGlobalRankingLine.row}>
                    <DataTable.Cell>#{index + 1}</DataTable.Cell>
                    <DataTable.Cell>{item.name}</DataTable.Cell>
                    <DataTable.Cell numeric>{item.score}</DataTable.Cell>
                </DataTable.Row>
            ))}
        </DataTable>
    )
}