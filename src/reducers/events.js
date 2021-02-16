import { handleActions } from 'redux-actions';
import { Map, fromJS } from 'immutable';
import { createEvent, addEvent, bind, unlink, delEvent, editEvent, loadEvents } from 'actions'

const initialState = new Map({
  events: new Map(),
})

export const eventsReducer = handleActions({
  [loadEvents]: (state, action) => {
    const events = action.payload.reduce((acc, item) => {
      if (acc[item.eventDate]){
        acc[item.eventDate].push({...item})
      }else {
        acc[item.eventDate] = [{...item}]
      }
      return acc
    }, {})
    return state.set('events', fromJS(events))
  },
  [createEvent]: (state, action) => {
    const { eventDate, _id } = action.payload
    return state.setIn(['events', eventDate], fromJS([{...action.payload}]))
  },
  [addEvent]: (state, action) => {
    const { eventDate, _id } = action.payload;
    const events = state.getIn(['events', eventDate]).toJS()
    let newState;
    if (events.length == 0){
      newState = state.mergeIn(['events', eventDate], fromJS([{...action.payload}]))
    }
    events.forEach(el => { // В этои редюсере проверяется наличие _id, чтобы событие не добавлялось несколько раз т.к. при добавлении события, редюсер выполняется несколько раз
      if (el._id == _id){
        newState = state;
      }else {
        newState = state.mergeIn(['events', eventDate], fromJS([{...action.payload}]))
      }
    })
    return newState;
  },
  [bind]: (state, action) => {
    const { id, eventDate, tiedContact } = action.payload;
    return state.setIn(['events', eventDate, id, 'tiedContact'], fromJS(tiedContact))
  },
  [unlink]: (state, action) => {
    const { id, eventDate } = action.payload;
    return state.setIn(['events', eventDate, id, 'tiedContact'], '')
  },
  [delEvent]: (state, action) => {
    const { id, date } = action.payload;
    return state.removeIn(['events', date, id])
  },
  [editEvent]: (state, action) => {
    const { id, eventDate, event, tiedContact } = action.payload;
    return state.setIn(['events', eventDate, id], fromJS({eventDate, event, tiedContact}))
  }
}, initialState)