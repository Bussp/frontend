import { StyleSheet } from "react-native"

export const stylesRanking = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold"
    }
})

export const styleGlobalRanking = StyleSheet.create({
    container: {
        borderRadius: 2,
        backgroundColor: "#D9D9D9",
        color: "#000",
        justifyContent: "center",
        flexDirection: "column",
        width: "95%",
    },
    title: {
        backgroundColor: "#D9D9D9",
    },
})

export const styleGlobalRankingLine = StyleSheet.create({
    row: {
        borderBottomWidth: 0,
    }
})

export const styleGlobalRankingHeader = StyleSheet.create({
    container: {
        borderBottomWidth: 2,
        borderBottomColor: "#000",
        color: "#000",
    }
})