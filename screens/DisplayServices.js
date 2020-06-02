import React, { useContext, useRef } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import DataContext from '../context/DataContext';
import { Service, Button } from '../components';
import MapView, { Marker, Circle } from 'react-native-maps';
import Constants from 'expo-constants';
import LocalisationContext from '../context/LocalisationContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as customConstants from '../constants/constants';
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

  //------------------------------------------------//
  //------------------------Return------------------//
  //-----------------------------------------------//
  const { distance, searchingByPosition, service, city } = route.params;
  if (!searchingByPosition) {
    return (
      <View style={styles.container}>
        <FlatList
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
            />
          )}
          keyExtractor={item => item.id}
          extraData={selected}
        />
        <View style={{ height: 80 }}>
          <Button
            rounded
            firstIconName='arrowleft'
            style={{ bottom: 40, right: 30 }}
            firstbtnfunction={() => navigation.goBack()}
          />
        </View>
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
                    <MaterialCommunityIcons
                      name='home-map-marker'
                      size={32}
                      color='#f00'
                    />
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
              />
            )}
            keyExtractor={item => item.tele + item.name}
            extraData={selected}
          />
        </View>
        <View style={{ height: 80 }}>
          <Button
            rounded
            firstIconName='arrowleft'
            style={{ bottom: 40, right: 30 }}
            firstbtnfunction={() => navigation.goBack()}
          />
        </View>
      </View>
    );
  }
};

export default DisplayServices;
const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    marginHorizontal: 10,
    width: '90%',
    flex: 1
    // justifyContent: 'center'
  },
  text: {
    color: '#ffffff'
  }
});
