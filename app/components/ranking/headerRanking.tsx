import { stylesRanking } from "@/styles/stylesRanking"
import { DataTable } from "react-native-paper"

interface styleRankingProps {
    styleRanking : any
}

export default function HeaderRanking({ styleRanking } : styleRankingProps) {
    return (
        <DataTable.Row 
            style={styleRanking.rowHeader}>
            <DataTable.Cell 
                textStyle={styleRanking.rowHeaderText}>Rank</DataTable.Cell>
            <DataTable.Cell 
                textStyle={styleRanking.rowHeaderText}>Nome</DataTable.Cell>
            <DataTable.Cell 
                numeric 
                textStyle={styleRanking.rowHeaderText}>Pontos</DataTable.Cell>
        </DataTable.Row>
    )
}