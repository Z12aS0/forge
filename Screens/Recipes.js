import React from 'react';
import {
  ActivityIndicator, Text, View, StyleSheet, TextInput, FlatList, TouchableOpacity,
} from 'react-native';
import forgedata_ from '../forgedata.json';
import { formatNumber } from '../Utils/Misc';

const forgedata = forgedata_[0];

export default class Recipes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      materialPrices: {},
      isLoading: true,
      searchQuery: '',
    };
  }

  componentDidMount() {
    fetch('https://lb.tricked.pro/lowestbins')
      .then((response) => response.json())
      .then((data) => {
        this.setState({ prices: data, isLoading: false });
      })
      .catch((error) => console.error(error));
  }

  getPrice(materialId, amount, mode = 1) {
    try {
      if (mode == 1) {
        // mode 1 is formatted result and mode 0 is raw result

        if (this.state.prices && this.state.prices[materialId]) {
          return formatNumber(this.state.prices[materialId] * amount);
        }
      } else if (this.state.prices && this.state.prices[materialId]) {
        const result = this.state.prices[materialId] * amount;
        return result;
      }
      return 0;
    } catch (a) { }
  }

  renderMaterial(item) {
    return (
      <View>
        <Text style={{ textAlign: 'center' }}>
          {formatNumber(item.amount)}
          {' '}
          {item.id.toLowerCase().replace(/_/g, ' ')}
          {' '}
          {this.getPrice(item.id, item.amount)}
        </Text>
      </View>
    );
  }

  handleSearch = (query) => {
    this.setState({ searchQuery: query });
  };

  render() {
    const { isLoading, searchQuery } = this.state;
    if (isLoading) {
      return (
        <View>
          <ActivityIndicator size="large" color="blue" />
        </View>
      );
    }

    const filteredRecipes = Object.keys(forgedata).filter((item) => {
      const recipe = forgedata[item];
      return recipe.id.toLowerCase().replace(/_/g, ' ').includes(searchQuery.toLowerCase());
    });

    return (
      <View style={{ flex: 1 }}>
        <View style={{ alignItems: 'center' }}>
          <TextInput
            style={styles.textinput}
            onChangeText={this.handleSearch}
            value={searchQuery}
            placeholder="Search recipes"
          />
        </View>

        <FlatList
          data={filteredRecipes}
          renderItem={({ item }) => {
            let totalValue = 0;
            for (const material in forgedata[item].materials) {
              totalValue += this.getPrice(forgedata[item].materials[material].id, forgedata[item].materials[material].amount, 0, 1);
            }

            const itemPrice = this.getPrice(item, 1, 0);
            return (
              <TouchableOpacity style={styles.cardContainer}>
                <Text style={{ textAlign: 'center' }}>
                  Name:
                  {forgedata[item].id.toLowerCase().replace(/_/g, ' ')}
                </Text>
                <Text style={{ textAlign: 'center' }}>
                  Craft price:
                  {formatNumber(totalValue)}
                </Text>
                <Text style={{ textAlign: 'center' }}>
                  Market price:
                  {this.getPrice(item, 1)}
                </Text>
                <Text style={{ textAlign: 'center' }}>
                  Profit:
                  {formatNumber(itemPrice - totalValue)}
                </Text>
                <Text style={{ textAlign: 'center' }}>
                  Duration:
                  {forgedata[item].duration}
                  {' '}
                  hour(s) (
                  {formatNumber((itemPrice - totalValue) / forgedata[item].duration)}
                  {' '}
                  per hour)
                </Text>
                <Text />
                <FlatList
                  data={forgedata[item].materials}
                  keyExtractor={(subItem, index) => index.toString()}
                  renderItem={({ item: material }) => this.renderMaterial(material)}
                />
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => forgedata[item].id}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textinput: {
    backgroundColor: '#595959',
    textAlign: 'center',
    width: '85%',
    borderRadius: 5,
    color: 'white',
    padding: 5,
    fontSize: 16,
    margin: 5,
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
});
