import React, { Component } from "react";

class View extends Component {
  constructor() {
    super();
    this.state = {
      name: "React"
    };
  }

  render() {
    return <div>This is View component</div>;
  }
}

export default View;