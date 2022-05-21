import React, { Component } from "react";
import Navigation from "../components/navigation";
import Header from "../components/header";
import About from "../components/about";
import Services from "../components/services";
import Testimonials from "../components/testimonials";
import Team from "../components/Team";
import Contact from "../components/contact";
import JsonData from "../data/data.json";

// import '../assets/css/bootstrap.css'

export class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      landingPageData: {},
    };
  }
  getlandingPageData() {
    this.setState({ landingPageData: JsonData });
  }

  componentDidMount() {
    this.getlandingPageData();
  }

  render() {
    return (
      <div>
        <Navigation />
        <Header
          data={this.state.landingPageData.Header}
        />
        <About data={this.state.landingPageData.About} />
        <Services data={this.state.landingPageData.Services} />
        <Testimonials data={this.state.landingPageData.Testimonials} />
        <Team data={this.state.landingPageData.Team} />
        <Contact data={this.state.landingPageData.Contact} />
      </div>
    );
  }
}

export default Landing;
