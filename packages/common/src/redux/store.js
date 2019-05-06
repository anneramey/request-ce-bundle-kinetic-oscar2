import { createContext } from 'react';
import { connect as connectRedux } from 'react-redux';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';
import saga from './sagas';

console.log('Configuring common package redux store');

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ name: 'COMMON' })
  : compose;

const sagaMiddlware = createSagaMiddleware();

export const store = createStore(
  combineReducers({
    ...reducers,
  }),
  composeEnhancers(applyMiddleware(sagaMiddlware)),
);

sagaMiddlware.run(saga);

export const context = createContext(null);

export const connect = (
  mapStateToProps = null,
  mapDispatchToProps = null,
  mergeProps = null,
  options = {},
) =>
  connectRedux(mapStateToProps, mapDispatchToProps, mergeProps, {
    ...options,
    context,
  });