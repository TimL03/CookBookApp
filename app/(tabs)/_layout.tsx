import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Library, Utensils, Menu, FileSearch } from 'lucide-react-native'
import { Tabs, router } from 'expo-router';
import { Pressable, useColorScheme, View } from 'react-native';

import Fonts from '../../constants/fonts';
import Colors from '../../constants/Colors';
import React, { useState } from 'react';
function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: string;
}) {
  return <MaterialCommunityIcons size={28} style={{ marginBottom: 5 }} {...props} />;
}

export default function TabLayout() {
  
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
          <View style={{paddingHorizontal: 20}}>
            <Pressable onPress={() => router.push('/modals/actionModal')} style={({ pressed }) => [ {padding: 5, borderRadius: 20, backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.seeThrough }]}>
              <Menu color={Colors.dark.text} size={28} />
            </Pressable>    
          </View>                
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
          fontFamily: Fonts.family.primary,
          fontSize: Fonts.size.font22,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Selection',
          tabBarLabelStyle: {
            fontFamily: Fonts.family.primary,
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
      <Tabs.Screen
        name="three"
        options={{
          title: 'Discover',
          tabBarLabelStyle: {
            fontFamily: 'Alata'
          },
          tabBarIcon: ({ color }) => <FileSearch color={color} size={28} style={{ marginBottom: -10 }} />,
        }}
      />
    
    </Tabs>
    </View>
  );
}
