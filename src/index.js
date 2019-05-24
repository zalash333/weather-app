import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {applyMiddleware, combineReducers, createStore} from "redux";
import weatherReducer from "./redux/weatherReducer";
import {Provider} from 'react-redux'
import thunk from "redux-thunk";

let store = createStore(combineReducers({weather:weatherReducer}),applyMiddleware(thunk));

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

serviceWorker.unregister();
