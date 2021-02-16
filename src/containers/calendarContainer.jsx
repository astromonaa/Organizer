import React, { PureComponent } from 'react';
import { Calendar } from 'components/calendar';
import { connect } from 'react-redux';
import { newEventDate, addNewEvent, bindContact, unlinkContact, removeEvent, EditEvent, listenEvents, listenContacts } from 'actions';

class calendarContainer extends PureComponent {

  componentDidMount(){
    const { listenEvents, listenContacts } = this.props;
    listenContacts();
    listenEvents();
  }
  render(){
    const { newEventDate, addNewEvent, events, contacts, bindContact, unlinkContact, removeEvent, EditEvent } = this.props
    return(
      <Calendar createEvent={newEventDate} events={events} addEvent={addNewEvent} contacts={contacts} bindContact={bindContact} Unlink={unlinkContact} delEvent={removeEvent} editEvent={EditEvent}/>
    )
  }
}
function mapStateToProps(state, ownProps){
  const events = state.events.get('events').toJS();
  const contacts = state.contacts.getIn(['entries', 'contacts']).toList().toJS()
  return {
    events,
    contacts,
  }
}
function mapDispatchToProps(dispatch){

  return {
    listenEvents: () => dispatch(listenEvents()),
    listenContacts: () => dispatch(listenContacts()),
    newEventDate,
    addNewEvent,
    bindContact: (contact) => dispatch(bindContact(contact)),
    unlinkContact: (contact) => dispatch(unlinkContact(contact)),
    removeEvent: (id) => dispatch(removeEvent(id)),
    EditEvent: (event) => dispatch(EditEvent(event))
  }
}

export const calendarRedux = connect(mapStateToProps, mapDispatchToProps)(calendarContainer)