// components/RankingGlobal.tsx (ou onde ele estiver)

import { DataTable } from 'react-native-paper';
import type { User } from '../../api/src/models/users.types';
import { styleGlobalRanking } from "../../styles/stylesRanking";

export default function RankingGlobal({ users }: { users: User[] }) {
  return (
    <DataTable style={styleGlobalRanking.container}>
      <DataTable.Header style={styleGlobalRanking.title}>
        <DataTable.Title>{null}</DataTable.Title>
        <DataTable.Title textStyle={styleGlobalRanking.titleText}>
          Ranking Global
        </DataTable.Title>
        <DataTable.Title numeric>{null}</DataTable.Title>
      </DataTable.Header>

      <DataTable.Row style={styleGlobalRanking.rowHeader}>
        <DataTable.Cell textStyle={styleGlobalRanking.rowHeaderText}>Rank</DataTable.Cell>
        <DataTable.Cell textStyle={styleGlobalRanking.rowHeaderText}>Nome</DataTable.Cell>
        <DataTable.Cell numeric textStyle={styleGlobalRanking.rowHeaderText}>gCO2/km</DataTable.Cell>
      </DataTable.Row>

      {users.map((item, index) => (
        <DataTable.Row key={item.email ?? index} style={styleGlobalRanking.row}>
          <DataTable.Cell textStyle={styleGlobalRanking.rowText}>#{index + 1}</DataTable.Cell>
          <DataTable.Cell textStyle={styleGlobalRanking.rowText}>{item.name}</DataTable.Cell>
          <DataTable.Cell numeric textStyle={styleGlobalRanking.rowText}>{item.score}</DataTable.Cell>
        </DataTable.Row>
      ))}
    </DataTable>
  );
}
