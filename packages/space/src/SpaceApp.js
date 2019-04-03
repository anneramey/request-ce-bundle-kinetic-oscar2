import { is } from 'immutable';
import { LocationProvider, Router } from '@reach/router';
import React, { Component } from 'react';
import { configureStore, history, context, store } from './redux/store';
import { types } from './redux/modules/app';
import { App } from './App';
import { Provider } from 'react-redux';

export const syncAppState = ([key, value]) => {
  store.dispatch({ type: types.SYNC_APP_STATE, payload: { key, value } });
};

export class SpaceApp extends Component {
  constructor(props) {
    super(props);
    this.state = { ready: false };
    // This needs to be called before we attempt to use the store below
    // otherwise it will be null. We call it here to make the API of this
    // embeddable app a little nicer (history can be passed to the component
    // rather than calling an additional `configure` function).
    configureStore(this.props.history);
    // Listen to the local store to see if the embedded app is ready to be
    // re-rendered. Currently this just means that the required props have been
    // synced into the local store.
    this.unsubscribe = store.subscribe(() => {
      const ready = store.getState().app.ready;
      if (ready !== this.state.ready) {
        this.setState({ ready });
      }
    });
  }

  componentDidMount() {
    Object.entries(this.props.appState).forEach(syncAppState);
  }

  componentDidUpdate(prevProps) {
    Object.entries(this.props.appState)
      .filter(([key, value]) => !is(value, prevProps.appState[key]))
      .forEach(syncAppState);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      this.state.ready && (
        <Provider store={store} context={context}>
          <LocationProvider history={history}>
            <Router>
              <App
                render={this.props.render}
                path={`${this.props.appState.location}/*`}
              />
            </Router>
          </LocationProvider>
        </Provider>
      )
    );
  }
}