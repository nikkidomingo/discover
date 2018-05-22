import React, {Component} from 'react';
import './styles/Welcome.css';

class Welcome extends Component {
    render() {
        return(
            <div className="welcome">
                <h1 className="welcome-logo">Discover</h1>
                <p className="welcome-desc">Explore new music.</p>
                <button className="btn btn-sign-in">Sign in with Spotify</button>
            </div>
        );
    }
}

export default Welcome;