import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

const BottomSheetsStack = function () {
  return (
    <Stack.Navigator
      screenOptions={{
        presentation: 'transparentModal',
        headerShown: false,
        animation: 'slide_from_bottom',
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="AddSubjectBottomSheet" component={AddSubjectBottomSheet} />
      <Stack.Screen name="AddDeadlineBottomSheet" component={AddDeadlineBottomSheet} />
      <Stack.Screen name="AddHomeworkBottomSheet" component={AddHomeworkBottomSheet} />
      <Stack.Screen name="AddTodoBottomSheet" component={AddTodoBottomSheet} />
    </Stack.Navigator>
  );
};

export default BottomSheetsStack;
