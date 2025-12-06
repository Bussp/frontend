import { addSearch, getRecentSearches } from '@/api/src/utils/searchHistory';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import BottomSheet, { BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from 'react-native-gesture-handler';
import { buscarLinha } from '../../scripts/apiSPTrans';

interface BottomSheetProps {
    setCurrentLine: (value: string | null) => void;
    setCurrentDirection: (value: number) => void;
    setIsCurrentLineCircular: (value: boolean) => void;
    onSheetChange?: (isExpanded: boolean) => void;
}

export type LineItem = {
    line: string;
    terminal: string;
    isCircular: boolean;
    direction: number;
}

const BottomSheetMenu: React.FC<BottomSheetProps> = ({setCurrentLine, setCurrentDirection, setIsCurrentLineCircular, onSheetChange}) => {
    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['13%', '80%'], []);
    const [lineSearch, setLineSearch] = useState("");
    const [lineSuggestions, setSuggestions] = useState<LineItem[]>([]);
    const [commonLines, setCommonLines] = useState<LineItem[]>([]);
    
    useEffect(() => {
    getRecentSearches().then((items: LineItem[]) => {
        setCommonLines(items);
    });
}, []);


    const handleLineSearchChange = async (text: string) => {
        setLineSearch(text);
        if(text) {
            const res = await buscarLinha(text);

            const items: LineItem[] = res.slice(0, 8).map(v => ({
                line: v.lt + '-' + v.tl,
                terminal: ((v.sl==1) ? v.tp : v.ts),
                isCircular: v.lc,
                direction: v.sl,
            }));

            setSuggestions(items);

        } else {
            setSuggestions([]);
        }
    };

    async function handleSuggestionPress(item: LineItem) {
        const itemTrim = item.line.trim();
        if(!itemTrim) return;
        
        const updated = await addSearch(item);
        setCommonLines(updated);

        setCurrentLine(item.line);
        setCurrentDirection(item.direction);
        setIsCurrentLineCircular(item.isCircular);
        setLineSearch(item.line + ' ' + item.terminal);
        setSuggestions([]);
        Keyboard.dismiss();
        sheetRef.current?.collapse();
    }

    const removeSelectedLine = () => {
        setCurrentLine(null);
        setCurrentDirection(1);
        setIsCurrentLineCircular(false);
        setLineSearch("");
        setSuggestions([]);
        Keyboard.dismiss();
        sheetRef.current?.collapse();
    }

    return (
        <BottomSheet    
            ref={sheetRef} 
            snapPoints={snapPoints}
            keyboardBehavior='extend'
            keyboardBlurBehavior='restore'
            enableDynamicSizing={false}
            android_keyboardInputMode='adjustPan'
            onChange={(index) => {
                onSheetChange?.(index === 1);
            }}
        >
            <BottomSheetView>
                <View style={styles.containerSearch}>
                    <FontAwesome6 name={"magnifying-glass"} size={24} color="gray" />
                    <BottomSheetTextInput
                        editable
                        maxLength={30}
                        onChangeText={text => handleLineSearchChange(text)}
                        value={lineSearch}
                        placeholder="Procurar linha..."
                        style={styles.textInput}
                    />
                    <TouchableOpacity onPress={removeSelectedLine}>
                        <Feather name={"x"} size={24} color="gray" />
                    </TouchableOpacity>
                    
                    {lineSearch.length > 0 &&
                        <FlatList
                            data={lineSuggestions}
                            keyboardShouldPersistTaps={'always'}
                            keyExtractor={(item) => item.line + ' ' + item.terminal + ' ' + item.direction}
                            renderItem={({ item }) => (
                                <View style={styles.itemRow}>
                                    <Text
                                        style={styles.suggestionCell}
                                        onPress={() => handleSuggestionPress(item)}
                                    >
                                        {item.line + ' ' + item.terminal}
                                    </Text>
                                </View>
                            )}
                            style={styles.suggestionList}
                        />
                    }
                </View>
                
                {commonLines.length > 0 &&
                <View style={styles.container}>
                    <Text style={styles.title}>Suas buscas recentes</Text>
                </View>
                }
                <View>
                    <FlatList
                        data={commonLines}
                        keyboardShouldPersistTaps={'always'}
                        keyExtractor={(item) => item.line + ' ' + item.terminal + ' ' + item.direction}
                        renderItem={({ item }) => (
                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                <TouchableOpacity 
                                    style={styles.commonLine}
                                    onPress={() => handleSuggestionPress(item)}
                                >
                                        <Text style={{fontSize: 17.5, fontWeight: 'bold'}}>
                                            {item.line}
                                        </Text>
                                        <Text style={{fontSize: 12.5}}>
                                            {item.terminal}
                                        </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        />
                </View>
            </BottomSheetView>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    containerSearch: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 25,
        marginVertical: 5,
        backgroundColor: 'lightgray',
        borderRadius: 25,
        position: 'relative',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    suggestionList: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        maxHeight: 170,
        zIndex: 999,
        elevation: 5,
        borderRadius: 25,
    },
    suggestionCell: {
        textAlign: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
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
        fontWeight: 'bold',
    },
    textInput: {
        margin: 5,
        paddingHorizontal: 15,
        width: '80%',
    },
    commonLine: {
        width: '70%',
        paddingVertical: 10,
        backgroundColor: '#FFBB11',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        borderRadius: 25,
    },
    commonInfo: {
        width: '100%',
        paddingVertical: 20,
        backgroundColor: 'lightgray',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'silver',
    },
});


export default BottomSheetMenu;