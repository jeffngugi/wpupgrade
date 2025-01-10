import { StyleSheet } from 'react-native'

export const tabBarStyles = StyleSheet.create({
  tabbarIndicator: {
    height: 1,
    bottom: -1,
    borderBottomColor: '#62A446',
    borderBottomWidth: 2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    // borderWidth: 3,
  },
  tabBarLabelStyle: {
    fontSize: 14,
    fontFamily: 'moderat-medium',
    // color: '#BBBFC4',
  },
  tabBarStyle: {
    borderBottomColor: '#E3E9EC',
    borderBottomWidth: 1,
    elevation: 0,
  },

  container: {
    // elevation: 0,
    // shadowColor: '#000000',
    // shadowOffset: { width: 0, height: 10 }, // change this for more shadow
    // shadowOpacity: 0.1,
    // shadowRadius: 10,
  },
})
export const tabBarScreenOptions = {
  lazy: true,
  swipeEnabled: true,
  tabBarLabelStyle: tabBarStyles.tabBarLabelStyle,
  tabBarIndicatorStyle: tabBarStyles.tabbarIndicator,
  tabBarScrollEnabled: true,
  tabBarContentContainerStyle: tabBarStyles.container,
  tabBarStyle: tabBarStyles.tabBarStyle,
  tabBarInactiveTintColor: '#BBBFC4',
  tabBarActiveTintColor: '#253545',
  tabBarPressColor: '#F0FBEA',
}


export const tabBarStylesPills = StyleSheet.create({
  tabbarIndicator: {
    height: 0,
    // borderWidth: 3,
  },
  tabBarLabelStyle: {
    fontSize: 14,
    fontFamily: 'moderat-medium',
    color: '#253545', // Dark text for inactive tabs
  },

  tabBarStyle: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderBottomWidth: 0,
    elevation: 0,
  },
  tabBarItemStyle: {
    borderRadius: 16, // Fully rounded corners for the pill shape
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 0,
    // backgroundColor: '#BBBFC4', // Light grey background for inactive tabs
    borderBottomWidth: 0,
    width: 'auto',
  },
});

export const tabBarScreenOptionsPills = {
  lazy: true,
  swipeEnabled: true,
  tabBarLabelStyle: tabBarStylesPills.tabBarLabelStyle,
  tabBarIndicatorStyle: tabBarStylesPills.tabbarIndicator,
  tabBarScrollEnabled: true,
  // tabBarContentContainerStyle: tabBarStylesPills.container,
  tabBarStyle: tabBarStylesPills.tabBarStyle,
  tabBarItemStyle: tabBarStylesPills.tabBarItemStyle,
  tabBarInactiveTintColor: '#BBBFC4',
  tabBarActiveTintColor: '#FFFFFF', // White text for active tab
  tabBarActiveBackgroundColor: '#62A446', // Green for active tab
  tabBarInactiveBackgroundColor: '#E3E9EC', // Grey for inactive tabs
};


