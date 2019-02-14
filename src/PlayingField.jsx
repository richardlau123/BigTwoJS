import React, { Component } from 'react';
import Card from './Card.js'

class PlayingField extends Component{
    render(){
            return(
                <div className="playingfield-container">
                        {this.props.cards.map((card, i) => {
                                return(<Card key={i} card={card} user="field" />)
                            }
                        )}
                </div>
                )
        } 
        
    }


export default PlayingField
