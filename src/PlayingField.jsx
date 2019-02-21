import React, { Component } from 'react';
import Card from './Card.js'

class PlayingField extends Component{
    render(){
            return(
                <div className="playingfield-container">
                    <div className="playingfield-section section-top">
                        {this.props.opponentTop.map((card, i) => {
                                    return(<Card key={i} card={card} class="field-card" user="field" />)
                                }
                            )}
                    </div>
                    <div className="playingfield-section">
                        <div className="left-field">
                            {this.props.opponentLeft.map((card, i) => {
                                return(<Card key={i} card={card} class="field-card" user="field" />)
                            }
                            )}
                        </div>
                        <div className="right-field">
                            {this.props.opponentRight.map((card, i) => {
                                return(<Card key={i} card={card} class="field-card" user="field" />)
                            }
                            )}
                        </div>
                    </div>
                    <div className="playingfield-section section-top">
                        {this.props.player.map((card, i) => {
                                        return(<Card key={i} card={card} class="field-card" user="field" />)
                                    }
                                )}
                    </div>
                    
                </div>
                )
        } 
        
    }


export default PlayingField
