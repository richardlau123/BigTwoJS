import React, {Component} from 'react'
import Card from './Card.js'
// import Button from '@material-ui/core/Button';

class Player extends Component{
    constructor(props){
        super(props)
        this.state = {
            selectedCards : new Set()
        }
        this.selectCard = this.selectCard.bind(this)
    }

    selectCard(card){
        let newSelectedCards = this.state.selectedCards
        if(newSelectedCards.has(card) ) {
            newSelectedCards.delete(card)
        } else {
            newSelectedCards.add(card)
        }
        this.setState({
            selectedCards : newSelectedCards
        })
        console.log(newSelectedCards)
        console.log(this.state.selectedCards)
    }

    render(){
        const cards = this.props.cards;
        // console.log(cards)
        if(cards){
            return(
                <div className="player-container">
                    {cards.map((card, i) => {
                        let selected = this.state.selectedCards.has(card)
                        console.log(selected)
                        return(<Card key={i} card={card} user="player" selectCard={this.selectCard} selected={selected}/>)
                    }
                    )}
                    <div>
                        {/* <Button>Hello World</Button> */}
                    </div>
                </div>    
                )
        }
        
    }
}

export default Player