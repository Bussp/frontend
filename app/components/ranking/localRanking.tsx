import { DataTable } from 'react-native-paper';
import { styleLocalRanking } from '@/styles/stylesRanking';
import HeaderRanking from './headerRanking';
import { UserRankingResponse, User } from '@/api/src';

interface LocalRankingInterface {
    rankingData?: UserRankingResponse,
    userData?: User,
    isLoading?: boolean,
}

export default function RankingLocal({ userData, rankingData, isLoading } : LocalRankingInterface) {
    return (
        <DataTable style={styleLocalRanking.container}>
            <HeaderRanking styleRanking={styleLocalRanking}></HeaderRanking>
            {(
                <ItemLocalRanking 
                    position={rankingData.position} 
                    name={userData.name}
                    score={userData.score}
                />
            )}
        </DataTable>
    )
}

interface ItemLocalRanking {
    position : number,
    name : string,
    score : number,
}

function ItemLocalRanking({ position, name, score } : ItemLocalRanking ) {
    return (
        <DataTable.Row style={styleLocalRanking.row}>
            <DataTable.Cell
                textStyle={styleLocalRanking.rowText}>#{position}</DataTable.Cell>
            <DataTable.Cell
                textStyle={styleLocalRanking.rowText}>{name}</DataTable.Cell>
            <DataTable.Cell 
                numeric
                textStyle={styleLocalRanking.rowText}>{score}</DataTable.Cell>
        </DataTable.Row>
    )
}