// App.js

import React from 'react'
import Navigation from "./Navigation/Navigation";
import {Provider} from "react-redux";
import Store from './Store/configueStore'

export default class App extends React.Component {
  render() {
    return (
        <Provider store={Store}>
          <Navigation/>
        </Provider>
    )
  }
}