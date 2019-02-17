import React, {Component} from 'react'
import Card from './Card.js'

class Player extends Component{
    constructor(props){
        super(props)
        this.state = {
            selectedCards : [],
            cards: []
        }
        this.selectCard = this.selectCard.bind(this)
        this.handlePlayClick = this.handlePlayClick.bind(this)
        this.handlePassTurnClick = this.handlePassTurnClick.bind(this)
        this.handleNumberSort = this.handleNumberSort.bind(this)
        this.handleSuitSort = this.handleSuitSort.bind(this)
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

    handleNumberSort(){
        this.props.numberSort()
    }

    handleSuitSort(){
        this.props.suitSort()
    }

    render(){
        let cards = this.props.cards;
        //console.log(cards)
        // if(cards){
            return(
                <div className="player-container">
                        {cards && cards.map((card, i) => {
                            let selected = this.state.selectedCards.includes(card)
                            return(<Card key={i} card={card} user="player" selectCard={this.selectCard} selected={selected}/>)
                        }
                        )}
                    <div className="player-action">
                        <div>
                        <button onClick={this.handlePlayClick}>Play Cards</button>
                        <button onClick={this.handleNumberSort}>Sort 1234</button>
                        </div>
                        <div>
                        <button onClick={this.handlePassTurnClick}>Pass Turn</button>
                        <button onClick={this.handleSuitSort}>Sort Suit</button>
                        </div>
                    </div>
                </div>    
                )
                // }
        
    }
}

export default Player