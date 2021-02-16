import { combineReducers } from 'redux';
import { eventsReducer } from './events';
import { contactsReducer } from './contacts';
import { connectRouter } from 'connected-react-router';

export const initReducer = history => combineReducers({
  router: connectRouter(history),
  events: eventsReducer,
  contacts: contactsReducer,
})