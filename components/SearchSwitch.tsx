import React, { useState } from 'react'
import { View, Switch, Text, StyleSheet } from 'react-native'
import Colors from '../constants/Colors'
import { AlataText } from './StyledText'

// Define and export the SearchSwitch component function
const SearchSwitch = ({
  onToggle,
}: {
  onToggle: (isDatabaseSearch: boolean) => void
}) => {
  // Initialize state variable to track the search mode (database or cookbook)
  const [isDatabaseSearch, setIsDatabaseSearch] = useState(true)

  // Function to handle the toggle of search mode
  const handleToggle = () => {
    // Toggle the isDatabaseSearch state when the switch is pressed
    setIsDatabaseSearch((prev) => !prev)

    // Call the provided onToggle function with the updated search mode
    onToggle(!isDatabaseSearch)
  }

  return (
    <View style={styles.container}>
      <AlataText style={{ fontSize: 14 }}>
        {isDatabaseSearch
          ? ' Currently selecting Recipes from a collection'
          : 'Currently selecting from your CookBook'}
      </AlataText>
      <Switch
        trackColor={{
          false: Colors.dark.mainColorDark,
          true: Colors.dark.mainColorLight,
        }}
        thumbColor={
          isDatabaseSearch ? Colors.dark.text : Colors.dark.mainColorLight
        }
        ios_backgroundColor="#3e3e3e"
        onValueChange={handleToggle}
        value={isDatabaseSearch}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

export default SearchSwitch
