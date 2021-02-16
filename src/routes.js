import { calendarRedux } from 'containers/calendarContainer'
import { contactsRedux } from 'containers/contactsContainer'

export const routes = [
  {
    path: '/',
    exact: true,
    component: calendarRedux
  },
  {
    path: '/contacts',
    exact: true,
    component: contactsRedux
  }
]