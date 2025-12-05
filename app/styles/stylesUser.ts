import { StyleSheet } from "react-native"

export const stylesUser = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#b4cacf",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    icon: {
        height: 140,
        width: 140,
        margin: 16,
        marginTop: -70,
        elevation: 5
    },
    beautifulBody: {
        display: "flex",
        flexDirection: "column",

        alignItems: "center",
        marginTop: 110,
        backgroundColor: "#FFF",
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        elevation: 5
    },
    username: {
        fontSize: 24,
        fontWeight: "bold"
    },
    scoreContainer: {
        borderRadius: 10,
        height: 90,
        width: "auto",
        marginTop: 20,
        paddingBottom: 10,
        paddingLeft: 16,
        paddingRight: 20,
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center"    
    }
})