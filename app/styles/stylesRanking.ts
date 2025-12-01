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
        borderRadius: 6,
        backgroundColor: "#D9D9D9",
        color: "#000",
        justifyContent: "center",
        flexDirection: "column",
        width: "95%",
    },
    title: {
        fontWeight: "bold",
        borderBottomWidth: 2,
        borderBottomColor: "#000",
    },
    titleText: {
        color: "#000",
        fontSize: 15,
        fontWeight: "bold",
    },
    row: {
        borderBottomWidth: 0,
    },
    rowText : {
        fontFamily: "Comics Sans"
    },
    rowHeader : {
        borderBottomWidth: 0,
    },
    rowHeaderText : {
        fontWeight: "bold",
    }
})