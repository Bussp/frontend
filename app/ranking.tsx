// app/ranking.tsx (ajuste o caminho se for outro)

import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { stylesRanking } from "../styles/stylesRanking";
import RankingGlobal from "./components/globalRanking";

import type { GlobalRankingResponse } from "@/api/src/models/ranking.types";
import { getGlobalRanking } from "@/api/src/requests/ranking";
import type { User } from "../api/src/models/users.types";

export default function Ranking() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<User[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setErr(null);

        // getGlobalRanking(): Promise<GlobalRankingResponse>
        const response: GlobalRankingResponse = await getGlobalRanking();

        // Ordenar usuários por score DESC
        const sortedUsers = [...response.users].sort((a, b) => b.score - a.score);

        setData(sortedUsers);
      } catch (error: any) {
        console.error(error);
        setErr("Erro ao carregar ranking.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={stylesRanking.container}>
        <ActivityIndicator />
      </View>
    );
  }

  if (err) {
    return (
      <View style={stylesRanking.container}>
        <Text style={stylesRanking.title}>{err}</Text>
      </View>
    );
  }

  return (
    <View style={stylesRanking.container}>
      <RankingGlobal users={data} />
    </View>
  );
}
