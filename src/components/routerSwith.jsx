import {Route, Link ,Redirect } from  "react-router-dom";
import Login from './login';
import ClientIndex from './client/index';
import ManagerIndex from './manager/index';
import React from 'react';
const loggedIn=false;
export default (
    <div>
        <ul>
            <li>
                <Link to="/client">client</Link>
            </li>
            <li>
                <Link to="/login">login</Link>
            </li>
            <li>
                <Link to="/manager">manager</Link>
            </li>
        </ul>
        <hr />
        <Route exact path="/" render={() => (
            loggedIn ? (
                <Redirect to="/client" />
            ) : (
                <Login />
            )
        )} />
        <Route path="/login" component={Login}/>
        <Route path="/manager" component={ManagerIndex}/>
        <Route path="/client" component={ClientIndex}/>
    </div>
);
