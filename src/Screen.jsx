import React, { Component } from 'react';
import Game from './Game.jsx'
import './Screen.css'

class Screen extends Component{
    render(){
        return(
        <div className="screen-container">
                <Game/>
        </div>
        )
    }
}

export default Screen
