import { StyleSheet } from "react-native"

export const stylesUser = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#d5e1e3",
    },
    scrollView: {
        width: "100%",
    },
    icon: {
        height: 140,
        width: 140,
        margin: 16,
        marginTop: -90,
        elevation: 5
    },
    beautifulBody: {
        display: "flex",
        flexDirection: "column",

        alignItems: "center",
        marginTop: 110,
        backgroundColor: "#FFF",
        width: '100%',
        minHeight: '100%',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        elevation: 5,
        paddingBottom: 160,
    },
    username: {
        fontSize: 24,
        fontWeight: "bold"
    },
    userFieldTitle: { 
        fontSize: 20, 
        marginTop: 40
    },
    divider: { 
        width: "70%", 
        marginTop: 8,
        marginBottom: 20 
    },
    scoreContainer: {
        backgroundColor: "#faedd7",
        borderRadius: 10,
        height: 90,
        width: "auto",
        paddingBottom: 10,
        paddingLeft: 16,
        paddingRight: 20,
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center"    
    },
    userHistoryTable: { 
        backgroundColor: "#faedd7",
        width: "86%", 
        borderRadius: 10 
    },
})