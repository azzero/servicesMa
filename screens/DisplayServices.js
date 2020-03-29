import React, { useContext } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import DataContext from '../context/DataContext';
import { Service } from '../components';
const DisplayServices = () => {
  const { data, setData } = useContext(DataContext);
  const [selected, setSelected] = React.useState(new Map());
  // const services = data.map(doc => {
  //   let count = 0;
  //   return (
  //     <Service phone={doc.tele} title={doc.name} key={doc.name}>
  //       <Text style={styles.text}>{doc.Description}</Text>
  //     </Service>
  //   );
  // });
  // return <View style={styles.top}>{services}</View>;

  return (
    <View style={styles.top}>
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
