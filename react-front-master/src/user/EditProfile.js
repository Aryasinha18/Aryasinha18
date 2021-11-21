import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { read, update, updateUser } from "./apiUser";
import { Redirect } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";

class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      email: "",
      password: "",
      redirectToProfile: false,
      error: "",
      fileSize: 0,
      loading: false,
      about: ""
    };
  }

  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          email: data.email,
          error: "",
          about: data.about
        });
      }
    });
  };

  componentDidMount() {
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    this.init(userId);

      document.body.style.backgroundImage = "url(" + "https://wallpapersmug.com/large/ba787c/black-dark-cubes-abstract.jpg" + ")"


  }

  isValid = () => {
    const { name, email, password, fileSize } = this.state;
    if (fileSize > 1000000) {
      this.setState({
        error: "File size should be less than 100kb",
        loading: false
      });
      return false;
    }
    if (name.length === 0) {
      this.setState({ error: "Name is required", loading: false });
      return false;
    }
    // email@domain.com
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      this.setState({
        error: "A valid Email is required",
        loading: false
      });
      return false;
    }
    if (password.length >= 1 && password.length <= 5) {
      this.setState({
        error: "Password must be at least 6 characters long",
        loading: false
      });
      return false;
    }
    return true;
  };

  handleChange = name => event => {
    this.setState({ error: "" });
    const value = name === "photo" ? event.target.files[0] : event.target.value;

    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    this.userData.set(name, value);
    this.setState({ [name]: value, fileSize });
  };

  clickSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });

    if (this.isValid()) {
      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;

      update(userId, token, this.userData).then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else if (isAuthenticated().user.role === "admin") {
          this.setState({
            redirectToProfile: true
          });
        } else {
          updateUser(data, () => {
            this.setState({
              redirectToProfile: true
            });
          });
        }
      });
    }
  };

  signupForm = (name, email, password, about) => (
    <form >
      <div className="form-group">
        <h5 className="text-white">Profile Photo</h5>
        <input
          onChange={this.handleChange("photo")}
          type="file"
          accept="image/*"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <h4 className="text-white">Name</h4>
        <input
          onChange={this.handleChange("name")}
          type="text"
          className="form-control  text-white display-5"
          value={name}
        />
      </div>
      <div className="form-group">
        <h4 className="text-white">Email</h4>
        <input
          onChange={this.handleChange("email")}
          type="email"
          className="form-control  text-white display-5"
          value={email}
        />
      </div>

      <div className="form-group">
        <h4 className="text-white">About</h4>
        <textarea
          onChange={this.handleChange("about")}
          type="text"
          className="form-control text-white display-5"
          value={about}

        />
      </div>

      <div className="form-group">
        <h4 className="text-white">Password</h4>
        <input
          onChange={this.handleChange("password")}
          type="password"
          className="form-control  text-white display-5"
          value={password}
        />
      </div>
      <button onClick={this.clickSubmit} className="btn btn-raised btn-primary btn-lg" style={{borderRadius:"20px"}}>
        Update
      </button>
    </form>
  );

  render() {
    const {
      id,
      name,
      email,
      password,
      redirectToProfile,
      error,
      loading,
      about
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }

    const photoUrl = id
      ? `${
          process.env.REACT_APP_API_URL
        }/user/photo/${id}?${new Date().getTime()}`
      : DefaultProfile;

    return (
      <div className="container">
      <h2 className="mt-5 mb-5 display-4  text-white"> <div style = {{border: "2px solid ",
borderRadius: "20px",
backgroundColor: "black",
padding: "15px",
textAlign: 'center',
}}> <span>&nbsp;&nbsp;</span> Edit Profile <span>&nbsp;&nbsp;</span></div></h2>
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        {loading ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          ""
        )}
       <div style={{border:"5px solid white",
     padding:"30px",borderRadius:"15px"}}>
        <img
          style={{ height: "200px", width: "auto" }}
          className="img-thumbnail"
          src={photoUrl}
          onError={i => (i.target.src = `${DefaultProfile}`)}
          alt={name}
        />

        {isAuthenticated().user.role === "admin" &&
          this.signupForm(name, email, password, about)}

        {isAuthenticated().user._id === id &&
          this.signupForm(name, email, password, about)}
          </div>
      </div>
    );
  }
}

export default EditProfile;
