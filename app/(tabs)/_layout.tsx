import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Library, Utensils, Menu } from 'lucide-react-native'
import { Link, Tabs } from 'expo-router';
import SettingsModal from '../../components/settingsModal';
import { Pressable, useColorScheme, View } from 'react-native';

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

function settingsModal() {
  console.log("settings modal");
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
        
        tabBarStyle: {
          backgroundColor: Colors.dark.mainColorLight,
          borderTopWidth: 0,
          height: 60,
          borderRadius: 10,
          borderEndEndRadius: 10,
        },
        headerTintColor: Colors.dark.text,
        headerStyle: {
          backgroundColor: Colors.dark.mainColorDark,
          borderWidth: 0,
        },
        tabBarItemStyle: {
          backgroundColor: Colors.dark.mainColorDark,
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
          tabBarIcon: ({ color }) => <Utensils color={color} size={28} style={{ marginBottom: -5 }} />,
          headerRight: () => (
            <Pressable onPress={openSettingsModal}>
                  <Menu color={Colors.dark.text} size={28} style={{ marginRight: 15 }} />
            </Pressable>                    
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Cookbook',
          tabBarLabelStyle: {
            fontFamily: 'Alata'
          },
          tabBarIcon: ({ color }) => <Library color={color} size={28} style={{ marginBottom: -5 }} />,
          headerRight: () => (
            <Pressable onPress={openSettingsModal}>
                  <Menu color={Colors.dark.text} size={28} style={{ marginRight: 15 }} />
            </Pressable>
          ),
        }}
      />
    
    </Tabs>
    <SettingsModal visible={modalVisible} onClose={closeSettingsModal} />
    </View>
  );
}
