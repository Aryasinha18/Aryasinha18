import React, { Component } from "react";
import { signup } from "../auth";
import { Link } from "react-router-dom";
import SocialLogin from "./SocialLogin";

class Signup extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            error: "",
            open: false,
            recaptcha: false
        };
    }

    componentDidMount() {
      document.body.style.backgroundImage = "url(" + "https://wallpapersmug.com/large/ba787c/black-dark-cubes-abstract.jpg" + ")"
    };

    handleChange = name => event => {
        this.setState({ error: "" });
        this.setState({ [name]: event.target.value });
    };

    recaptchaHandler = e => {
        this.setState({ error: "" });
        let userDay = e.target.value.toLowerCase();
        let dayCount;

        if (userDay === "sunday") {
            dayCount = 0;
        } else if (userDay === "monday") {
            dayCount = 1;
        } else if (userDay === "tuesday") {
            dayCount = 2;
        } else if (userDay === "wednesday") {
            dayCount = 3;
        } else if (userDay === "thursday") {
            dayCount = 4;
        } else if (userDay === "friday") {
            dayCount = 5;
        } else if (userDay === "saturday") {
            dayCount = 6;
        }

        if (dayCount === new Date().getDay()) {
            this.setState({ recaptcha: true });
            return true;
        } else {
            this.setState({
                recaptcha: false
            });
            return false;
        }
    };

    clickSubmit = event => {
        event.preventDefault();
        const { name, email, password } = this.state;
        const user = {
            name,
            email,
            password
        };
        // console.log(user);
        if (this.state.recaptcha) {
            signup(user).then(data => {
                if (data.error) this.setState({ error: data.error });
                else
                    this.setState({
                        error: "",
                        name: "",
                        email: "",
                        password: "",
                        open: true
                    });
            });
        } else {
            this.setState({
                error: "What day is today? Please write a correct answer!"
            });
        }
    };

    signupForm = (name, email, password, recaptcha) => (
        <form style={{border:"5px solid black",
      padding:"30px",borderRadius:"15px"}}>
            <div className="form-group">
                <h4 className="text-white">Name</h4>
                <input
                    onChange={this.handleChange("name")}
                    type="text"
                    className="form-control text-white "
                    value={name}
                />
            </div>
            <div className="form-group">
                <h4 className="text-white">Email</h4>
                <input
                    onChange={this.handleChange("email")}
                    type="email"
                    className="form-control text-white"
                    value={email}

                />
            </div>
            <div className="form-group">
                <h4 className="text-white">Password</h4>
                <input
                    onChange={this.handleChange("password")}
                    type="password"
                    className="form-control text-white"
                    value={password}
                />
            </div>

            <div className="form-group">
                <h4 className="text-white">
                    {recaptcha ? "Thanks. You got it!" : "What day is today?"}
                </h4>

                <input
                    onChange={this.recaptchaHandler}
                    type="text"
                    className="form-control text-white"
                />
            </div>

            <br />
            <br />
            <br />

            <button
                onClick={this.clickSubmit}
                className="btn btn-raised btn-primary btn-lg"
            >
                Submit
            </button>
        </form>
    );

    render() {
        const { name, email, password, error, open, recaptcha } = this.state;
        return (
            <div className="container">

                <h2 className="mt-5 mb-5 display-4  text-white"> <div style = {{border: "2px solid ",
          borderRadius: "20px",
          backgroundColor: "black",
          padding: "15px",
          textAlign: 'center',
        }}> <span>&nbsp;&nbsp;</span> Signup <span>&nbsp;&nbsp;</span></div></h2>


                <SocialLogin />

                <br />
                <br />

                <div
                    className="alert alert-danger"
                    style={{ display: error ? "" : "none" }}
                >
                    {error}
                </div>

                <div
                    className="alert alert-info"
                    style={{ display: open ? "" : "none" }}
                >
                    New account is successfully created. Please{" "}
                    <Link to="/signin">Sign In</Link>.
                </div>

                {this.signupForm(name, email, password, recaptcha)}
            </div>
        );
    }
}

export default Signup;
