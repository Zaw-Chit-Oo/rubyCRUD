import React from "react";
import User from "../users/_index";
import Customer from "../customers/_index";
import { Route, Switch } from "react-router-dom";

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={User}></Route>
        <Route path="/users" component={User}></Route>
        <Route path="/customers" component={Customer}></Route>
      </Switch>
    );
  }
}

export default Routes;
