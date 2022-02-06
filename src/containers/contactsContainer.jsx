import React, { PureComponent } from 'react';
import { Contacts } from 'components/contacts'
import { connect } from 'react-redux';
import { createContact, removeContact, editContact, listenContacts, listenEvents, unlinkContact } from 'actions';
class contactsContainer extends PureComponent {

  componentDidMount(){
    const { listenContacts, listenEvents } = this.props;
    listenContacts();
    listenEvents();
  }
  render(){
    const { contacts, events, createContact, removeContact, editContact, unlinkContact, openedContact, match } = this.props
    return(
      <Contacts contacts={contacts} events={events} addContact={createContact} del={removeContact} edit={editContact} Unlink={unlinkContact} openedContact={openedContact} match={match}/>
    )
  }
}
function mapStateToProps(state, ownProps){
  const { match } = ownProps;
  const events = state.events.get('events').toJS();
  const contacts = state.contacts.getIn(['entries', 'contacts']);
  let openedContact = null;
  if (match && contacts.has(match.params.id)){
    openedContact = contacts.get(match.params.id).toJS();
  }
  return {
    contacts: contacts.toList().toJS(),
    events,
    openedContact,
  }
}
function mapDispatchToProps(dispatch){
  return {
    createContact,
    editContact: (contact) => dispatch(editContact(contact)),
    removeContact: (id) => dispatch(removeContact(id)),
    listenContacts: () => dispatch(listenContacts()),
    listenEvents: () => dispatch(listenEvents()),
    unlinkContact: (contact) => dispatch(unlinkContact(contact))
  }
}

export const contactsRedux = connect(mapStateToProps, mapDispatchToProps)(contactsContainer)