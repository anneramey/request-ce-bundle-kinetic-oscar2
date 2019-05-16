import React, { Component, Fragment } from 'react';
import { Provider } from 'react-redux';
import { matchPath } from 'react-router-dom';
import { LocationProvider, Router as ReachRouter } from '@reach/router';
import { connectedHistory, context, store } from 'tech-bar/src/redux/store';
import { CommonProvider } from 'common';
import { types } from './redux/modules/app';
import { App } from './App';
import { is } from 'immutable';

export const Router = ({ children, ...props }) => (
  <ReachRouter {...props} primary={false} component={Fragment}>
    {children}
  </ReachRouter>
);

export const syncAppState = ([key, value]) => {
  store.dispatch({ type: types.SYNC_APP_STATE, payload: { key, value } });
};

export class TechBarApp extends Component {
  constructor(props) {
    super(props);
    this.state = { ready: false };
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
          <CommonProvider>
            <LocationProvider history={connectedHistory}>
              <Router>
                <App
                  render={this.props.render}
                  path={`${this.props.appState.location}/*`}
                />
              </Router>
            </LocationProvider>
          </CommonProvider>
        </Provider>
      )
    );
  }

  static shouldSuppressSidebar = (pathname, kappSlug) =>
    matchPath(pathname, { path: `/kapps/${kappSlug}` });
  static shouldHideHeader = (pathname, kappSlug) =>
    matchPath(pathname, { path: `/kapps/${kappSlug}/display` });
}