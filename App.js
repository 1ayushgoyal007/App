import React from 'react';
import {createAppContainer , createSwitchNavigator  } from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import firebase from './firebase';

import ShowScreen from './src/screens/ShowScreen';
import {Provider} from './src/context/BlogContext';
import CreateScreen from './src/screens/CreateScreen';
import EditScreen from './src/screens/EditScreen';


import LoginScreen from './src/screens/LoginScreen';
import WorkerDashboardScreen from './src/screens/WorkerDashboardScreen';
import WorkerNotificationScreen from './src/screens/WorkerNotificationScreen';
import WorkerAccountScreen from './src/screens/WorkerAccountScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import AccountScreen from './src/screens/AccountScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import DetailScreen from './src/screens/DetailScreen';
import EachPostedJobScreen from './src/screens/EachPostedJobScreen';
import AppliedScreen from './src/screens/AppliedScreen';
import RatingScreen from './src/screens/RatingScreen';
import ContactScreen  from './src/screens/ContactScreen';

const navigator =  createSwitchNavigator({
  Loading:LoadingScreen,
  Details: DetailScreen,
  LoginFlow: createStackNavigator({
    Login:LoginScreen
  }),
  WorkFlow : createDrawerNavigator({
    DashBoard: createStackNavigator({
      Home: WorkerDashboardScreen,
      EachPostedJob: EachPostedJobScreen
    }),
    Notifications: WorkerNotificationScreen,
    Profile: WorkerAccountScreen,
    Contact: ContactScreen
  }),

  HireFlow:createDrawerNavigator({
    Home:createStackNavigator({
      Dashboard: DashboardScreen,
      showJob: ShowScreen,
      Rating:RatingScreen,
      EditJob:EditScreen,
      Create:CreateScreen
    }),
    Notification: createStackNavigator({
      Notification: NotificationScreen,
      Applied: AppliedScreen
    }),
    Account: AccountScreen,
    Contact: ContactScreen
  })
});





var App =  createAppContainer(navigator);

export default  () =>{
  console.disableYellowBox = true;
  return  <Provider>
    <App />
  </Provider>
}