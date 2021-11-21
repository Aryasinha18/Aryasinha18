import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signout, isAuthenticated } from '../auth';

const isActive = (history, path) => {
    if (history.location.pathname === path) return { color: '#1d423f' };
    else return { color: '#ffffff' };
};

const Menu = ({ history }) => (
    <div style={{backgroundColor:"#003300"}}>
   <text style={{fontSize:"100px"}}>
        <ul className="nav nav-tabs clear " style={{backgroundColor:"#000000"}}>

            <li className="nav-item">
                <Link className="nav-link" style={isActive(history, '/')} to="/">
                <text style={{fontSize:"20px"}}>   Home </text>
                </Link>
            </li>

            <li className="nav-item">
                <Link
                    className={history.location.pathname === '/users' ? 'active nav-link' : 'not-active nav-link'}
                    to="/users"
                >
                  <text style={{fontSize:"20px",color:"white"}}>  Users </text>
                </Link>
            </li>

            <li className="nav-item">
                <Link to={`/post/create`} style={isActive(history, `/post/create`)} className="nav-link">
                    <text style={{fontSize:"20px"}}>  Create Post </text>
                </Link>
            </li>

            {!isAuthenticated() && (
                <React.Fragment>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history, '/signin')} to="/signin">
                            <text style={{fontSize:"20px"}}>  Sign In </text>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history, '/signup')} to="/signup">
                          <text style={{fontSize:"20px"}}> Register</text>
                        </Link>
                    </li>
                </React.Fragment>
            )}

            {isAuthenticated() && isAuthenticated().user.role === 'admin' && (
                <li className="nav-item">
                    <Link to={`/admin`} style={isActive(history, `/admin`)} className="nav-link">
                         <text style={{fontSize:"20px"}}>  Admin </text>
                    </Link>
                </li>
            )}

            {isAuthenticated() && (
                <React.Fragment>
                    <li className="nav-item">
                        <Link to={`/findpeople`} style={isActive(history, `/findpeople`)} className="nav-link">
                             <text style={{fontSize:"20px"}}>  Find People </text>
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link
                            to={`/user/${isAuthenticated().user._id}`}
                            style={isActive(history, `/user/${isAuthenticated().user._id}`)}
                            className="nav-link"
                        >
                          <text style={{fontSize:"20px"}}>   {`${isAuthenticated().user.name}'s profile`}  </text>
                        </Link>
                    </li>

                    <li className="nav-item">
                        <span
                            className="nav-link"
                            style={{ cursor: 'pointer', color: '#fff' }}
                            onClick={() => signout(() => history.push('/'))}
                        >
                             <text style={{fontSize:"20px"}}>  Log Out </text>
                        </span>
                    </li>
                </React.Fragment>
            )}

        </ul>
</text>
    </div>




);

export default withRouter(Menu);
