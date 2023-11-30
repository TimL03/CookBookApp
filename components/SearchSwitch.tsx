import React, { useState } from 'react';
import { View, Switch, Text, StyleSheet } from 'react-native';

const SearchSwitch = ({ onToggle }: { onToggle: (isDatabaseSearch: boolean) => void }) => {
    const [isDatabaseSearch, setIsDatabaseSearch] = useState(true);

  const handleToggle = () => {
    setIsDatabaseSearch((prev) => !prev);
    onToggle(!isDatabaseSearch); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{isDatabaseSearch ? 'Database' : 'CookBook'}</Text>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isDatabaseSearch ? '#f5dd4b' : '#f4f3f4'}
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
    alignItems: 'center',
  },
  label: {
    marginRight: 10,
  },
});

export default SearchSwitch;