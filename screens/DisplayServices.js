import React, { useContext, useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import DataContext from '../context/DataContext';
import { Service } from '../components';
import MapView, { Marker, Circle } from 'react-native-maps';
import LocalisationContext from '../context/LocalisationContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as customConstants from '../constants/constants';
const DisplayServices = ({ route }) => {
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
  const { distance } = route.params;
  console.log('distance : ', distance);
  console.log(' cpmt : Display Services , data : ', data);
  if (localisation === null) {
    return (
      <View style={styles.container}>
        <Text> بحث بالمدينة فقط </Text>
      </View>
    );
  }
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
                    color={customConstants.PrimaryColor}
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
              title={item.name}
              phone={item.tele}
              Description={item.Description}
              userRating='4'
            />
          )}
          keyExtractor={item => item.tele + item.name}
          extraData={selected}
        />
      </View>
    </View>
  );
};

export default DisplayServices;
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    width: '90%',
    flex: 1
    // justifyContent: 'center'
  },
  text: {
    color: '#ffffff'
  }
});
