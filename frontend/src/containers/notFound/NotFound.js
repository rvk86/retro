import React, {
  PropTypes,
  Component
} from 'react';
import ReactDOM from 'react-dom';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';
import Button from 'react-bootstrap/lib/Button';
import { Link } from 'react-router-dom'

import './NotFound.css';


class NotFound extends Component {
  static propTypes = {
    onBoundsChanged: PropTypes.func,
    printSize: PropTypes.object
  }

  render() {
    return (
      <div className="NotFound">
        <Grid>
          <Jumbotron>
            <h1>A big, fat 404</h1>
            <p>Not sure how you got here, but you sure as hell don't belong here.</p>
            <p><Link to="/"><Button bsStyle="primary">Go home</Button></Link></p>
          </Jumbotron>
        </Grid>
      </div>
    );
  }
}

export default NotFound;
