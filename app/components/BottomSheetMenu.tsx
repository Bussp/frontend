import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import BottomSheet, { BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";



export default function BottomSheetMenu() {
    const sheetRef = useRef<BottomSheet>(null);
    
    const snapPoints = ["13%", "90%"];

    const [lineSearch, onChangeLineSearch] = useState("")

    return (
        <BottomSheet 
            ref={sheetRef} 
            snapPoints={snapPoints}
            keyboardBlurBehavior='restore'
            android_keyboardInputMode='adjustPan'
        >
            <BottomSheetView>
                <View style={styles.containerSearch}>
                    <FontAwesome6 name={"magnifying-glass"} size={24} color="gray" />
                    <BottomSheetTextInput
                        editable
                        maxLength={8}
                        onChangeText={text => onChangeLineSearch(text)}
                        value={lineSearch}
                        placeholder="Procurar linha..."
                        style={styles.textInput}
                    />
                </View>
                <View style={styles.container}>
                    <Text style={styles.title}>Suas linhas usuais</Text>
                </View>
                <View style={{marginVertical: 10}}>
                    <View style={styles.commonLine}>
                        <Text style={{fontSize: 17.5, fontWeight: 'bold'}}>8082-10</Text>
                    </View>
                    <View style={styles.commonInfo}>
                        <Text>8:21 - Saída do Metrô Butantã</Text>
                        <Text>8:49 - Ponto da rua blablabla</Text>
                        <Text>9:08 - Ponto da rua blablabla</Text>
                        <Text>mais...</Text>
                    </View>
                </View>
            </BottomSheetView>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    containerSearch: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginHorizontal: 25,
        marginVertical: 5,
        backgroundColor: 'lightgray',
        borderRadius: 25,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        margin: 25,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    textInput: {
        margin: 5,
        paddingHorizontal: 15,
        width: '70%',
    },
    commonLine: {
        width: '100%',
        paddingVertical: 10,
        backgroundColor: '#FFBB11',
        alignItems: 'center',
        justifyContent: 'center',
    },
    commonInfo: {
        width: '100%',
        paddingVertical: 20,
        backgroundColor: 'lightgray',
        alignItems: 'center',
        justifyContent: 'center',
    },
});