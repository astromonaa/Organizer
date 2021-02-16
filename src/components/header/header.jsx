import React, { Component } from 'react';
import './header.css';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

export class Header extends Component {
  render(){
    return(
      <header className='page-header'>
        <Button variant="outlined" color="primary">
          <Link className='header-btn-link' to='/contacts'>Contacts</Link>
        </Button>
        <Button variant="outlined" color="primary">
          <Link className='header-btn-link' to='/'>Calendar</Link>
        </Button>
      </header>
    )
  }
}