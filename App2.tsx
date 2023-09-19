import React, { useRef, useCallback, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import InfinitePager, { Preset } from 'react-native-infinite-pager';
import { jsonColor } from './jsonColor';
import { jsonData} from './jsonData';

const NUM_ITEMS = 5;

function getColor(no: number): string | undefined {
  const key = `color${no + 1}`;
  return jsonColor[key];
}

export default function App() {
  const [preset, setPreset] = useState<Preset>(Preset.SLIDE);
  const pagerRef = useRef(null);

  const renderPage = useCallback(({ index }: { index: number }) => {
    const emoji = jsonData.data[Object.keys(jsonData.data)[index]];
    const bgColor = getColor(index);
    return (
      <View
        key={index}
        style={[
          styles.flex,
          {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bgColor,
          },
        ]}>
           <Text style={{ color: 'white', fontSize: 180, fontWeight: 'bold' }}>
          {emoji} 
        </Text>
        <Text style={{ color: 'white', fontSize: 80, fontWeight: 'bold' }}>
         Toni {index}
        </Text>
      </View>
    );
  }, []);

  return (
    <GestureHandlerRootView
      style={[styles.flex, { backgroundColor: 'seashell' }]}>
      <InfinitePager
        key={`infinite-pager-${preset}`}
        ref={pagerRef}
        renderPage={renderPage}
        style={styles.flex}
        pageWrapperStyle={styles.flex}
        preset={preset}
        pageBuffer={4}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
