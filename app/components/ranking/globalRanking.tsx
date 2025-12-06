import { DataTable } from 'react-native-paper';
import { styleGlobalRanking } from '@/styles/stylesRanking';
import { FlatList } from 'react-native';
import HeaderRanking from './headerRanking';
import { GlobalRankingResponse, User } from '@/api/src';

interface RankingGlobalProps {
    data?: GlobalRankingResponse,
    indexCurrent?: number,
}

export default function RankingGlobal({ data, indexCurrent } : RankingGlobalProps) {
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

        
            <HeaderRanking styleRanking={styleGlobalRanking}></HeaderRanking>

            {data?.users && data.users.length > 0 && (
                data.users.slice(0, 15).map((item : User, index : number) => (
                    <ItemGlobalRanking
                        key={index + 1}
                        index={index + 1}
                        item={item}
                        indexCurrent={indexCurrent}
                    ></ItemGlobalRanking>
                ))
            )}
        </DataTable>
    )
}

interface ItemRankingInterface {
    index : number;
    item : User;
    indexCurrent : number;
}

function ItemGlobalRanking({ index, item, indexCurrent } : ItemRankingInterface) {

    if(index != indexCurrent){
        return (
            <DataTable.Row style={styleGlobalRanking.row}>
                <DataTable.Cell
                    textStyle={styleGlobalRanking.rowText}>#{index}</DataTable.Cell>
                <DataTable.Cell
                    textStyle={styleGlobalRanking.rowText}>{item.name}</DataTable.Cell>
                <DataTable.Cell 
                    numeric
                    textStyle={styleGlobalRanking.rowText}>{item.score}</DataTable.Cell>
            </DataTable.Row>
        )
    }
    else {
        return (
            <DataTable.Row style={styleGlobalRanking.row}>
                <DataTable.Cell
                    textStyle={styleGlobalRanking.rowTextMine}>#{index}</DataTable.Cell>
                <DataTable.Cell
                    textStyle={styleGlobalRanking.rowTextMine}>{item.name}</DataTable.Cell>
                <DataTable.Cell 
                    numeric
                    textStyle={styleGlobalRanking.rowTextMine}>{item.score}</DataTable.Cell>
            </DataTable.Row>
        )
    }
}