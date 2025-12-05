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
        margin: 20,
        marginTop: -70,
        elevation: 5
    },
    beautifulBody: {
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
    }
})