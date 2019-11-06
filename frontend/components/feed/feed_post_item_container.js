import React from 'react';
import { connect } from 'react-redux';
import FeedPostItem from './feed_post_item';
import { updatePost, deletePost, receivePost } from '../../actions/post_actions';
import { openModal, closeModal } from '../../actions/modal_actions';

const mapStateToProps = state => ({
  allUsers: state.entities.users,
})
const mapDispatchToProps = dispatch => ({
  updatePost: post => dispatch(updatePost(post)),
  deletePost: post => dispatch(deletePost(post)),
  receivePost: post => dispatch(receivePost(post)),
  openModal: (type, paramId) => dispatch(openModal(type, paramId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedPostItem);