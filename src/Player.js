import React, {Component} from 'react'
import Card from './Card.js'
// import Button from '@material-ui/core/Button';

class Player extends Component{
    constructor(props){
        super(props)
        this.state = {
            selectedCards : []
        }
        this.selectCard = this.selectCard.bind(this)
        this.handlePlayClick = this.handlePlayClick.bind(this)
        this.handlePassTurnClick = this.handlePassTurnClick.bind(this)
    }

    selectCard(card){
        let newSelectedCards = this.state.selectedCards
        
        if(newSelectedCards.includes(card) ) {
            newSelectedCards.splice(newSelectedCards.indexOf(card), 1)
        } else {
            newSelectedCards.push(card)
        }
        this.setState({
            selectedCards : newSelectedCards
        })
        //console.log(this.state.selectedCards)
    }

    handlePlayClick(e){
        if(this.props.playCards(this.state.selectedCards)) {
            this.setState({
                selectedCards: []
            })
        }
    }

    handlePassTurnClick(e){
        this.props.passTurn()
    }

    render(){
        const cards = this.props.cards;
        //console.log(cards)
        // if(cards){
            return(
                <div className="player-container">
                    {cards.map((card, i) => {
                        let selected = this.state.selectedCards.includes(card)
                        return(<Card key={i} card={card} user="player" selectCard={this.selectCard} selected={selected}/>)
                    }
                    )}
                    <div className="player-action">
                        <button onClick={this.handlePlayClick}>Play Cards</button>
                        <button onClick={this.handlePassTurnClick}>Pass Turn</button>
                    </div>
                </div>    
                )
                // }
        
    }
}

export default Player