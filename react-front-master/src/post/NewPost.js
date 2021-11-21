import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { create } from "./apiPost";
import { Redirect } from "react-router-dom";

class NewPost extends Component {
    constructor() {
        super();
        this.state = {
            title: "",
            body: "",
            photo: "",
            error: "",
            user: {},
            fileSize: 0,
            loading: false,
            redirectToProfile: false
        };
    }

    componentDidMount() {
        this.postData = new FormData();
        this.setState({ user: isAuthenticated().user });
        document.body.style.backgroundImage = "url(" + "https://wallpapersmug.com/large/ba787c/black-dark-cubes-abstract.jpg" + ")"
    }

    isValid = () => {
        const { title, body, fileSize } = this.state;
        if (fileSize > 100000) {
            this.setState({
                error: "File size should be less than 100kb",
                loading: false
            });
            return false;
        }
        if (title.length === 0 || body.length === 0) {
            this.setState({ error: "All fields are required", loading: false });
            return false;
        }
        return true;
    };

    handleChange = name => event => {
        this.setState({ error: "" });
        const value =
            name === "photo" ? event.target.files[0] : event.target.value;

        const fileSize = name === "photo" ? event.target.files[0].size : 0;
        this.postData.set(name, value);
        this.setState({ [name]: value, fileSize });
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        if (this.isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;

            create(userId, token, this.postData).then(data => {
                if (data.error) this.setState({ error: data.error });
                else {
                    this.setState({
                        loading: false,
                        title: "",
                        body: "",
                        redirectToProfile: true
                    });
                }
            });
        }
    };

    newPostForm = (title, body) => (
        <form style={{border:"10px solid white",
      padding:"30px", backgroundColor:"white", borderRadius:"15px"}}>
            <div className="form-group">
                <h4 className="text-black">Post Photo</h4>
                <input
                    onChange={this.handleChange("photo")}
                    type="file"
                    accept="image/*"
                    className="form-control"
                />

            </div>
            <div className="form-group">

                  <h4 className="text-black">Title</h4>
                <input
                    onChange={this.handleChange("title")}
                    type="text"
                    className="form-control"
                    value={title}
                />
            </div>

            <div className="form-group">

                  <h4 className="text-black">Description</h4>
                <textarea
                    onChange={this.handleChange("body")}
                    type="text"
                    className="form-control"
                    value={body}
                />
            </div>

            <button
                onClick={this.clickSubmit}
                className="btn btn-raised btn-primary btn-lg"
            >
                Create Post
            </button>
            <br />
            <br />
            <br />
            <br />
            <br />

        </form>
    );

    render() {
        const {
            title,
            body,
            photo,
            user,
            error,
            loading,
            redirectToProfile
        } = this.state;

        if (redirectToProfile) {
            return <Redirect to={`/user/${user._id}`} />;
        }

        return (
            <div className="container">


            <h2 className="mt-5 mb-5 display-4  text-white"> <div style = {{border: "2px solid ",
      borderRadius: "20px",
      backgroundColor: "black",
      padding: "15px",
      textAlign: 'center',
    }}> <span>&nbsp;&nbsp;</span> Create a new post <span>&nbsp;&nbsp;</span></div></h2>
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

                {this.newPostForm(title, body)}
            </div>
        );
    }
}

export default NewPost;
