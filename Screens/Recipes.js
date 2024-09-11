import React from 'react';
import {
  ActivityIndicator, Text, View, StyleSheet, TextInput, FlatList, TouchableOpacity, Image,
} from 'react-native';
import forgedata from '../forgedata.json';
import { formatNumber } from '../Utils/Misc';
import { RadioButton } from 'react-native-paper';
import { ShowMore } from '../Renders/ShowMore';

export default class Recipes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      materialPrices: {},
      isLoading: true,
      searchQuery: '',
      sortOption: 'profit',
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

  getPrice = (materialId, amount, mode = 1) => {
    let { prices } = this.state
    try {
      if (mode == 1) {
        // mode 1 is formatted result and mode 0 is raw result

        if (prices && prices[materialId]) {
          return formatNumber(prices[materialId] * amount);
        }
      } else if (prices && prices[materialId]) {
        const result = prices[materialId] * amount;
        return result;
      }
      return "";
    } catch (a) { }
  }

  renderMaterial(item) {
    return (
      <View>
        <Text style={{ textAlign: 'right' }}>
          {formatNumber(item.amount)} {item.id.toLowerCase().replace(/_/g, ' ')} {this.getPrice(item.id, item.amount)}
        </Text>
      </View>
    );
  }

  handleSearch = (query) => {
    this.setState({ searchQuery: query });
  };

  getPriceRaw = (item, formatted = 0) => {
    let raw = 0
    if (forgedata[item]) {
      for (let material of forgedata[item].materials) {
        if (forgedata[material.id]) {
          raw += this.getPriceRaw(material.id);
        } else {
          raw += this.getPrice(material.id, material.amount, 0);
        }
      }
    } else {
      raw += this.getPrice(material.id, material.amount, 0);
    }

    if (formatted) {
      return formatNumber(raw);
    } else {
      return raw;
    }
  };

  getTotalDuration = (item) => {
    let duration = forgedata[item].duration
    if (forgedata[item]) {
      for (let material of forgedata[item].materials) {
        if (forgedata[material.id]) {
          duration += this.getTotalDuration(material.id)
        } else {
          duration += forgedata[item].duration
        }
      }
    } else {
      return 0
    }
    return Math.floor(duration * 100) / 100;
  };





  render() {
    const { isLoading, searchQuery, sortOption } = this.state;
    if (isLoading) {
      return (
        <View>
          <ActivityIndicator size="large" color="blue" />
        </View>
      );
    }
    let filteredRecipes = Object.keys(forgedata).filter((item) => {
      const recipe = forgedata[item];
      return recipe.id.toLowerCase().replace(/_/g, ' ').includes(searchQuery.toLowerCase());
    });
    if (sortOption === 'profit') {
      filteredRecipes = filteredRecipes.sort((a, b) => {
        const itemAPrice = this.getPrice(a, 1, 0);
        const itemBPrice = this.getPrice(b, 1, 0);
        let totalValueA = 0;
        let totalValueB = 0;
        for (const material in forgedata[a].materials) {
          totalValueA += this.getPrice(forgedata[a].materials[material].id, forgedata[a].materials[material].amount, 0, 1);
        }
        for (const material in forgedata[b].materials) {
          totalValueB += this.getPrice(forgedata[b].materials[material].id, forgedata[b].materials[material].amount, 0, 1);
        }
        return (itemBPrice - totalValueB) - (itemAPrice - totalValueA);
      });
    } else if (sortOption === 'craftPrice') {
      filteredRecipes = filteredRecipes.sort((a, b) => {
        let totalValueA = 0;
        for (const material in forgedata[a].materials) {
          totalValueA += this.getPrice(forgedata[a].materials[material].id, forgedata[a].materials[material].amount, 0, 1);
        }

        let totalValueB = 0;
        for (const material in forgedata[b].materials) {
          totalValueB += this.getPrice(forgedata[b].materials[material].id, forgedata[b].materials[material].amount, 0, 1);
        }

        return totalValueB - totalValueA;
      });
    } else if (sortOption === 'marketPrice') {
      filteredRecipes = filteredRecipes.sort((a, b) => {
        const itemAPrice = this.getPrice(a, 1, 0);
        const itemBPrice = this.getPrice(b, 1, 0);
        return itemBPrice - itemAPrice;
      });
    } else if (sortOption === 'profith') {
      filteredRecipes = filteredRecipes.sort((a, b) => {
        const itemAPrice = this.getPrice(a, 1, 0);
        let totalValueA = 0;
        for (const material in forgedata[a].materials) {
          totalValueA += this.getPrice(forgedata[a].materials[material].id, forgedata[a].materials[material].amount, 0, 1);
        }

        const itemBPrice = this.getPrice(b, 1, 0);
        let totalValueB = 0;
        for (const material in forgedata[b].materials) {
          totalValueB += this.getPrice(forgedata[b].materials[material].id, forgedata[b].materials[material].amount, 0, 1);
        }

        return (itemBPrice - totalValueB) / forgedata[b].duration - (itemAPrice - totalValueA) / forgedata[a].duration;
      });
    }


    return (
      <View>
        <View style={{ alignItems: 'center' }}>
          <TextInput
            style={styles.textinput}
            onChangeText={this.handleSearch}
            value={searchQuery}
            placeholder="Search recipes"
          />
        </View>
        <View>
          <Text style={styles.text}>Sort by:</Text>
          <View style={{ marginBottom: 100 }}>
            <RadioButton.Group
              onValueChange={(value) => this.setState({ sortOption: value })}
              value={sortOption}
            >
              <View style={{ ...styles.radiobutton, position: "absolute", left: "0%", top: 10, maxWidth: 90 }}>
                <RadioButton color="#b3b3b3" value="profit" />
                <Text style={{ fontSize: 16 }}>Profit</Text>
              </View>
              <View style={{ ...styles.radiobutton, position: "absolute", left: "25%", top: 10, maxWidth: 90 }}>
                <RadioButton value="craftPrice" color="#b3b3b3" />
                <Text style={{ fontSize: 16 }}>Craft Price</Text>
              </View>
              <View style={{ ...styles.radiobutton, position: "absolute", left: "50%", top: 10, maxWidth: 90 }}>
                <RadioButton value="marketPrice" color="#b3b3b3" />
                <Text style={{ fontSize: 16 }}>Market Price</Text>
              </View>
              <View style={{ ...styles.radiobutton, position: "absolute", left: "75%", top: 10, maxWidth: 90 }}>
                <RadioButton value="profith" color="#b3b3b3" />
                <Text style={{ fontSize: 16 }}>Profit/h</Text>
              </View>
            </RadioButton.Group>
          </View>
        </View >

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
                  {forgedata[item].id.toLowerCase().replace(/_/g, ' ')}
                </Text>
                <Text style={{ textAlign: 'left' }}>
                  Craft price:
                  {formatNumber(totalValue)}
                </Text>
                <Text style={{ textAlign: 'left' }}>
                  Market price:
                  {this.getPrice(item, 1)}
                </Text>
                <Text style={{ textAlign: 'left' }}>
                  Profit:
                  {formatNumber(itemPrice - totalValue)}
                </Text>
                <Text style={{ textAlign: 'left' }}>
                  Duration:
                  {forgedata[item].duration}
                  hour(s) ({formatNumber((itemPrice - totalValue) / forgedata[item].duration)}/hour) {'\n'}
                </Text>
                <ShowMore
                  showText='Show raw profit'
                  hideText='Hide'
                  content={
                    <View>
                      <Text style={{ textAlign: 'center' }}>
                        Craft price(raw materials): {this.getPriceRaw(item, 1)}
                      </Text>
                      <Text style={{ textAlign: 'center' }}>
                        Raw profit:
                        {formatNumber(itemPrice - this.getPriceRaw(item))}
                      </Text>
                      <Text style={{ textAlign: 'center' }}>
                        Total duration:
                        {this.getTotalDuration(item)}h ({formatNumber((itemPrice - this.getPriceRaw(item)) / (0.001 + this.getTotalDuration(item)))}/h)
                      </Text>
                    </View>
                  } />
                <Text />
                <FlatList
                  data={forgedata[item].materials}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item: material }) => this.renderMaterial(material)}
                />

              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => forgedata[item].id}
          windowSize={10}
        />
      </View >
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
    fontSize: 16,
    margin: 5,
  },
  radiobutton: {
    backgroundColor: '#595959',
    textAlign: 'center',
    width: 150,
    borderRadius: 5,
    color: 'white',
    padding: 5,
    fontSize: 16,
    margin: 5,
    marginRight: 1,
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
  text:
  {
    fontSize: 15,
    marginBottom: 8,
    color: '#bcc3cf',
    textAlign: 'center',
    fontFamily: 'sans-serif',

  },
});
