import React from 'react';
import { connect } from 'react-redux';
import { logout } from '../../actions/session_actions';
import LoginNavbar from './login_navbar';

const mapStateToProps = (state) => ({
  user: state.entities.users[state.session.id]
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout())
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginNavbar);