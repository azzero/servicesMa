import React, { useContext } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import DataContext from '../context/DataContext';
import { Service } from '../components';
import MapView, { Marker, Circle } from 'react-native-maps';
import LocalisationContext from '../context/LocalisationContext';
const DisplayServices = () => {
  const { data, setData } = useContext(DataContext);
  const [selected, setSelected] = React.useState(new Map());
  const { position, askingPosition } = useContext(LocalisationContext);
  const { localisation, setlocalisation } = position;
  return (
    <View style={styles.top}>
      <MapView
        style={{ flex: 0.5 }}
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
              key={doc.name}
              coordinate={{ latitude: latitude, longitude: longitude }}
              title={doc.name}
              description={doc.Description}
            />
          );
        })}
        <Circle center={localisation} radius={500} />
      </MapView>
      <View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={({ item }) => (
            <Service
              // key={item.tele}
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
  top: {
    flexDirection: 'column',
    marginHorizontal: 10,
    width: '90%',
    flex: 1,
    justifyContent: 'center'
  },
  text: {
    color: '#ffffff'
  }
});
