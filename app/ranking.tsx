import { useCurrentUser, useGlobalRanking, useUserRanking } from '@/api/src';
import { stylesRanking } from '@/styles/stylesRanking';
import { RefreshControl, ScrollView, View } from 'react-native';
import { ActivityIndicator, DataTable } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import RankingGlobal from "./components/ranking/globalRanking";
import RankingLocal from './components/ranking/localRanking';

export default function Ranking() {

    const { 
        data : rankingData, 
        isLoading :rankingIsLoading,
        error : rankingError,
        isError : rankingIsError,
        status : rankingStatus,
    } = useUserRanking();
    const { 
        data : userData, 
        isLoading : userIsLoading } = useCurrentUser();
    const { 
        data : globalData, 
        isLoading : globalIsLoading, 
        refetch,
        error,
        isError,
        status
    } = useGlobalRanking();

    if ( rankingIsLoading || userIsLoading || globalIsLoading ) {
        return(
            <View style={stylesRanking.loading}>
                <ActivityIndicator size='large' color='#0D8694'></ActivityIndicator>
            </View>
        ) 
    }

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor : "#fff",
        }}>
            <ScrollView
                contentContainerStyle={stylesRanking.container}
                refreshControl={
                    <RefreshControl
                        refreshing={globalIsLoading}
                        onRefresh={refetch}
                    />
                }>
                <RankingLocal 
                    userData={userData} 
                    rankingData={rankingData} 
                    isLoading={userIsLoading}></RankingLocal>
                <RankingGlobal 
                    data={globalData} 
                    indexCurrent={rankingData?.position}></RankingGlobal>
            </ScrollView>
        </SafeAreaView>
    );
}