import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import InfinitePager, { Preset } from 'react-native-infinite-pager';
import Axios, { AxiosResponse } from 'axios';
import { jsonColor } from './jsonColor';
import he from 'he';

const NUM_ITEMS = 5;

interface PostData {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  link: string;
  categories: number[];
  date: string;
  featured_media: number;
}

async function fetchData(): Promise<PostData[]> {
  try {
    const response: AxiosResponse<PostData[]> = await Axios.get(
      'https://datatogo.org/wp-json/wp/v2/posts',
      {
        params: {
          categories: 12,
          _embed: 1,
          per_page: 50,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

function getColor(no: number): string | undefined {
  const key = `color${no + 1}`;
  return jsonColor[key];
}

export default function App() {
  const [preset, setPreset] = useState<Preset>(Preset.SLIDE);
  const pagerRef = useRef<InfinitePager | null>(null);
  const [fetchedData, setFetchedData] = useState<PostData[]>([]);

  useEffect(() => {
    fetchData().then((data) => setFetchedData(data));
  }, []);

  const styles = StyleSheet.create({
    flex: { flex: 1 },
    title: {
      color: 'white',
      fontSize: 30,
      fontWeight: 'bold',
      padding: 10,
    },
    content: {
      color: 'white',
      fontSize: 16,
      padding: 10,
    },
  });

  // Function to remove HTML tags and replace <br> with new lines
  function removeHtmlTagsAndBr(input: string): string {
    const withoutHtml = input.replace(/<[^>]*>/g, ''); // Remove HTML tags
    const withNewLines = withoutHtml.replace(/<br\s*\/?>/g, '\n'); // Replace <br> with new lines
    return he.decode(withNewLines); // Decode HTML entities
  }

  const renderPage = useCallback(({ index }: { index: number }) => {
    const emoji = jsonColor[Object.keys(jsonColor)[index]];
    const bgColor = getColor(index);
    const itemData = fetchedData[index];

    if (!itemData) {
      return null;
    }

    const { title, content } = itemData;
    const imgURL =
      itemData?._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium
        ?.source_url || itemData?._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.crawlomatic_preview_image
        ?.source_url;

    return (
      <View
        key={index}
        style={[
          styles.flex,
          {
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundColor: bgColor,
            paddingTop: 0,
          },
        ]}
      >
        {imgURL && (
          <Image
            source={{ uri: imgURL }}
            style={{ width: '100%', aspectRatio: 4 / 3 }}
          />
        )}
        <Text style={styles.title}>{he.decode(title?.rendered || '')}</Text>
        <Text style={styles.content}>
          {removeHtmlTagsAndBr(content?.rendered || '')}
        </Text>
        <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold' }}>
          Toni {index}
        </Text>
      </View>
    );
  }, [fetchedData]);

  return (
    <GestureHandlerRootView
      style={[styles.flex, { backgroundColor: 'seashell' }]}
    >
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