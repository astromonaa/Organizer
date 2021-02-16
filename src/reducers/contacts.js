import { handleActions } from 'redux-actions';
import { Map, fromJS } from 'immutable';
import { addContact, delContact, loadContacts } from 'actions';

const initialState = new Map({
  entries: new Map({
    contacts: new Map(),
  })
})

export const contactsReducer = handleActions({
  [loadContacts]: (state, action) => {
    const entries = action.payload.reduce((acc, item) => {
      acc[item._id] = {...item}

      return acc
    }, {})
    return state.setIn(['entries', 'contacts'], fromJS(entries))
  },
  [addContact]: (state, action) => {
    const { _id } = action.payload;
    return state.setIn(['entries', 'contacts', _id], fromJS({...action.payload}))
  },
  [delContact]: (state, action) => {
    return state.removeIn(['entries', 'contacts', action.payload])
  }
}, initialState)