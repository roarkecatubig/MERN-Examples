import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { reAuthUser } from "../reducer/users";
import { NavLink } from "react-router-dom";

class NavBar extends Component {
  componentWillMount() {
    const { reAuthUser, history } = this.props;
    reAuthUser(() => history.push("/auth"));
  }

  render() {
    const { isAuthed, ownInfo, cart } = this.props;
    return (
      <div>
        <div style={{ display: "flex", margin: "10px" }}>
          <NavLink
            exact
            to="/"
            style={{ flexGrow: 10, textDecoration: "none", color: "black" }}
          >
            <i className="fa fa-amazon" aria-hidden="true" />
            <span style={{ margin: "3px" }}>MyMart</span>
          </NavLink>
          {isAuthed ? (
            <NavLink
              exact
              to={`/users/${ownInfo._id}`}
              style={{ flexGrow: 1, color: "black" }}
            >
              <i className="fa fa-user-circle" aria-hidden="true" />
            </NavLink>
          ) : (
            <NavLink to={`/auth`} style={{ flexGrow: 1, color: "black" }}>
              <i className="fa fa-user-circle" aria-hidden="true" />
            </NavLink>
          )}

          <NavLink
            exact
            to={`/cart/${ownInfo._id}`}
            style={{ flexGrow: 1, color: "black" }}
          >
            {Object.keys(cart).length === 0 ? (
              <i className="fa fa-shopping-cart" aria-hidden="true" />
            ) : (
              <i className="fa fa-cart-plus" aria-hidden="true" />
            )}
          </NavLink>
        </div>
        <hr />
      </div>
    );
  }
}

const mapStateToProps = ({ users }) => {
  return users;
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      reAuthUser
    },
    dispatch
  );
};

NavBar = connect(mapStateToProps, mapDispatchToProps)(NavBar);

export default withRouter(NavBar);
