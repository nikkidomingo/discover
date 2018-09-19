import React, {Component} from 'react';
import './styles/Welcome.css';
import axios from 'axios'

class Welcome extends Component {
    constructor(props){
    super(props);
        this.handleSignIn = this.handleSignIn.bind(this);
        this.generateRandomString = this.generateRandomString.bind(this);

        this.state = {
            client_id : '81e5851e3ad2464a941fdd04636a647a',
            local_redirect_uri : 'http://localhost:3000/home',
            redirect_uri : 'https://nikkidomingo.github.io/discover/home',
            state : this.generateRandomString(16),
            scope : 'user-read-private user-read-email playlist-modify-public playlist-modify-private',
        }
    }

    generateRandomString(length){
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

            for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            
            return text;
    }

    handleSignIn(e) {
        axios.get('https://accounts.spotify.com/authorize', {
            params: {
                response_type: 'token',
                client_id: this.state.client_id,
                scope: this.state.scope,
                redirect_uri: this.state.local_redirect_uri,
                state : this.state.state
            }
        }).then(function(response) {
            console.log(response);
            window.location = 'http://localhost:3000/home';
        }).catch(function(response){
            console.log(response);
            alert('Oops something went wrong! Try again.')
            window.location = 'http://localhost:3000/';
        })
        
        // var url = 'https://accounts.spotify.com/authorize';
        // url += '?response_type=' + this.state.response_type;
        // url += '&client_id=' + this.state.client_id;
        // url += '&scope=' + this.state.scope;
        // url += '&redirect_uri=' + this.state.local_redirect_uri;
        // url += '&state' + this.state.state;
        // window.location = url;
    }    

    render() {
        return(
            <div className="welcome">
                <h1 className="welcome-logo">Discover</h1>
                <p className="welcome-desc">Explore new music.</p>
                <button className="btn btn-sign-in" onClick={this.handleSignIn}>Sign in with Spotify</button>
            </div>
        );
    }
}

export default Welcome;