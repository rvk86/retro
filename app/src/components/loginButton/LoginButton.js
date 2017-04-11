import React, { PropTypes, Component } from 'react';
import FacebookLogin from 'react-facebook-login';

import Config from '../../config';
import './LoginButton.css';

class LoginButton extends Component {
  static propTypes = {
    callback: PropTypes.func
  }
  
  render() {
    return (
      <div className="LoginButton">
        <FacebookLogin
          appId={Config.facebookAppID}
          cssClass="btn btn-lg btn-primary"
          textButton="Start by logging in!"
          callback={this.props.callback} />
      </div>
    );
  }
}

export default LoginButton;
