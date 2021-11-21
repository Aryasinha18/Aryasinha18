import React, { Component } from "react";
import { list } from "./apiUser";
import DefaultProfile from "../images/avatar.jpg";
import { Link } from "react-router-dom";



class Users extends Component {
    constructor() {
        super();
        this.state = {
            users: []
        };
    }


    componentDidMount() {
        list().then(data => {
        //  document.body.style.backgroundColor = "black"
        document.body.style.backgroundImage = "url(" + "https://wallpapersmug.com/large/ba787c/black-dark-cubes-abstract.jpg" + ")"

            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ users: data });
            }
        });
    }




    renderUsers = users => (
       <div stye={{backgroundColor:"#1f403d"}}>
        <div className="card-rows" >

            {users.map((user, i) => (
                <div className="card mr-3 mb-4"style={{ boxShadow: "5px 10px #242022", borderRadius: "15px",backgroundColor: "black", flexDirection: "row", width:"68rem"}} key={i}>
                    <img
                      style={{ height: "200px", width: "200px" ,  borderRadius: "50%", border: "1px solid black"}}

                        className="img-thumbnail"
                        src={`${process.env.REACT_APP_API_URL}/user/photo/${
                            user._id
                        }`}
                        onError={i => (i.target.src = `${DefaultProfile}`)}
                        alt={user.name}
                    />

                    <div className="card-body col" >


                        <h5 className="card-title text-white">{user.name}</h5>
                        <h6 className="card-text text-white">{user.email} </h6>
                          <p className="lead">{user.about}</p>
                       <footer class="blockquote-footer text-white">Joined on <cite title="Source Title">{new Date(user.created).toDateString()}</cite></footer>
               <br />

                        <Link
                            to={`/user/${user._id}`}
                            className="btn btn-raised btn-dark btn-lg me-2"
                        >
                            View Profile
                        </Link>
                    </div>

                </div>


            ))}

        </div>

</div>
    );


    render() {
        const { users } = this.state;
        return (


            <div className="container">

                <h2 className="mt-5 mb-5 display-2  text-white"> <div style = {{fontFamily:"Noto Sans, sans-serif",textAlign: "center"
        }}> <span>&nbsp;&nbsp;</span><text style={{}}>Active Users </text><span>&nbsp;&nbsp;</span></div></h2>


                {this.renderUsers(users)}
            </div>

        );
    }
}



export default Users;
