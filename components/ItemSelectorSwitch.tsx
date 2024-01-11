import React from 'react'
import {
  StyleSheet,
  Pressable,
} from 'react-native'
import Colors from '../constants/Colors'
import gStyles from '../constants/Global_Styles'
import { Alata12 } from './StyledText'

// Define the type for the SelectionProps
type SelectionProps = {
  item: {
    key: string
    value: string
    selected: boolean
  }
  onToggle?: () => void
}

// Define and export the ItemSelectorSwitch component function
export default function ItemSelectorSwitch({ item, onToggle }: SelectionProps) {
  // Initialize a state variable to track the selected status of the item
  const [isSelected, setSelected] = React.useState(item.selected)

  // Function to handle item switch press
  const switchPressed = () => {
    // Check if the item has a selected property (not null)
    if (item.selected !== null) {
      // Toggle the selected state
      setSelected(!isSelected)

      // Check if an onToggle callback function is provided
      if (onToggle) {
        // Call the onToggle callback function
        onToggle()
      }
    }
  }

  return (
    <Pressable
      onPress={switchPressed}
      style={() => [
        styles.switchButton,
        {
          backgroundColor: isSelected
            ? Colors.dark.tint
            : Colors.dark.mainColorDark,
        },
      ]}
    >
      <Alata12 style={[gStyles.alignCenter, gStyles.marginBottom]}>
        {item.value}
      </Alata12>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  switchButton: {
    borderRadius: 120,
    padding: 10,
    paddingHorizontal: 20,
    elevation: 2,
  },
})
