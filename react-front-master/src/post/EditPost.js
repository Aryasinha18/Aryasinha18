import React, { Component } from "react";
import { singlePost, update } from "./apiPost";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";
import DefaultPost from "../images/mountains.jpg";

class EditPost extends Component {
    constructor() {
        super();
        this.state = {
            id: "",
            title: "",
            body: "",
            redirectToProfile: false,
            error: "",
            fileSize: 0,
            loading: false
        };
    }

    init = postId => {
        singlePost(postId).then(data => {
            if (data.error) {
                this.setState({ redirectToProfile: true });
            } else {
                this.setState({
                    id: data.postedBy._id,
                    title: data.title,
                    body: data.body,
                    error: ""
                });
            }
        });
    };

    componentDidMount() {
        this.postData = new FormData();
        const postId = this.props.match.params.postId;
        this.init(postId);
          document.body.style.backgroundImage = "url(" + "https://wallpapersmug.com/large/ba787c/black-dark-cubes-abstract.jpg" + ")"
    }

    isValid = () => {
        const { title, body, fileSize } = this.state;
        if (fileSize > 1000000) {
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
            const postId = this.props.match.params.postId;
            const token = isAuthenticated().token;

            update(postId, token, this.postData).then(data => {
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

    editPostForm = (title, body) => (
        <form>
            <div className="form-group">
                <h4 className="text-white">Post Photo</h4>
                <input
                    onChange={this.handleChange("photo")}
                    type="file"
                    accept="image/*"
                    className="form-control text-white display-5"
                />
            </div>
            <br/>
            <div className="form-group">
                <h4 className="text-white">Title</h4>
                <input
                    onChange={this.handleChange("title")}
                    type="text"
                    className="form-control text-white display-5"
                    value={title}
                />
            </div>
            <br/>

            <div className="form-group">
                <h4 className="text-white">Body</h4>
                <textarea
                    onChange={this.handleChange("body")}
                    type="text"
                    className="form-control text-white display-5"
                    value={body}
                />
            </div>

            <button
                onClick={this.clickSubmit}
                className="btn btn-raised btn-primary"
            >
                Update Post
            </button>
        </form>
    );

    render() {
        const {
            id,
            title,
            body,
            redirectToProfile,
            error,
            loading
        } = this.state;

        if (redirectToProfile) {
            return <Redirect to={`/user/${isAuthenticated().user._id}`} />;
        }

        return (
            <div className="container">

                <h2 className="mt-5 mb-5 display-4  text-white"> <div style = {{border: "2px solid ",
          borderRadius: "20px",
          backgroundColor: "black",
          padding: "15px",
          textAlign: 'center',
        }}> <span>&nbsp;&nbsp;</span> Edit Post <span>&nbsp;&nbsp;</span></div></h2>

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
                <h4 className="display-2 mt-3 mb-5 text-white" style={{textAlign:""}}>{title}</h4>
                <img
                    style={{ height: "200px", width: "auto" }}
                    className="img-thumbnail"
                    src={`${
                        process.env.REACT_APP_API_URL
                    }/post/photo/${id}?${new Date().getTime()}`}
                    onError={i => (i.target.src = `${DefaultPost}`)}
                    alt={title}
                />

                {isAuthenticated().user.role === "admin" &&
                    this.editPostForm(title, body)}

                {isAuthenticated().user._id === id &&
                    this.editPostForm(title, body)}

                    </div>
            </div>
        );
    }
}

export default EditPost;
