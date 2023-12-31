import React from 'react';
import { View, StyleSheet, Pressable, Linking} from 'react-native';
import { Settings, User2, Info, Github } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import gStyles from '../../constants/Global_Styles';
import { router } from 'expo-router';
import { Alata20, Alata22 } from '../../components/StyledText';


interface ActionsModalProps {
    visible: boolean;
    onClose: () => void;
}

const ActionsModal = ({ visible, onClose}: ActionsModalProps) => {

  return (
      <Pressable style={gStyles.modalBackgroundContainer} onPress={router.back}>
        <View style={gStyles.modalContentContainer}>
          <Alata22 style={gStyles.alignCenter}>Aktionen</Alata22>     
            <Pressable style={({ pressed }) => [gStyles.cardHorizontal, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.background }]} onPress={() => router.replace('/screens/accountScreen')}>
              <User2 color={Colors.dark.text} size={22} style={gStyles.alignCenter} />
              <Alata20 style={gStyles.marginBottom}>Account</Alata20>
            </Pressable>
            
            <Pressable style={({ pressed }) => [gStyles.cardHorizontal, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.background },]} onPress={() => router.replace('/screens/aboutScreen')}>
              <Info color={Colors.dark.text} size={22} style={gStyles.alignCenter}  />
              <Alata20 style={gStyles.marginBottom}>Impressum/About</Alata20>
            </Pressable>

            <Pressable style={({ pressed }) => [gStyles.cardHorizontal, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.background }]} onPress={() => Linking.openURL("https://github.com/TimL03/CookBookApp")}>
                <Github color={Colors.dark.text} size={22} style={gStyles.alignCenter}  />
                <Alata20 style={gStyles.marginBottom}>Open on Github</Alata20>
            </Pressable>
        </View>
      </Pressable>
  );
};

export default ActionsModal;
