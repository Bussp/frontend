import { View } from 'react-native';
import { stylesRanking } from '../styles/stylesRanking';
import RankingGlobal from "./components/globalRanking";

import { GlobalRankResponse } from '@/api/src/models/ranking.types';
import { useState } from 'react';

const test : GlobalRankResponse[] = [
    {
        name: "Ana",
        email: "ana@usp.br",
        score: 310,
    },
    {
        name: "Luiza",
        email: "luiza@usp.br",
        score: 290,
    },
    {
        name: "Clara",
        email: "clara@usp.br",
        score: 100,
    },
]

export default function Ranking() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<GlobalRankResponse[]>([]);
    const [err, setErr] = useState<string | null>(null);

    {/*
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try{
                const {data : response} = getGlobalRank();
                setData(response);
            }
            catch (err) {
                console.error(err.message);
            }
        }
        fetchData();
    }, []);
    */}

    return (
        <View style={stylesRanking.container}>
            <RankingGlobal DataArray={test}></RankingGlobal>
        </View>
    );
}