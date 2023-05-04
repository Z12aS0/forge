import React from 'react';
import {
  ActivityIndicator, Text, View, StyleSheet, TextInput, FlatList, TouchableOpacity,
} from 'react-native';
import { formatNumber } from '../Utils/Misc';

export default class Bazaar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredData: [
        { product_id: 'dummydata1', quick_status: { buyPrice: 1, sellPrice: 1 } },
        { product_id: 'dummydata2', quick_status: { buyPrice: 2, sellPrice: 12 } },
      ],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async (a = false) => {
    try {
      const response = await fetch('https://api.hypixel.net/skyblock/bazaar');
      const data = await response.json();
      if (!a) {
        this.setState({
          filteredData: Object.values(data.products),
          data: Object.values(data.products),
          isLoading: false,
        });
      } else {
        this.setState({
          data: Object.values(data.products),
          isLoading: false,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => alert(`id: ${item.product_id.toLowerCase()}\nBuy price: ${Math.floor(item.quick_status.sellPrice)}\nSell price: ${Math.floor(item.quick_status.buyPrice)}`)}
    >
      <Text style={styles.text}>{item.product_id.replace(/_/g, ' ').toLowerCase()}</Text>
      <Text style={styles.text}>
        Buy Price:
        {formatNumber(item.quick_status.sellPrice)}
      </Text>
      <Text style={styles.text}>
        Sell Price:
        {formatNumber(item.quick_status.buyPrice)}
      </Text>
    </TouchableOpacity>
  );

  filterData = (query) => {
    const query1 = query.toLowerCase();
    const filteredData = this.state.data.filter((item) => item.product_id.toLowerCase().replace(/_/g, ' ').includes(query1));
    this.setState({ filteredData });
  };

  render() {
    const { isLoading } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ alignItems: 'center', marginBottom: 5 }}>
          <TextInput
            style={styles.textinput}
            onChangeText={(query) => this.filterData(query)}
            placeholder="Search items"
          />
        </View>
        {isLoading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <FlatList
            data={this.state.filteredData}
            renderItem={this.renderItem}
            keyExtractor={(item) => item.product_id}
            windowSize={10}
          />

        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text:
  {
    fontSize: 15,
    marginBottom: 8,
    color: '#bcc3cf',
    textAlign: 'center',
    fontFamily: 'sans-serif',

  },
  textinput:
  {
    backgroundColor: '#595959',
    textAlign: 'center',
    width: '75%',
    borderRadius: 5,
    color: 'white',
    padding: 5,
    fontSize: 16,
  },
  cardContainer: {
    textAlign: 'center',
    backgroundColor: 'grey',
    borderRadius: 8,
    elevation: 2,
    margin: 10,
    padding: 2,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    color: 'bcc3cf',
  },
  button: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 5,
    width: '85%',
  },
});
