import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import './contacts.css';
import { Header } from 'components/header';

import classNames from 'classnames';
export class Contacts extends Component {

  state = {
    name: '',
    tel: '',
    email: '',
    note: '',
    birthday: '',
    inputsAreVisible: false,
    editInputsVisible: false,
    lastContact: '',
  }

  handleInputChange = (event) => {
    const fieldName = event.target.name;
    this.setState({
      [fieldName]: event.target.value
    })
  }
  addContact = () => {
    const { name, tel, email, note, birthday } = this.state;
    const { addContact } = this.props;

    if (!this.checkName(name) || !this.checkTel(tel) || !this.checkEmail(email) || !this.checkNote(note) || !this.checkDate(birthday)){
      this.renderUserAddErrors(name, tel, email, note, birthday)
      return
    }
    addContact({name, tel, email, note, birthday})
    this.setState({
      name: '',
      tel: '',
      email: '',
      note: '',
      birthday: '',
      inputsAreVisible: false,
      editInputsVisible: false,
    })
  }
  renderUserAddErrors = (name, tel, email, note, birthday) => {
    this.removeErrors();
    let inputs = document.querySelectorAll('.block-input');
    for(let i = 0; i < inputs.length; i++){
      let error = document.createElement('span');
      error.classList.add('contact-add-error');
      inputs[i].insertAdjacentElement('beforeend', error);
      if (inputs[i].dataset.name == 'name'){
        if (!this.checkName(name)){
          error.textContent = 'Неверный формат имени'
        }
      }else if (inputs[i].dataset.name == 'tel'){
        if (!this.checkTel(tel)){
          error.textContent = 'Неверный формат телефона'
        }
      }else if (inputs[i].dataset.name == 'email'){
        if (!this.checkEmail(email)){
          error.textContent = 'Неверный формат email'
        }
      }else if (inputs[i].dataset.name == 'note'){
        if (!this.checkNote(note)){
          error.textContent = 'Неверный формат заметки'
        }
      }else if (inputs[i].dataset.name == 'birthday'){
        if (!this.checkDate(birthday)){
          error.textContent = 'Неверный формат даты'
        }
      }
    }
  }
  removeErrors = () => {
    let errors = document.querySelectorAll('.contact-add-error');
    if (errors.length){
      for (let i = 0; i < errors.length; i++){
        errors[i].remove()
      }
    }
  }
  editContact = (_id) => {
    const { name, tel, email, note, birthday, lastContact } = this.state;
    const { edit } = this.props;
    if (!this.checkName(name) || !this.checkTel(tel) || !this.checkEmail(email) || !this.checkNote(note) || !this.checkDate(birthday)){
      this.renderUserAddErrors(name, tel, email, note, birthday)
      return
    }
    edit({_id, name, tel, email, note, birthday})
    lastContact.classList.add('contact-inputs')
    this.setState({
      name: '',
      tel: '',
      email: '',
      note: '',
      birthday: '',
      inputsAreVisible: false,
      editInputsVisible: false,
    })
  }
  openAddContactBlock = () => {
    this.removeErrors();
    this.setState({
      inputsAreVisible: true,
    })
  }
  cancelContactAdd = () => {
    const { lastContact } = this.state;
    if (lastContact.classList){
      lastContact.classList.add('contact-inputs')
    }
    this.setState({
      editInputsVisible: false,
      inputsAreVisible: false,
      name: '',
      tel: '',
      email: '',
      note: '',
      birthday: '',
    })
  }
  deleteContact = (contact) => {
    const { del } = this.props;
    this.wasContactAttached(contact)
    del(contact._id)
    this.setState({
      inputsAreVisible: false,
      editInputsVisible: false,
    })
  }
  wasContactAttached = (contact) => {
    const { events, Unlink } = this.props;
    for(let date in events){
      events[date].forEach((event, idx) => {
        if (event.tiedContact._id == contact._id){
          const tiedContact = '';
          Unlink({eventDate: event.eventDate, _id: event._id, event: event.event, tiedContact})
        }
      })
    }
  }
  openEditContactBlock = (id) => {
    const { lastContact } = this.state;
    this.removeErrors();
    if (lastContact.classList){
      lastContact.classList.add('contact-inputs')
    }
    let contacts = Array.from(document.querySelectorAll('.contact-inputs'))
    let currentContact = contacts.find(contact => contact.dataset.id == id)
    currentContact.classList.remove('contact-inputs');
    this.setState({
      editInputsVisible: true,
      lastContact: currentContact,
    })
  }
  checkName = (name) => {
    let result;
    if (name.match(/^[a-zA-Zа-яА-я ]{2,30}$/i) === null){
      result = false;
    }else {
      result = true;
    }
    return result;
  }
  checkNote = (item) => {
    let result;
    if (item.match(/^[a-zA-Zа-яА-я0-9,_ ]{1,50}$/gi) === null){
      result = false;
    }else{
      result = true;
    }
    return result;
  }
  checkTel = (tel) => {
    let result;
    if (tel.match(/\+7[\-]\d{3}[\-]\d{3}[\-]\d{4}/) === null){
      result = false;
    }else{
      result = true;
    }
    return result;
  }
  checkEmail = (email) => {
    let result;
    if (email.match(/.+@.+\..+/i) === null){
      result = false;
    }else {
      result = true;
    }
    return result;
  }
  checkDate = (date) => {
    let result;
    if (date.match(/^(\1(?:19|20)\d\d)(\-)(?:0[1-9]|1[0-9]|2[0-9]|3[0-1])(\-)(?:0[1-9]|1[0-2])$/) === null){
      result = false;
    }else {
      result = true;
    }
    return result;
  }
  render(){
    const { name, tel, email, note, birthday, inputsAreVisible, editInputsVisible } = this.state;
    const { contacts } = this.props;
    const inputsClasses = classNames('contact-inputs', {
      'visible': inputsAreVisible,
      'hide': editInputsVisible,
    })
    const openBlockBtnClasses = classNames('open-contact-add-block-btn', {
      'hide': inputsAreVisible || editInputsVisible,
    })
    return(
      <Fragment>
        <Header/>
        <div className="contacts-container">
          <List>
            {
              contacts.map((contact, idx) => 
              <ListItem key={idx} className='contact'>
                <div className="contact-data">
                  <ListItemText primary={contact.name}/>
                  <DeleteIcon onClick={() => this.deleteContact(contact)} className='contact-delete-btn'/>
                  <EditIcon onClick={() => this.openEditContactBlock(contact._id)} className='contact-edit-btn'/>
                </div>
                <div className='contact-inputs' data-id={contact._id}>
                  <TextField onChange={this.handleInputChange} name='name' data-name='name' className='contact-edit-input block-input' label="Иванов Иван Иванович" variant="outlined" value={name}/>
                  <TextField onChange={this.handleInputChange} name='tel' data-name='tel' className='contact-edit-input block-input' label="+7-000-000-0000" variant="outlined" value={tel}/>
                  <TextField onChange={this.handleInputChange} name='email' data-name='email' className='contact-edit-input block-input' label="myMail@gmail.com" variant="outlined" value={email}/>
                  <TextField onChange={this.handleInputChange} name='note' data-name='note' className='contact-edit-input block-input' label="Заметка" variant="outlined" value={note} multiline/>
                  <TextField type='date' onChange={this.handleInputChange} name='birthday' data-name='birthday' className='contact-edit-input block-input' variant="outlined" value={birthday}/>
                  <div className="add-contact-control-btns">
                    <Button onClick={() => this.editContact(contact._id)} className='edit-contact-btn' variant="contained" color="primary" size="small" startIcon={<SaveIcon />}>Сохранить</Button>
                    <Button onClick={this.cancelContactAdd} variant="outlined" color="secondary">Отмена</Button>
                  </div>
                </div>
              </ListItem>)
            }
          </List>
          <Button onClick={this.openAddContactBlock} className={openBlockBtnClasses} variant="outlined" color="primary">Добавить контакт</Button>
          <div className={inputsClasses}>
            <TextField onChange={this.handleInputChange} name='name' data-name='name' className='contact-add-input block-input' label="Иванов Иван Иванович" variant="outlined" value={name}/>
            <TextField onChange={this.handleInputChange} name='tel' data-name='tel' className='contact-add-input block-input' label="+7-000-000-0000" variant="outlined" value={tel}/>
            <TextField onChange={this.handleInputChange} name='email' data-name='email' className='contact-add-input block-input' label="myMail@gmail.com" variant="outlined" value={email}/>
            <TextField onChange={this.handleInputChange} name='note' data-name='note' className='contact-add-input block-input' label="Заметка" variant="outlined" value={note} multiline/>
            <TextField type='date' onChange={this.handleInputChange} name='birthday' data-name='birthday' className='contact-add-input block-input' variant="outlined" value={birthday}/>
            <div className="add-contact-control-btns">
              <Button onClick={this.addContact} className='add-contact-btn' variant="contained" color="primary" size="small" startIcon={<SaveIcon />}>Добавить</Button>
              <Button onClick={this.cancelContactAdd} variant="contained" color="primary">Отмена</Button>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}