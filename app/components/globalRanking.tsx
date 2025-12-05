import { DataTable } from 'react-native-paper';
import { styleGlobalRanking } from "../styles/stylesRanking";
import { useGlobalRanking, User } from '@/api/src';
import { FlatList } from 'react-native';

export default function RankingGlobal() {

    const { 
        data, 
        isLoading, 
        refetch,
        error,
        isError,
        status
    } = useGlobalRanking();

    // Debug completo
    //console.log('=== DEBUG RANKING ===');
    //console.log('status:', status);
    //console.log('isLoading:', isLoading);
    //console.log('isError:', isError);
    //console.log('error:', error);
    //console.log('data:', data);
    //console.log('====================');

    if (isLoading) {
        return (
            <DataTable style={styleGlobalRanking.container}>
                <DataTable.Header>
                    <DataTable.Title>{null}</DataTable.Title>
                    <DataTable.Title>Carregando...</DataTable.Title>
                    <DataTable.Title>{null}</DataTable.Title>
                </DataTable.Header>
            </DataTable>
        );
    }

    function imprime() {
        console.log(data?.users);
        return true;
    }

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

            {data?.users && data.users.length > 0 && imprime() && (
                <FlatList
                    data={data.users.slice(0, 10)}
                    renderItem={({ item, index } : ItemRankingInterface ) => (
                        <ItemGlobalRanking 
                            index={index + 1} 
                            item={item}
                        />
                    )}
                    refreshing={isLoading}
                    onRefresh={refetch}
                />
            )}
        </DataTable>
    )
}

interface ItemRankingInterface {
    index : number;
    item : User;
}

function ItemGlobalRanking({ index, item } : ItemRankingInterface) {
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