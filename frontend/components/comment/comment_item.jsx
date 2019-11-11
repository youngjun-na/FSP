import React from 'react';
import { Link } from 'react-router-dom';
import timeUtil from '../../util/time_util';
import CommentDropdown from './comment_dropdown';
import TextareaAutosize from 'react-autosize-textarea';
import CommentLikers from './comment_likers';

export default class CommentItem extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      show: false,
      edit: false,
      id: this.props.comment.id,
      body: this.props.comment.body,
      
    }
    this.handleEdit = this.handleEdit.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleLike = this.handleLike.bind(this);
  }
  handleEdit() {
    this.setState({
      edit: !this.state.edit,
    })
  }
  handleHover(e) {
    Array.from(e.target.children).forEach((el)=>{
      if (el.classList.contains("com-dd")) el.classList.toggle("invis")}
    )
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.updateComment(this.state)
      .then(this.setState({ edit: false }));
  }
  handleInput(e) {
    this.setState({
      body: e.target.value,
    })
  }
  handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (this.state.body) this.handleSubmit(e);
      else e.preventDefault();
    }
  }
  handleLike() {
    let likeId;
    this.props.comment.likes.forEach((like) => {
      if (like.author_id === this.props.currentUser.id) likeId = like.id
    });
    if (likeId) {
      this.props.deleteCommentLike(likeId);
    }
    else {
      this.props.createCommentLike(this.props.comment.id);
    }
  }
  render() {
    const { comment, allUsers, updateComment, deleteComment, currentUser } = this.props;
    let author = allUsers[comment.authorId];
    if (!author) return null;

    let nameLink = author.id ? (<Link className="ci-nl" to={`/profile/${author.id}`}>
      {author.firstName} {author.lastName}
    </Link>) : (<span></span>)

    let commentLikeButton = "comment-like-button";
    if (comment.likes.map((like) => like.author_id).includes(currentUser.id)) {
      commentLikeButton += "-liked"
    };

    let likers;
    if (this.props.allUsers) {
      likers = comment.likes.map((like) => {
        return this.props.allUsers[like.author_id];
      })
    };

    let photoDiv = comment.photoUrl ? (
      <div>
        <img src={comment.photoUrl} />
      </div>
    ) : null;

    let editForm = this.state.edit ? (
      <div className="comment-edit-cont">
        <div className="comment-prof-image">
          <img className="profile-pic" src={author.profPicUrl} />
        </div>
        <div>
          <form className="c-c comment-edit" onSubmit={this.handleSubmit}>
            <TextareaAutosize className="c-ta"
              onChange={this.handleInput}
              value={this.state.body}
              onKeyDown={this.handleKeyDown} />
          </form>
          <div className="comment-cancel" onClick={this.handleEdit}>Cancel</div>
        </div>
      </div>
    ) : ( 
        <div className="comment-cont" onMouseEnter={this.handleHover} onMouseLeave={this.handleHover} >
          <div className="comment-prof-image">
            <img className="profile-pic" src={author.profPicUrl} />
          </div>
          <div className="comment-body-dropdown">
            <div className="ci-i-b">
              <div>
                <span>{nameLink}</span><span className="comment-body">{this.state.body} </span>
                {photoDiv}
              </div>
              <CommentLikers likers={likers} currentUserId={this.props.currentUser.id} />
            </div>
            <CommentDropdown comment={comment} deleteComment={deleteComment} handleEdit={this.handleEdit}/>
          </div>
        </div>
    );

    return(
      <div className="ci-i-c">
        {editForm}
        <div className="comment-like-reply">
          <div className="pi-h-d">
            <div className={commentLikeButton} onClick={this.handleLike}>Like</div>
            {timeUtil(comment.createdAt, "comment")}
          </div>
        </div>
      </div>
    );
  }
}