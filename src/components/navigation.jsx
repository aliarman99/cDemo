import React, { Component } from "react";

export class Navigation extends Component {
  render() {
    return (
      <nav id="menu" className="navbar navbar-default navbar-fixed-top" style={{backgroundColor:"#17202A"}}>
        <div className="container">
          <div className="navbar-header">
            <button
              type="button"
              className="navbar-toggle collapsed"
              data-toggle="collapse"
              data-target="#bs-example-navbar-collapse-1"
            >
              {" "}
              <span className="sr-only">Toggle navigation</span>{" "}
              <span className="icon-bar"></span>{" "}
              <span className="icon-bar"></span>{" "}
              <span className="icon-bar"></span>{" "}
            </button>
            <div style={{marginTop:"10px"}}>
            <img style={{width:"170px"}} src={require("../assets/logo.png")} />
            </div>
          </div>

          <div
            className="collapse navbar-collapse"
            id="bs-example-navbar-collapse-1"
          >
            <ul className="nav navbar-nav navbar-right">
              <li>
                <a href="#about" className="page-scroll" style={{ color:"white"}}>
                  About
                </a>
              </li>
              <li>
                <a href="#services" className="page-scroll" style={{ color:"white"}}>
                  Services
                </a>
              </li>
              <li>
                <a href="#testimonials" className="page-scroll" style={{ color:"white"}}>
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#team" className="page-scroll" style={{ color:"white"}}>
                  Team
                </a>
              </li>
              <li>
                <a href="#contact" className="page-scroll" style={{ color:"white"}}>
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navigation;
