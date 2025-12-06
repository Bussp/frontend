import { StyleSheet } from "react-native"

export const styleScroll = StyleSheet.create({
    container : {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})

export const stylesRanking = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        gap: 15,
        marginTop : 10,
        marginBottom : 10,
        paddingBottom: 20,
    },
    title: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold"
    },
    loading: {
        borderRadius: 6,
        backgroundColor: "#D9D9D9",
        color: "#000",
        justifyContent: "center",
        flexDirection: "column",
        width: "95%",
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
    rowTextMine : {
        color: "#0D8694",
    },
    rowHeader : {
        borderBottomWidth: 0,
    },
    rowHeaderText : {
        fontWeight: "bold",
    }
})

export const styleLocalRanking = StyleSheet.create({
    container: {
        borderRadius: 6,
        color: "#000",
        justifyContent: "center",
        flexDirection: "column",
        width: "95%",
    },
    rowHeader : {
        borderRadius: 6,
        backgroundColor: "#EDB137"
    },
    rowHeaderText : {
        fontWeight: "bold",
    },
    row: {
        borderBottomWidth: 0,
    },
    rowText : {
        fontFamily: "Comics Sans",
        color: "#0D8694",
    },
})