import React, {Component} from 'react'
import Card from './Card.js'

class Opponent extends Component{
    render(){
        const cards = this.props.cards;
        console.log(cards)
        return(
        <div className="opponent-container">
            {cards.map((card, i) => <Card key={i} card={card} user="opponent"/>
            )}
        </div>    
        )
    }
}

export default Opponent