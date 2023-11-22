import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Library, Utensils, Menu } from 'lucide-react-native'
import { Link, Tabs } from 'expo-router';
import LoginModal from '../modals/logInModal';
import { Pressable, useColorScheme, View, Platform } from 'react-native';

import Colors from '../../constants/Colors';
import React, { useState } from 'react';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: string;
}) {
  return <MaterialCommunityIcons size={28} style={{ marginBottom: 5 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);

  const openSettingsModal = () => {
    setModalVisible(true);
  };

  const closeSettingsModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.dark.text,
        tabBarInactiveTintColor: Colors.dark.background,
        tabBarBackground: () => (
          <View style={{backgroundColor: Colors.dark.background, height: 110}}>
            <View style={{backgroundColor: Colors.dark.mainColorDark, height: 110, borderTopLeftRadius: 20, borderTopRightRadius: 20,}}>
            </View>
          </View>
        ),
        tabBarStyle: {
          borderTopWidth: 0,
          height: 100,
          borderRadius: 20,
          borderEndEndRadius: 10,
        },
        headerTintColor: Colors.dark.text,
        headerStyle: {
          borderWidth: 0,
        },
        headerRight: () => (
          <Pressable onPress={openSettingsModal}>
                <Menu color={Colors.dark.text} size={28} style={{ marginRight: 15 }} />
          </Pressable>                    
        ),
        headerBackground: () => (
          <View style={{backgroundColor: Colors.dark.background, height: 110}}>
            <View style={{backgroundColor: Colors.dark.mainColorDark, height: 110, borderBottomLeftRadius: 20, borderBottomRightRadius: 20,}}>
            </View>
          </View>
        ),
        tabBarItemStyle: {
          
          padding: 4, 
        },
        headerTitleStyle: {
          fontFamily: 'Alata',
          fontSize: 24,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Selection',
          tabBarLabelStyle: {
            fontFamily: 'Alata'
          },
          tabBarIcon: ({ color }) => <Utensils color={color} size={28} style={{ marginBottom: -10 }} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Cookbook',
          tabBarLabelStyle: {
            fontFamily: 'Alata'
          },
          tabBarIcon: ({ color }) => <Library color={color} size={28} style={{ marginBottom: -10 }} />,
        }}
      />
    
    </Tabs>
    <LoginModal visible={modalVisible} onClose={closeSettingsModal} />
    </View>
  );
}
