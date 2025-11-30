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
        fontWeight: "bold",
        borderBottomWidth: 2,
        borderBottomColor: "#000",
    },
    row: {
        borderBottomWidth: 0,
    },
    rowHeader : {
        borderBottomWidth: 0,
        fontWeight: "bold",
    }
})