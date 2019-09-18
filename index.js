import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Home from './containers/home/Home';
import styles from './assets/styles/general.scss';
import {
  applyMiddleware,
  createStore as createReduxStore,
  compose
} from "redux";
import createSagaMiddleware, { END } from "redux-saga";
import { Provider } from 'react-redux';
import rootReducer from './reducers/main';
import rootSaga from './sagas/rootSaga';

const composeEnhancers =
(
  typeof window === "object" &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
compose;
const sagaMiddleware = createSagaMiddleware();
const store = createReduxStore(
rootReducer,
composeEnhancers(applyMiddleware(sagaMiddleware))
);
store.runSaga = sagaMiddleware.run(rootSaga);
store.close = () => store.dispatch(END);


class AppToLoad extends Component {
    render() {
      return (
        <Provider store={store}>
          <Home />
        </Provider>
      );
    }
  }
  
  ReactDOM.render(
    <AppToLoad/>,
    document.getElementById('app')
  );
