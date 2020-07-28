import React, { useContext, useRef, useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, StatusBar, Platform } from 'react-native';
import DataContext from '../context/DataContext';
import { Service, Button, Text } from '../components';
import MapView, { Marker, Circle } from 'react-native-maps';
import Constants from 'expo-constants';
import LocalisationContext from '../context/LocalisationContext';
import { Entypo } from '@expo/vector-icons';
import * as customConstants from '../constants/constants';
import { interstitialAdsIDs, bannerAdsIDs } from '../constants/AdsParams';
import { AdMobInterstitial, AdMobBanner } from 'expo-ads-admob';
const bannerAdId =
  Platform.OS === 'ios' ? bannerAdsIDs.iosreal : bannerAdsIDs.androidreal;
// global :

const interstitialAdId =
  Platform.OS === 'ios'
    ? interstitialAdsIDs.iosreal
    : interstitialAdsIDs.android;
AdMobInterstitial.setAdUnitID(interstitialAdId);
const DisplayServices = ({ navigation, route }) => {
  //------------------------------------------------//
  //------------------------state------------------//
  //-----------------------------------------------//
  const [selected, setSelected] = React.useState(new Map());
  const [is_loading, setis_loading] = useState(true);
  //------------------------------------------------//
  //------------------------Context-----------------//
  //-----------------------------------------------//
  const { data, setData } = useContext(DataContext);
  const { position, askingPosition } = useContext(LocalisationContext);
  const { localisation, setlocalisation } = position;
  //------------------------------------------------//
  //--------------------Create Ref------------------//
  //-----------------------------------------------//
  const scrollRef = useRef(null);

  //------------------------------------------------//
  //--------------------Functions------------------//
  //-----------------------------------------------//
  const handlerMarkerPress = (markerData, item) => {
    // const { latitude, longitude } = markerData.nativeEvent.coordinate;
    scrollRef.current.scrollToItem({ animated: true, item });
  };
  // interstitial ads  request
  const _openInterstitial = async () => {
    try {
      await AdMobInterstitial.requestAdAsync();
      await AdMobInterstitial.showAdAsync();
    } catch (error) {
      console.error(error);
    }
  };
  //------------------------------------------------//
  //---------------------UseEffect------------------//
  //-----------------------------------------------//
  //admob initialisation
  useEffect(() => {
    try {
      const adsId = Math.random()
        .toString(36)
        .substr(2, 9);
      let datawithAds = data;
      console.log('type of data : ', typeof data);
      const length = data.length;
      datawithAds[length] = { ads: true, id: adsId };
      setData(datawithAds);
      const timeout = setTimeout(() => {
        _openInterstitial();
      }, 7000);
      return () => {
        clearTimeout(timeout);
      };
    } catch (e) {
      console.log('ads error :', e);
    }
  }, []);

  //------------------------------------------------//
  //------------------------Render------------------//
  //-----------------------------------------------//
  const { distance, searchingByPosition, service, city } = route.params;
  if (!searchingByPosition) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content'></StatusBar>
        <View
          style={{
            width: '100%',
            // marginBottom: 20,
            flex: 0.2,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              borderBottomWidth: 1,
              borderRadius: 20,
              borderBottomColor: customConstants.PrimaryColor
            }}
          >
            <Text
              h1
              right
              style={{
                color: customConstants.PrimaryColor,
                paddingHorizontal: 20
              }}
            >
              الخدمات المتوفرة
            </Text>
          </View>
        </View>
        <View style={{ flex: 0.8 }}>
          <FlatList
            contentContainerStyle={{ justifyContent: 'space-between' }}
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            data={data}
            renderItem={({ item }) => {
              if (typeof item.ads !== 'undefined') {
                return (
                  <View
                    style={{
                      width: '100%',
                      height: 200,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 0.2
                    }}
                  >
                    <AdMobBanner bannerSize='banner' adUnitID={bannerAdId} />
                  </View>
                );
              }
              return (
                <Service
                  id={item.id}
                  title={item.data().name}
                  phone={item.data().tele}
                  Description={item.data().Description}
                  service={service}
                  city={city}
                  color={customConstants.SecondColor}
                  keyExtractor={item => item.id}
                />
                // extraData={selected}
              );
            }}
          />
        </View>
        <Button
          rounded
          firstIconName='arrowleft'
          style={{ bottom: 40, right: 40 }}
          firstbtnfunction={() => navigation.goBack()}
        />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <MapView
            showsUserLocation
            onMapReady={() => console.log('map is ready')}
            style={{ flex: 1 }}
            initialRegion={{
              latitude: localisation.latitude,
              longitude: localisation.longitude,
              latitudeDelta: 0.0122,
              longitudeDelta: 0.0081
            }}
          >
            {data.map(doc => {
              if (typeof doc.ads === 'undefined') {
                const { latitude, longitude } = doc.location.geopoint;
                return (
                  <Marker
                    onPress={coordinate => handlerMarkerPress(coordinate, doc)}
                    key={doc.id}
                    coordinate={{ latitude: latitude, longitude: longitude }}
                    title={doc.name}
                    description={doc.Description}
                    // image={require('../assets/icons/markerresized.png')}
                  />
                );
              }
            })}
            <Circle center={localisation} radius={distance} />
          </MapView>
        </View>

        <View style={{ height: 220 }}>
          <FlatList
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            data={data}
            renderItem={({ item }) => {
              if (typeof item.ads !== 'undefined') {
                return (
                  <View
                    style={{
                      width: '100%',
                      height: 200,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 0.2
                    }}
                  >
                    <AdMobBanner bannerSize='banner' adUnitID={bannerAdId} />
                  </View>
                );
              }
              return (
                <Service
                  id={item.id}
                  service={service}
                  city={city}
                  title={item.name}
                  phone={item.tele}
                  Description={item.Description}
                  // userRating={item.rating}
                  color={customConstants.SecondColor}
                  ads={typeof item.ads === 'undefined' ? false : true}
                />
              );
            }}
            keyExtractor={item => item.id}
            extraData={selected}
          />
          <View>
            <Button
              rounded
              firstIconName='arrowleft'
              style={{ bottom: 40, right: 40 }}
              firstbtnfunction={() => navigation.goBack()}
            />
          </View>
        </View>
      </View>
    );
  }
};

export default DisplayServices;
const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: customConstants.SecondColor,
    // marginHorizontal: 10,
    width: '100%',
    flex: 1
    // justifyContent: 'center'
  },
  text: {
    color: '#ffffff'
  }
});
