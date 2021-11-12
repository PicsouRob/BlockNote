import React from 'react';
import { StatusBar, View } from 'react-native';
import 'react-native-gesture-handler';
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/lib/integration/react";

import BlockNaviggation from "./src/Components/StackNavigation";
import store from './src/Redux/Store';

function App() {
  const persistor = persistStore(store);
  
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <View style={{ flex: 1 }}>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          <BlockNaviggation />
        </View>
      </PersistGate>
    </Provider>
  );
};

export default App;