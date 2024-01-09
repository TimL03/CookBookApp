import React, { useState } from 'react';
import { View, Switch, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import { AlataText } from './StyledText';

const SearchSwitch = ({ onToggle }: { onToggle: (isDatabaseSearch: boolean) => void }) => {
    const [isDatabaseSearch, setIsDatabaseSearch] = useState(true);

  const handleToggle = () => {
    setIsDatabaseSearch((prev) => !prev);
    onToggle(!isDatabaseSearch); 
  };

  return (
    <View style={styles.container}>
      <AlataText style={{fontSize: 14}}>{isDatabaseSearch ? ' Currently selecting Recipes from a collection' : 'Currently selecting from your CookBook'}</AlataText>
      <Switch
        trackColor={{ false: Colors.dark.mainColorDark, true: Colors.dark.mainColorLight }}
        thumbColor={isDatabaseSearch ? Colors.dark.text : Colors.dark.mainColorLight}
        ios_backgroundColor="#3e3e3e"
        onValueChange={handleToggle}
        value={isDatabaseSearch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});

export default SearchSwitch;