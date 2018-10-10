import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Home from './containers/home/Home';
import styles from './assets/styles/general.scss';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga'
import { Provider } from 'react-redux';
import rootReducer from './reducers/main';
import rootSaga from './sagas/rootSaga';

const sagaMiddleware = createSagaMiddleware()
let store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(sagaMiddleware),
);

sagaMiddleware.run(rootSaga)

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