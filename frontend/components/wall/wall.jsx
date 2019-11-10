import React from 'react';
import WallIndex from'./wall_index';
import PostCreateFormContainer from '../post/post_create_form_container';
import FriendBox from '../friend/friend_box';
import FriendButton from '../friend/friend_button';
export default class Wall extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      update: "",
    }
  }
  componentDidMount() {
    this.props.fetchAllUsers()
    .then(() => this.props.fetchWallPosts(this.props.wallUser.id))
    .then(() => this.props.fetchUser(this.props.wallUser.id));
  }
  componentDidUpdate(prevProps) {
    if (prevProps.wallUser && prevProps.wallUser.id !== parseInt(this.props.match.params.userId)) {
      this.props.fetchWallPosts(parseInt(this.props.match.params.userId));
    }
  }

  render() {
    const { currentUser, wallUser } = this.props;
    if (!wallUser) return null;
    return(
      <div className= "prof-cont">
        <div className= "wall-header">
          <div className= "wall-cover-p" >
            <img className="wall-cover-pic" src={wallUser.coverPicUrl} />
            <div className="profile-pic-cont">
              <div className="profile-circle">
                <img className="profile-pic" src={wallUser.profPicUrl} />
              </div>
            </div>
            <div className="wall-name">
              {wallUser.firstName}  {wallUser.lastName} 
            </div>
            <FriendButton currentUser={currentUser} wallUser={wallUser}/>
          </div>
          <div className= "wall-header-bar">

          </div>
        </div>
        <div className="wall-main">
          <div className="wall-sidebar">
            <FriendBox wallUser={wallUser} allUsers={this.props.allUsers}/>
          </div>
          <div className="wall-cont">
            <div className="f-st">
              <PostCreateFormContainer wallUser={wallUser}/>
              <div>
              <WallIndex posts={this.props.posts} />
              </div>
            </div>
          </div>
        </div>
        
      </div>
    )
  }
}