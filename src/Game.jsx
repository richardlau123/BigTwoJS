import React, { Component } from 'react';
import Player from './Player.js'
import Opponent from './Opponent.js'
import PlayingField from './PlayingField.jsx'
import './Screen.css'
import * as Rules from './Rules.js'
import { throws } from 'assert';

class Game extends Component{
    constructor(props){
        super(props)
        this.state = {
            playerCards: [],
            opponentCards: [],
            playerTurn: null,
            cardsPlayed: [],
            lastMove: []
        }
        this.playCards = this.playCards.bind(this)
    }

    componentWillMount(){
        this.resetGame()
    }

    async resetGame(){
        let deck = Rules.newDeck()
        
        let playerCards = await Rules.setUserCards(deck)
        let opponentCards = await Rules.setUserCards(deck)
        let playerTurn = Rules.setFirstTurn(playerCards, opponentCards)
        console.log(playerCards)
        console.log(opponentCards)
        console.log(playerTurn)
        this.setState({
            playerCards: playerCards,
            opponentCards: opponentCards,
            playerTurn: playerTurn
        })
    }

    playCards(cards){
        console.log(Rules.isValidPlay(cards))
        // if(Rules.isValidPlay(this.state.lastMove, cards)){

        // }
    }

    render(){
        return(
        <div className="game-container">
            <Opponent cards={this.state.opponentCards} ></Opponent>
            <PlayingField cards={this.state.cardsPlayed}/>
            <Player cards={this.state.playerCards} playCards={this.playCards} playerTurn={this.state.playerTurn}></Player>
        </div>
        )
    }
}

export default Game