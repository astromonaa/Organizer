import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import './calendar.css';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';

import { Header } from 'components/header';

import classNames from 'classnames';

export class Calendar extends Component {

  state = {
    months: ["Январь","Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    Month: null,
    oneHour: null,
    oneDay: null,
    year: null,
    lastDate: null,
    eventBlockIsVisible: false,
    event: '',
    eventDate: '',
    lastContactsBlock: null,
    eventFormVisible: false,
    lastEditBlock: null,
    eventDay: null,
    lastRemovedMarkDate: null,
  }
  componentDidMount(){
   this.calculateCalendarData();
   setTimeout(() => {
    this.renderCalendarEvents()
   }, 1000)
  }
  renderCalendarEvents = () => { // Функция рендерит отметки к датам с событиями на календаре при загрузке компонента
    const { Month, year, lastDate } = this.state;
    const { events } = this.props;
    let td_d = Array.from(document.getElementsByTagName("td"))
    for (let i = 0; i < lastDate; i++){
      let day = td_d[i].innerText
      const date = `${day}.${Month+1}.${year}`;
      if (events[date]){
        let eventMark = document.createElement('span');
        eventMark.classList.add('event-mark');
        eventMark.textContent = 'Event';
        eventMark.setAttribute('data-date', date)
        td_d[i].insertAdjacentElement('afterbegin', eventMark)
      }
    }
  }
  renderEventMark = (eventDate) => { // Функция рендерит отметку к дате на календаре, при создании события;
    const day = eventDate.split('.')[0];
    let td_d = Array.from(document.getElementsByTagName("td"))
    let find = td_d.find(el => el.innerText == day)
    if (find){
      let eventMark = document.createElement('span');
      eventMark.classList.add('event-mark');
      eventMark.textContent = 'Event';
      eventMark.setAttribute('data-date', eventDate)
      find.insertAdjacentElement('afterbegin', eventMark)
    }
  }
  calculateCalendarData = () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getUTCMonth();
    let today = date.getDate();

    let first_day = new Date(year, month, 1) //устанавливаем дату первого числа текущего месяца
    let first_weekDay = first_day.getDay(); //из нее вычисляем день недели первого числа текущего месяца
    let oneHour = 1000 * 60 * 60;
    let oneDay = oneHour * 24;
    let nextMonth = new Date(year, month + 1, 1);
    let lastDate = Math.ceil((nextMonth.getTime() - first_day.getTime() - oneHour) / oneDay) // вычисляем крайний день текущего месяца
    this.setState({
      Month: month,
      oneDay: oneDay,
      oneHour: oneHour,
      year: year,
      lastDate: lastDate,
    })
    this.renderCalendar(lastDate, today, month, year, first_weekDay)
  }
  renderCalendar = (lastDate, today, month, year, first_weekDay) => {
    let date = new Date();
    let currentMonth = date.getUTCMonth();
    let currentYear = date.getFullYear();
 
    let td_d = Array.from(document.getElementsByTagName("td"))
    td_d.splice(0, first_weekDay-1) // удаляем ненужные ячейки, чтобы первый день месяца совпадал с соответствующим днем недели
    for (let j = 0; j < lastDate; j++){
      td_d[j].innerHTML = 1 + j
      if (this.dayMoreThanYesterday(td_d[j].innerHTML, today, month, currentMonth, year, currentYear)){
        this.addCreateEventMark(td_d[j])
      }
      if (this.dayIsToday(td_d[j].innerText, today, month, currentMonth, year, currentYear)){ // Если день сегоднящний, то добавляем соответствующий id
        td_d[j].id = 'today';
      }else {
        td_d[j].classList.add('other-day') // Иначе добавляем соответствующий класс
      }
    }
    let table = document.querySelector('.table-body') // Если количество дней равно 28, то скрываем последнюю строку tr
    let tr = Array.from(table.querySelectorAll('tr'))
    if (this.daysCountIs_28(lastDate) && this.firstWeekDayIsMonday(first_weekDay)){ // Если число дней месяца равно 28 и первый день месяца - это понедельник, то скрываем последние 2 поля
      this.hideLast_2_Rows(tr)
    }else if (this.f_WeekDayLessThanSaturd(first_weekDay)) {
      this.hideLastRow(tr)
    }
  }
  daysCountIs_28 = (date) => {
    return date === 28;
  }
  firstWeekDayIsMonday = (first_weekDay) => {
    return first_weekDay == 1;
  }
  hideLast_2_Rows = (rows) => {
    rows[rows.length - 1].classList.add('hide')
    rows[rows.length - 2].classList.add('hide')
  }
  hideLastRow = (rows) => {
    rows[rows.length - 1].classList.add('hide')
  }
  dayIsToday = (day, today, month, currentMonth, year, currentYear) => {
    return day == today && month === currentMonth && year === currentYear
  }
  f_WeekDayLessThanSaturd = (week_Day) => { // возвращает true если первый день месяца меньше субботы
    return week_Day < 6
  }
  addCreateEventMark = (date) => {
    let contactIcon = document.createElement('div') // Если день больше или равен сегодняшнему дню, то добавляем иконку создания события
    contactIcon.classList.add('contact-icon')
    contactIcon.setAttribute('data-day', date.innerHTML) // Сохраняем соответствующий день в data аттрибуте тега
    contactIcon.addEventListener('click', event => this.openCreateEventBlock(event))
    date.append(contactIcon)
  }
  dayMoreThanYesterday = (day, today, month, currentMonth, year, currentYear) => {
    return (day >= today && month >= currentMonth && year >= currentYear) || (month > currentMonth && year >= currentYear) || (year > currentYear)
  }
  clearCalendar = () => {
    let table = document.querySelector('.table-body') // Находим тело календаря
    let td_d = Array.from(document.getElementsByTagName("td"))
    let tr = Array.from(table.querySelectorAll('tr')) //Находим теги внутри календаря
    tr[tr.length - 1].classList.remove('hide') //Заново отрисовываем скрытые поля
    tr[tr.length - 2].classList.remove('hide')

    for (let i = 0; i < td_d.length; i++){ //Заново отрисовываем скрытые ячейки
      td_d[i].classList.remove('hide')
      td_d[i].classList.remove('other-day')
      td_d[i].innerHTML = ''
    }
    let today = document.querySelector('#today')
    if (today){
      today.removeAttribute('id');
    }
  }
  switchMonth = (event) => {
    const { Month, oneHour, oneDay, year } = this.state
    let date = new Date();
    let today = date.getDate();
    let calendarYear = year;
    let calendarMonth;
    if (event.target.dataset.arrow == 'left'){
      calendarMonth = Month - 1
      if (calendarMonth === -1){
        calendarMonth = 11;
        calendarYear -= 1
      }
    }else if (event.target.dataset.arrow == 'right') {
      calendarMonth = Month + 1
      if (calendarMonth === 12){
        calendarMonth = 0
        calendarYear += 1
      }
    }else {
      return
    }
    let nextMonth = new Date(calendarYear, calendarMonth + 1, 1);
    let first_day = new Date(calendarYear, calendarMonth, 1)
    let first_weekDay = first_day.getDay();
    let lastDate = Math.ceil((nextMonth.getTime() - first_day.getTime() - oneHour) / oneDay)
    this.clearCalendar()
    this.renderCalendar(lastDate, today, calendarMonth, calendarYear, first_weekDay);
    setTimeout(() => {
      this.renderCalendarEvents()
    }, 500)
    this.setState({
      Month: calendarMonth,
      year: calendarYear,
      lastDate: lastDate,
    })
  }
  openCreateEventBlock = (event) => {
    const { Month, year } = this.state;
    const eventDay = event.target.dataset.day;
    const date = `${eventDay}.${Month+1}.${year}`;

    this.setState({
      eventBlockIsVisible: true,
      eventDate: date,
      eventDay: eventDay,
    })
  }
  closeCreateEventBlock = () => {
    this.setState({
      eventBlockIsVisible: false,
      event: '',
      eventFormVisible: false,
    })
  }
  handleInputChange = (event) => {
    const fieldName = event.target.name;
    this.setState({
      [fieldName]: event.target.value
    })
  }
  openCreateEventForm = () => {
    const { lastEditBlock, lastContactsBlock } = this.state;
    this.removeLastError();
    if (lastEditBlock){
      lastEditBlock.classList.add('edit-event-block')
    }
    if (lastContactsBlock){
      lastContactsBlock.classList.add('hide-block')
    }
    this.setState({
      eventFormVisible: true,
    })
  }
  closeCreateEventForm = () => {
    this.setState({
      eventFormVisible: false,
      event: '',
    })
  }
  createEvent = () => {
    const { event, eventDate} = this.state;
    const { events, createEvent, addEvent } = this.props
    const tiedContact = '';
    if (!this.checkEvent(event)){
      this.renderEventError();
      return
    }
    if(events[eventDate]){
      addEvent({eventDate, event, tiedContact})
    }else{
      createEvent({eventDate, event, tiedContact})
    }
    this.renderEventMark(eventDate) //Добавляем метку на календаре
    this.setState({
      event: '',
      eventFormVisible: false,
    })
  }
  renderEventError = (idx, id) => {
    this.removeLastError()
    let error = document.createElement('span');
    error.classList.add('event-add-error');
    error.textContent = 'Неправильный формат события';
    if (id == 'edit'){
      let errorInputs = document.querySelectorAll('.edit-error-input');
      errorInputs[idx].insertAdjacentElement('beforebegin', error);
    }else {
      let errorInput = document.querySelector('.error-input');
      errorInput.insertAdjacentElement('beforebegin', error)
    }
  }
  removeLastError = () => {
    let lastErrors = document.querySelectorAll('.event-add-error');
    if (lastErrors.length){
      lastErrors.forEach(el => el.remove())
    }
  }
  openContactsToBind = (eventId) => {
    const { lastContactsBlock, lastEditBlock } = this.state;
    if (lastContactsBlock){
      lastContactsBlock.classList.add('hide-block')
    }
    if (lastEditBlock){
      lastEditBlock.classList.add('edit-event-block')
    }
    let contactsBlocks = Array.from(document.querySelectorAll('.hide-block'));
    let currentContactsBlock = contactsBlocks.find(block => block.dataset.id == eventId)
    currentContactsBlock.classList.remove('hide-block')
    this.setState({
      lastContactsBlock: currentContactsBlock,
      eventFormVisible: false,
    })
  }
  closeContactsToBind = () => {
    const { lastContactsBlock } = this.state;
    lastContactsBlock.classList.add('hide-block')
  }
  bindContact = (contact, id, eventDate, _id, event) => {
    const { lastContactsBlock } = this.state
    const { bindContact } = this.props;
    const tiedContact = contact;

    bindContact({id, _id, eventDate, tiedContact, event})
    lastContactsBlock.classList.add('hide-block')
  }
  unlinkContact = (eventDate, id, _id, event) => {
    const { Unlink } = this.props;
    const tiedContact = '';
    Unlink({id, eventDate, _id, event, tiedContact})
  }
  deleteEvent = (date, id, _id) => { //id для фронтенда, _id для бэкенда
    const { delEvent, events } = this.props;
    delEvent({id, date, _id});
    if (events[date].length == 1){// Если все события удалены, то удаляем отметку даты на календаре
      this.removeEventMark(date);
    }
    this.setState({
      eventFormVisible: false,
    })
  }
  removeEventMark = (date) => {
    let td_d = Array.from(document.querySelectorAll('.event-mark'))
    let CalendarDate = td_d.find(el => el.dataset.date == date)
    CalendarDate.remove();
  }
  openEditInput = (id) => {
    const { lastEditBlock, lastContactsBlock } = this.state;
    this.removeLastError()
    if (lastEditBlock){
      lastEditBlock.classList.add('edit-event-block')
    }
    if (lastContactsBlock){
      lastContactsBlock.classList.add('hide-block')
    }
    const editBlocks = Array.from(document.querySelectorAll('.edit-event-block'))
    const currentEditBlock = editBlocks.find(input => input.dataset.id == id);
    currentEditBlock.classList.remove('edit-event-block');
    currentEditBlock.classList.add('edit-icons-block')
    this.setState({
      lastEditBlock: currentEditBlock,
      eventFormVisible: false,
    })
  }
  cancelEventEdit = () => {
    const { lastEditBlock } = this.state;
    lastEditBlock.classList.add('edit-event-block')
    this.setState({
      event: '',
    })
  }
  handleEventEdit = (id, editedEvent, _id) => { //id для фронтенда, _id для бэкенда
    const { editEvent } = this.props;
    const { event, eventDate, lastEditBlock } = this.state;
    const tiedContact = editedEvent.tiedContact;
    if (!this.checkEvent(event)){
      this.renderEventError(id, 'edit');
      return
    }
    editEvent({id, _id, eventDate, event, tiedContact})
    lastEditBlock.classList.add('edit-event-block')
    this.setState({
      event: '',
    })
  }
  checkEvent = (item) => {
    let result;
    if (item.match(/^[a-zA-Zа-яА-я0-9,_ ]{1,50}$/gi) === null){
      result = false;
    }else{
      result = true;
    }
    return result;
  }
  render(){
    const { months, Month, year, eventBlockIsVisible, event, eventDate, eventDay, eventFormVisible } = this.state
    const { events, contacts } = this.props;
    const openedDateEvents = events[eventDate] ? events[eventDate] : [];

    const eventBlockClasses = classNames('add-event-block',{
      'visible-create-event-block': eventBlockIsVisible
    })
    const eventBlockWrapperClasses = classNames('create-event-block-wrapper',{
      'visible-wrapper': eventBlockIsVisible
    })
    const createEventFormClasses = classNames('hide-event-input', {
      'show-event-input': eventFormVisible
    })
    const openCreateEventFormBtnClasses = classNames('open-create-event-form-btn', {
      'hide': eventFormVisible
    })
    return (
      <Fragment>
        <Header/>
        <div className='container'>
          <ChevronLeftIcon className='switchArrow left-arrow' data-arrow = 'left' onClick={this.switchMonth}/>
          <table className='calendar'>
            <caption className='table-head'>{`${months[Month]} ${year} г.`}</caption>
            <thead>
              <tr id='weekday'><th>пн</th><th>вт</th><th>ср</th><th>чт</th><th>пт</th><th>сб</th><th>вс</th></tr>
            </thead>
            <tbody className='table-body'>
              <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
              <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
              <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
              <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
              <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
              <tr><td></td><td></td><td></td></tr>
            </tbody>
          </table>
          <ChevronRightIcon className='switchArrow right-arrow' data-arrow = 'right' onClick={this.switchMonth}/>
          <div className={eventBlockWrapperClasses}>
            <div className={eventBlockClasses}>
              <div className="event-block-date">
                <h1 className='event-block-date-day'>{eventDay}</h1>
                <h2 className='event-block-date-month'>{months[Month]}</h2>
                <p className='event-block-date-year'>{`${year} г.`}</p>
              </div>
              <List className='events-list'>
                {
                  openedDateEvents.map((event, eventIdx) => 
                  <ListItem key={eventIdx} className='events-item'>
                    <div className="events-item-block">
                      <div className="event-name">
                        <ListItemText primary={event.event}/>
                        {
                          event.tiedContact.name ? <span>Привязано к {event.tiedContact.name} <Link to='/' onClick={() => this.unlinkContact(event.eventDate, eventIdx, event._id, event.event)}>Отвязать</Link></span> : <span></span>
                        }
                      </div>
                      <div className="event-control-btns">
                        <EditIcon onClick={() => this.openEditInput(eventIdx)} fontSize='large'/>
                        <DeleteForeverIcon onClick={() => this.deleteEvent(event.eventDate, eventIdx, event._id)} fontSize='large'/>
                        <Button variant='outlined' color='secondary' onClick={() => this.openContactsToBind(eventIdx)}>Привязать к контакту</Button>
                      </div>
                    </div>

                    <div className="edit-event-block" data-id={eventIdx}>
                      <TextField name='event' onChange={this.handleInputChange} className='edit-event-input edit-error-input' id="outlined-basic" label="Событие" variant="outlined" multiline={true} value={this.state.event}/>
                      <SaveIcon className='save-icon' fontSize='large'  onClick={() => this.handleEventEdit(eventIdx, event, event._id)}></SaveIcon>
                      <CancelPresentationIcon className='cancel-icon' fontSize='large' onClick={this.cancelEventEdit} ></CancelPresentationIcon>
                    </div>

                    <div className="contacts-for-bind hide-block" data-id={eventIdx}>
                      <div className="bind-contacts-list">
                        <List>
                          {
                            contacts.length ?
                            contacts.map((contact, idx) => 
                            <ListItem key={idx}>
                              <Link to='/' className='bind-contact-link' onClick={() => this.bindContact(contact, eventIdx, event.eventDate, event._id, event.event)}>
                                <ListItemText primary={contact.name}/>
                              </Link>
                            </ListItem>
                            )
                            :
                            <span className='empty-contacts-to-bind'>Список контактов пуст</span>
                          }
                        </List>
                      </div>
                      <Button className='close-contacts-btn' onClick={this.closeContactsToBind} variant='contained' color='primary'>Отмена</Button>
                    </div>
                  </ListItem>
                  )
                }
              </List>
              <Button className={openCreateEventFormBtnClasses} variant="contained" color="primary" onClick={this.openCreateEventForm}>Создать событие</Button>
              <div className={createEventFormClasses}>
                <TextField name='event' onChange={this.handleInputChange} className='event-input error-input' id="outlined-basic" label="Событие" variant="outlined" multiline={true} value={event}/>
                <div className="event-create-control-btns">
                  <Button onClick={this.createEvent} variant="contained" color="primary">Создать</Button>
                  <Button variant="contained" color="secondary" onClick={this.closeCreateEventForm}>Отмена</Button>
                </div>
              </div>
              <CloseIcon onClick={this.closeCreateEventBlock} variant="contained" className="close-add-event-block"/>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}