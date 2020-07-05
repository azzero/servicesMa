import React, { useContext, useRef, useEffect } from 'react';
import { StyleSheet, View, FlatList, StatusBar } from 'react-native';
import DataContext from '../context/DataContext';
import { Service, Button, Text } from '../components';
import MapView, { Marker, Circle } from 'react-native-maps';
import Constants from 'expo-constants';
import LocalisationContext from '../context/LocalisationContext';
import { Entypo } from '@expo/vector-icons';
import * as customConstants from '../constants/constants';
import { interstitialAdsIDs } from '../constants/AdsParams';
import { AdMobInterstitial, setTestDeviceIDAsync } from 'expo-ads-admob';
const interstitialAdId =
  Platform.OS === 'ios'
    ? interstitialAdsIDs.iosTest
    : interstitialAdsIDs.androidTest;
AdMobInterstitial.setAdUnitID(interstitialAdId);
setTestDeviceIDAsync('EMULATOR');

const DisplayServices = ({ navigation, route }) => {
  //------------------------------------------------//
  //------------------------state------------------//
  //-----------------------------------------------//
  const [selected, setSelected] = React.useState(new Map());

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
    const { latitude, longitude } = markerData.nativeEvent.coordinate;
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
            renderItem={({ item }) => (
              <Service
                id={item.id}
                title={item.data().name}
                phone={item.data().tele}
                Description={item.data().Description}
                userRating={item.data().rating}
                service={service}
                city={city}
                color={customConstants.SecondColor}
              />
            )}
            keyExtractor={item => item.id}
            // extraData={selected}
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
            onMapReady={() => {
              console.log('map is ready');
            }}
            style={{ flex: 1 }}
            initialRegion={{
              latitude: localisation.latitude,
              longitude: localisation.longitude,
              latitudeDelta: 0.0122,
              longitudeDelta: 0.0081
            }}
          >
            {data.map(doc => {
              const { latitude, longitude } = doc.location.geopoint;
              return (
                <Marker
                  onPress={coordinate => handlerMarkerPress(coordinate, doc)}
                  key={doc.id}
                  coordinate={{ latitude: latitude, longitude: longitude }}
                  title={doc.name}
                  description={doc.Description}
                  // image={require('../assets/icons/markerresized.png')}
                >
                  <View>
                    <Entypo name='location-pin' size={42} color='#f00' />
                  </View>
                </Marker>
              );
            })}
            <Circle center={localisation} radius={distance} />
          </MapView>
        </View>

        <View style={{ height: 220 }}>
          <FlatList
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            data={data}
            renderItem={({ item }) => (
              <Service
                id={item.id}
                service={service}
                city={city}
                title={item.name}
                phone={item.tele}
                Description={item.Description}
                userRating={item.rating}
                color={customConstants.SecondColor}
              />
            )}
            keyExtractor={item => item.tele + item.name}
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
