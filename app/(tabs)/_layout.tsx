import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { Pressable, useColorScheme } from 'react-native';

import Colors from '../../constants/Colors';

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

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.dark.text,
        tabBarInactiveTintColor: Colors.dark.background,
        
        tabBarStyle: {
          backgroundColor: Colors.dark.mainColorLight, 
          height: 60,
          borderRadius: 10,
          borderEndEndRadius: 10,
        },
        headerTintColor: Colors.dark.text,
        headerStyle: {
          
          backgroundColor: Colors.dark.mainColorDark,
        },
        tabBarItemStyle: {
          backgroundColor: Colors.dark.mainColorDark,
          padding: 4,
          
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Selection',
          tabBarLabelStyle: {
            fontFamily: 'Alata'
          },
          tabBarIcon: ({ color }) => <TabBarIcon name="silverware-fork-knife" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color= {Colors.dark.text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
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
          tabBarIcon: ({ color }) => <TabBarIcon name="bookshelf" color={color} />,
        }}
      />
    </Tabs>
  );
}
