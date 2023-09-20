import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
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
          categories: 22, //4
          _embed: 1,
          per_page: 100,
          // orderby: 'ID', // Order by ID
          // order: 'DESC', // Descending order (latest first)
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
  const [currentPage, setCurrentPage] = useState<number>(0);

  useEffect(() => {
    fetchData().then((data) => setFetchedData(data));
  }, []);

  const styles = StyleSheet.create({
    flex: { flex: 1 },
    title: {
      color: 'white',
      fontSize: 25,
      fontWeight: 'bold',
      marginHorizontal: 20,
      textAlign: 'left',
    },
    content: {
      color: 'white',
      fontSize: 18,
      margin: 20,
      textAlign: 'left',
    },
    topImage: { marginBottom: 20, width: '100%', aspectRatio: 4 / 3 },
    pageNumber: {
      position: 'absolute',
      bottom: 10,
      right: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 0,
      padding: 5,
    },
    pageNumberText: {
      color: 'white',
      fontSize: 16,
    },
    dateOverlay: {
      position: 'absolute',
      bottom: 10,
      left: 20,
      // backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: 5,
      borderRadius: 0,
    },
    dateText: {
      color: 'gray',
      fontSize: 16,
    },
  });

  function formatDate(inputDate: string) : string {
    const date = new Date(inputDate);
    const MM = String(date.getMonth() + 1).padStart(2, '0'); // Month (0-based, add 1 for January)
    const DD = String(date.getDate()).padStart(2, '0'); // Day
    const YYYY = date.getFullYear(); // Year
    const HH = String(date.getHours()).padStart(2, '0'); // Hours
    const mm = String(date.getMinutes()).padStart(2, '0'); // Minutes
  
    return `${MM}-${DD}-${YYYY} ${HH}:${mm}`;
  }

  function removeText(inputText: string, stringsToRemove: string[]): string {
    const escapedStrings = stringsToRemove.map((str) =>
      str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    );
    const regex = new RegExp(escapedStrings.join('|'), 'g');
    return inputText.replace(regex, '').trim();
  }

  function removeHtmlTagsAndBr(input: string): string {
    const withoutHtml = input.replace(/<[^>]*>/g, '');
    const withNewLines = withoutHtml.replace(/<br\s*\/?>/g, '\n');
    const withoutCurlyBraces = withNewLines.replace(/\{[^}]*\}/g, '');
    const withoutText = removeText(withoutCurlyBraces, ["Source link"]);
    return he.decode(withoutText); // Return the decoded text without the specified text
  }

  const renderPage = useCallback(({ index }: { index: number }) => {
    const emoji = jsonColor[Object.keys(jsonColor)[index]];
    const bgColor = getColor(index);
    const itemData = fetchedData[index];

    if (!itemData) {
      // Return an empty View for pages without data
      return (
        <View key={index} style={[styles.flex, { backgroundColor: bgColor }]} />
      );
    }

    const { title, content, date } = itemData;
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
            justifyContent: 'flex-start',
            backgroundColor: bgColor,
            paddingTop: 0,
            alignItems: 'flex-start',
          },
        ]}
      >
        {imgURL && (
          <Image
            source={{ uri: imgURL }}
            style={styles.topImage}
          />
        )}
        <Text style={styles.title}>{he.decode(title?.rendered || '')} </Text>
        {/* <ScrollView> */}
          <Text style={styles.content}>
            {removeHtmlTagsAndBr(content?.rendered || '')}
            {/* {console.log(removeHtmlTagsAndBr(content?.rendered || ''))} */}
            
          </Text>
        {/* </ScrollView> */}
        <View style={styles.dateOverlay}>
          <Text style={styles.dateText}>{formatDate(date)}</Text>
          {/* {console.log(date)} */}
        </View>
      </View>
    );
  }, [fetchedData, currentPage]);

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
        onPageChange={(pageIndex) => setCurrentPage(pageIndex)}
        minIndex={0} // Set minimum index to 0
        maxIndex={fetchedData.length - 1} // Set maximum index to the last available data index
      />
      <View style={styles.pageNumber}>
        <Text style={styles.pageNumberText}>{currentPage + 1}/{fetchedData.length}</Text>
      </View>
    </GestureHandlerRootView>
  );
}
