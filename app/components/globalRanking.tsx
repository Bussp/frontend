import { DataTable } from 'react-native-paper';
import { styleGlobalRanking } from "../styles/stylesRanking";
import { GlobalRankResponse } from '@/api/src/models/ranking.types';

export default function RankingGlobal({ DataArray }: { DataArray: GlobalRankResponse[] }) {
    return (
        <DataTable 
            style={styleGlobalRanking.container}>
            <DataTable.Header
                style={styleGlobalRanking.title}>
                <DataTable.Title>{null}</DataTable.Title>
                <DataTable.Title 
                    textStyle={styleGlobalRanking.titleText}>Ranking Global</DataTable.Title>
                <DataTable.Title numeric>{null}</DataTable.Title>
            </DataTable.Header>

            <DataTable.Row 
                style={styleGlobalRanking.rowHeader}>
                <DataTable.Cell 
                    textStyle={styleGlobalRanking.rowHeaderText}>Rank</DataTable.Cell>
                <DataTable.Cell 
                    textStyle={styleGlobalRanking.rowHeaderText}>Nome</DataTable.Cell>
                <DataTable.Cell 
                    numeric 
                    textStyle={styleGlobalRanking.rowHeaderText}>Pontos</DataTable.Cell>
            </DataTable.Row>

            {DataArray.map((item : GlobalRankResponse, index) => (
                <DataTable.Row key={index + 1} style={styleGlobalRanking.row}>
                    <DataTable.Cell
                        textStyle={styleGlobalRanking.rowText}>#{index + 1}</DataTable.Cell>
                    <DataTable.Cell
                        textStyle={styleGlobalRanking.rowText}>{item.name}</DataTable.Cell>
                    <DataTable.Cell 
                        numeric
                        textStyle={styleGlobalRanking.rowText}>{item.score}</DataTable.Cell>
                </DataTable.Row>
            ))}
        </DataTable>
    )
}