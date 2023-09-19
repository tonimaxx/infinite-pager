// import './polyfills';
import React, { useRef, useCallback, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import InfinitePager, { Preset } from 'react-native-infinite-pager';
const NUM_ITEMS = 5;

// global.__reanimatedWorkletInit = function () {}

function getColor(i: number) {
  const multiplier = 255 / (NUM_ITEMS - 1);
  const colorVal = Math.abs(i) * multiplier;
  return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
}

// const Page = ({ index }: { index: number }) => {
//   return (
//     <View
//     key={index}
//       style={[
//         styles.flex,
//         {
//           alignItems: 'center',
//           justifyContent: 'center',
//           backgroundColor: getColor(index),
//         },
//       ]}>
//       <Text style={{ color: 'white', fontSize: 80, fontWeight: 'bold' }}>
//         {index}
//       </Text>
//     </View>
//   );
// };

export default function App() {
  const [preset, setPreset] = useState<Preset>(Preset.SLIDE);
  const pagerRef = useRef(null);

  const renderPage = useCallback(({ index }: { index: number }) => {
    return (
      <View
      key={index}
        style={[
          styles.flex,
          {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: getColor(index),
          },
        ]}>
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
      {/* <View style={{ position: 'absolute', bottom: 44, left: 0, right: 0 }}>
        <Text
          style={{
            alignSelf: 'center',
            fontWeight: 'bold',
            color: 'rgba(0,0,0,0.33)',
            padding: 5,
            borderRadius: 3,
            fontSize: 24,
          }}>
          Page Interpolators
        </Text> */}
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 12,
          }}>
          {Object.values(Preset).map((k) => {
            return (
              <TouchableOpacity
                onPress={() => setPreset(k)}
                style={{
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 3,
                  backgroundColor: k === preset ? 'rgba(0,0,0,0.25)' : 'transparent',
                }}>
                <Text style={{ color: 'white' }}>{k}</Text>
              </TouchableOpacity>
            );
          })}
        </View> */}
      {/* </View> */}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
