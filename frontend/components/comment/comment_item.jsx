import React from 'react';
import { Link } from 'react-router-dom';
import timeUtil from '../../util/time_util';
import CommentDropdown from './comment_dropdown';
import TextareaAutosize from 'react-autosize-textarea';
import CommentLikers from './comment_likers';
import camera from '../../../app/assets/images/camera.png';
import circleLike from '../../../app/assets/images/circlelike.png';

export default class CommentItem extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      show: false,
      edit: false,
      id: this.props.comment.id,
      body: this.props.comment.body,
      photoFile: null,
      photoUrl: this.props.comment.photoUrl || null,
      
    }
    this.deletePic = this.deletePic.bind(this);
    this.handleCancel = this.handleCancel.bind(this)
    this.handleEdit = this.handleEdit.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleLike = this.handleLike.bind(this);
  }
  deletePic() {
    this.setState({ photoFile: null, photoUrl: null });
  }
  handleCancel() {
    this.setState({body:this.props.comment.body}, this.handleEdit);
  }
  handleEdit() {
    this.setState({
      edit: !this.state.edit,
    })
  }
  handleFile(e) {
    const file = e.currentTarget.files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.setState({ photoFile: file, photoUrl: fileReader.result });
    };
    if (file) fileReader.readAsDataURL(file);
  }
  handleHover() {
    this.setState({show: !this.state.show});
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
    const { comment, allUsers, deleteComment, currentUser } = this.props;
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
      <div className="comment-photo-div">
        <img src={comment.photoUrl} />
      </div>
    ) : null;
    
    let preview = this.state.photoUrl ? (
      <div className="comment-photo-preview-cont">
        <div className="comment-photo-preview-wrap">
          <span onClick={this.deletePic} className="comment-photo-x-cancel">&times;</span>
          <img className="comment-photo-preview" src={this.state.photoUrl} />
        </div>
      </div>) : null;

    let editForm = this.state.edit ? (
      <div className="comment-edit-cont">
        <div className="comment-edit-main">
          <div className="comment-prof-image">
            <img className="profile-pic" src={author.profPicUrl} />
          </div>
          <div className="comment-edit-ta-cont">
            <form className="comment-edit" onSubmit={this.handleSubmit}>
              <TextareaAutosize className="c-ta"
                onChange={this.handleInput}
                value={this.state.body}
                onKeyDown={this.handleKeyDown} />
            </form>
            <label className="comment-file-submit-overlay">
              <div className="edit-comment-button">
                <img src={camera} />
              </div>
              <input type="file" className="file-submit-button" onChange={this.handleFile} />
            </label>
          </div>
        </div>
        <div className="comment-cancel" onClick={this.handleCancel}>Cancel</div>
        { preview }
      </div>
    ) : ( 
        <div className="comment-cont" onMouseEnter={this.handleHover} onMouseLeave={this.handleHover} >
          <div className="comment-prof-image">
            <img className="profile-pic" src={author.profPicUrl} />
          </div>
          <div className="comment-body-image-cont">
            <div className="comment-body-relative">
              <div className="comment-body-dropdown">
                <div className="ci-i-b">
                  <div>
                    <span>{nameLink}</span><span className="comment-body">{this.state.body} </span>
                  </div>
                </div>
              {photoDiv}
              </div>
              {(this.state.show && author.id === currentUser.id) ?  (
              <CommentDropdown comment={comment} deleteComment={deleteComment} handleEdit={this.handleEdit}/>) : null}
              <CommentLikers likers={likers} currentUserId={this.props.currentUser.id} />
            </div>
            <div className="comment-like-reply">
              <div className="comment-footer">
                <div className={commentLikeButton} onClick={this.handleLike}>
                  Like 
                </div> ·
                <div className="comment-footer-time">
                  {timeUtil(comment.createdAt, "comment")}
                </div>
              </div>
            </div>
          </div>
        </div>
    );

    return(
      <div className="ci-i-c">
        {editForm}
      </div>
    );
  }
}