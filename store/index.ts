import {createStore, applyMiddleware, Store, Dispatch, Middleware} from 'redux';
import thunk from 'redux-thunk';

import reducer from './reducers';
import {AppAction} from '~declarations';

const developmentMiddleware =
  (store: Store) => (next: Dispatch<AppAction>) => (action: AppAction) => {
    console.debug('[MIDDLEWARE] dispatching => ', action);
    const result = next(action);
    console.debug('[MIDDLEWARE] next state => ', store.getState());

    return result;
  };

const middleware =
  process.env.NODE_ENV === 'development'
    ? [thunk, developmentMiddleware]
    : [thunk];
const store = createStore(
  reducer,
  applyMiddleware(...(middleware as Middleware[])),
);

export default store;
