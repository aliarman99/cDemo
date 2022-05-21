import React, { Component } from "react";
import { useHistory } from "react-router-dom";
const Header = (props) => {
  const history = useHistory();
  return (
    <header id="header" style={{ backgroundColor: "#424F68", color: "white" }}>
      <div className="intro" style={{ backgroundColor: "#424F68" }}>
        <div className="overlay">
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-md-offset-2 intro-text">
                <h1>
                  {props.data ? props.data.title : "Loading"}
                  <span></span>
                </h1>
                <p>{props.data ? props.data.paragraph : "Loading"}</p>
                <div
                  onClick={() => history.push("loginClient")}
                  className="btn btn-custom btn-lg page-scroll"
                >
                  Login
                </div>{" "}
                <div
                  onClick={() => history.push("signupClient")}
                  className="btn btn-custom btn-lg page-scroll"
                >
                  Register
                </div>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
