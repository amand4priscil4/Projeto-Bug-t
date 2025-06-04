import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../utils/colors';

import HomeScreen from '../screens/HomeScreen';
import ChecklistScreen from '../screens/ChecklistScreen';
import PomodoroScreen from '../screens/PomodoroScreen';
import DiaryScreen from '../screens/DiaryScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'dashboard';
            } else if (route.name === 'Checklist') {
              iconName = 'checklist';
            } else if (route.name === 'Pomodoro') {
              iconName = 'timer';
            } else if (route.name === 'Diary') {
              iconName = 'book';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.tabActive,
          tabBarInactiveTintColor: colors.tabInactive,
          tabBarStyle: {
            backgroundColor: colors.cardBackground
          }
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Checklist" component={ChecklistScreen} />
        <Tab.Screen name="Pomodoro" component={PomodoroScreen} />
        <Tab.Screen name="Diary" component={DiaryScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
