import { FlatList, View, ListRenderItem, Text, ScrollView } from "react-native";
import { DataTable } from 'react-native-paper';
import { styleGlobalRanking, styleGlobalRankingHeader, styleGlobalRankingLine } from "../styles/stylesRanking";

interface RankingInterface {
    position : number,
    name : string,
    score : number
}

export default function RankingGlobal({ DataArray }: { DataArray: RankingInterface[] }) {
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

            {DataArray.map((item) => (
                <DataTable.Row key={item.position.toString()} style={styleGlobalRankingLine.row}>
                    <DataTable.Cell>#{item.position}</DataTable.Cell>
                    <DataTable.Cell>{item.name}</DataTable.Cell>
                    <DataTable.Cell numeric>{item.score}</DataTable.Cell>
                </DataTable.Row>
            ))}
        </DataTable>
    )
}