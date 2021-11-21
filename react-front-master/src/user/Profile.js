import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { Redirect, Link } from "react-router-dom";
import { read } from "./apiUser";
import DefaultProfile from "../images/avatar.jpg";
import DeleteUser from "./DeleteUser";
import FollowProfileButton from "./FollowProfileButton";
import ProfileTabs from "./ProfileTabs";
import { listByUser } from "../post/apiPost";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: { following: [], followers: [] },
      redirectToSignin: false,
      following: false,
      error: "",
      posts: []
    };
  }

  // check follow
  checkFollow = user => {
    const jwt = isAuthenticated();
    const match = user.followers.find(follower => {
      // one id has many other ids (followers) and vice versa
      return follower._id === jwt.user._id;
    });
    return match;
  };

  clickFollowButton = callApi => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    callApi(userId, token, this.state.user._id).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({ user: data, following: !this.state.following });
      }
    });
  };

  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToSignin: true });
      } else {
        let following = this.checkFollow(data);
        this.setState({ user: data, following });
        this.loadPosts(data._id);
      }
    });
  };

  loadPosts = userId => {
    const token = isAuthenticated().token;
    listByUser(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
      }
    });
  };

  componentDidMount() {
    const userId = this.props.match.params.userId;
    this.init(userId);
        document.body.style.backgroundImage = "url(" + "https://wallpapersmug.com/large/ba787c/black-dark-cubes-abstract.jpg" + ")"
  }

  componentWillReceiveProps(props) {
    const userId = props.match.params.userId;
    this.init(userId);
  }

  render() {

    const { redirectToSignin, user, posts } = this.state;
    if (redirectToSignin) return <Redirect to="/signin" />;

    const photoUrl = user._id
      ? `${process.env.REACT_APP_API_URL}/user/photo/${
          user._id
        }?${new Date().getTime()}`
      : DefaultProfile;

    return (


      <div className="container">
        <h2 className="mt-5 mb-5 display-3  text-white"> <text style = {{border: "2px solid ",
  borderRadius: "20px",
  backgroundColor: "black",
  padding: "15px",
  headerTitleAlign: 'center',
}}> <span>&nbsp;&nbsp;</span> Profile <span>&nbsp;&nbsp;</span></text></h2>

        <div className="row">

          <div className="col-md-4">


            <img
              style={{ height: "300px", width: "300px" ,  borderRadius: "50%", border:"2px solid"}}
              className="img-thumbnail"
              src={photoUrl}
              onError={i => (i.target.src = `${DefaultProfile}`)}
              alt={user.name}
            />
          </div>

          <div className="col-md-8">

            <div className="lead mt-2 text-white">
              <p className="display-3" style = {{fontFamily: "sans-serif"}}> {user.name}</p>
              <p>Email : {user.email}</p>

               <div className="row">
              <span>&nbsp;&nbsp;</span><span>&nbsp;&nbsp;</span> <p className="lead"><text style={{ fontWeight: 'bold' }}>{posts.length}</text> Posts</p> <span>&nbsp;&nbsp;</span>
               <p className="lead"><text style={{ fontWeight: 'bold' }}>{user.followers.length} </text> Followers</p> <span>&nbsp;&nbsp;</span>
               <p className="lead"><text style={{ fontWeight: 'bold' }}>{user.following.length} </text>Following</p>
               </div>
                <p className="lead">{user.about}</p>
                <footer class="blockquote-footer ">Joined on <cite title="Source Title">{new Date(user.created).toDateString()}</cite></footer>

          {  /*  <p>{`Joined on ${new Date(user.created).toDateString()}`}</p>*/}
            <br></br>
            </div>


            {isAuthenticated().user &&
            isAuthenticated().user._id === user._id ? (
              <div className="d-inline-block">
                <Link style={{borderRadius:"20px"}}
                  className="btn btn-raised btn-primary mr-5"
                  to={`/post/create`}
                >
                  Create Post
                </Link>

                <Link style={{borderRadius:"20px"}}
                  className="btn btn-raised btn-dark mr-5"
                  to={`/user/edit/${user._id}`}
                >
                  Edit Profile
                </Link>
                <DeleteUser userId={user._id} />
              </div>

            ) : (
              <FollowProfileButton
                following={this.state.following}
                onButtonClick={this.clickFollowButton}
              />
            )}

            <div>
              {isAuthenticated().user &&
                isAuthenticated().user.role === "admin" && (
                  <div class="card mt-5">
                    <div className="card-body">
                      <h5 className="card-title">Admin</h5>
                      <p className="mb-2 text-danger">
                        Edit/Delete as an Admin
                      </p>
                      <Link style={{borderRadius:"20px"}}
                        className="btn btn-raised btn-dark mr-5"
                        to={`/user/edit/${user._id}`}
                      >
                        Edit Profile
                      </Link>
                      {/*<DeleteUser userId={user._id} />*/}
                      <DeleteUser />
                    </div>
                  </div>
                )}
            </div>
          </div>
</div>


<hr style={{ border: "2px solid white"}}>
</hr>
        <div className="row text-white">

          <div className="col md-12 mt-5 mb-5">

            <ProfileTabs
              followers={user.followers}
              following={user.following}
              posts={posts}
            />
          </div>
        </div>
      </div>
    );
  }

}

export default Profile;
