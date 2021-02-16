import { createAction } from 'redux-actions';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

export const loadEvents = createAction('[Events] Load Events');
export const createEvent = createAction('[Events] Create Event');
export const addEvent = createAction('[Events] Add new event');
export const delEvent = createAction('[Events] Delete Event');
export const editEvent = createAction('[Events] Edit Event');
export const loadContacts = createAction('[Contacts] Load Contacts')
export const addContact = createAction('[Contacts] Add contact');
export const delContact = createAction('[Contacts] Delete Contact');
export const bind = createAction('[Calendar], Bind Contact');
export const unlink = createAction('[Calendar] Unlink Contact');

export function listenContacts(){
  return function(dispatch){
    fetch('http://localhost:3000/contacts')
      .then(res => res.json())
      .then((contacts) => {
        dispatch(loadContacts(contacts))
      })
    socket.on('new contact', (contact) => {
      dispatch(addContact(contact))
    });
  }
}

export function listenEvents(){
  return function(dispatch){
    fetch('http://localhost:3000/events')
      .then(res => res.json())
      .then((events) => {
        dispatch(loadEvents(events))
      })
    socket.on('event date', (event) => {
      dispatch(createEvent(event))
    })
    socket.on('add event', (event) => {
      dispatch(addEvent(event))
    })
  }
}

export function removeContact(id){
  return function(dispatch){
    fetch(`http://localhost:3000/contacts/${id}`, {
      method: 'DELETE',
    })
    .then(() => {
      dispatch(delContact(id))
    })
  }
}

export function removeEvent(event){
  return function(dispatch){
    fetch( `http://localhost:3000/events/${event._id}`, {
      method: 'DELETE',
    })
    .then(() => {
      dispatch(delEvent(event))
    })
  }
}

export function editContact(contact){
  return function(dispatch){
    fetch(`http://localhost:3000/contacts/${contact._id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(contact)
    })
    .then(() => {
      dispatch(addContact(contact))
    })
  }
}

export function EditEvent(event){
  return function(dispatch){
    fetch(`http://localhost:3000/events/${event._id}`, {
      method: 'PUT',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(event)
    })
    .then(() => {
      dispatch(editEvent(event))
    })
  }
}

export function bindContact(event){
  return function(dispatch){
    fetch(`http://localhost:3000/events/${event._id}`, {
      method: 'PUT',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(event)
    })
    .then(dispatch(bind(event)))
  }
}
export function unlinkContact(event){
  return function(dispatch){
    fetch(`http://localhost:3000/events/${event._id}`, {
      method: 'PUT',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(event)
    })
    .then(dispatch(unlink(event)))
  }
}

export function createContact(contact){
  socket.emit('new contact', contact);
}
export function newEventDate(event){
  socket.emit('event date', event)
}
export function addNewEvent(event){
  socket.emit('add event', event)
}
