import React, { Component } from 'react';
import Player from './Player.js'
import Opponent from './Opponent.js'
import PlayingField from './PlayingField.jsx'
import './Screen.css'
import Rules from './Rules.js'

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
    }

    componentWillMount(){
        this.resetGame()
    }

    async resetGame(){
        let rules = new Rules()
        rules.newDeck()
        
        let playerCards = await rules.setUserCards()
        let opponentCards = await rules.setUserCards()
        let playerTurn = rules.setFirstTurn(playerCards, opponentCards)
        console.log(playerCards)
        console.log(opponentCards)
        console.log(playerTurn)
        this.setState({
            playerCards: playerCards,
            opponentCards: opponentCards,
            playerTurn: playerTurn
        })
    }

    render(){
        return(
        <div className="game-container">
            <Opponent cards={this.state.opponentCards} ></Opponent>
            <PlayingField cards={this.state.cardsPlayed}/>
            <Player cards={this.state.playerCards} playerTurn={this.state.playerTurn}></Player>
        </div>
        )
    }
}

export default Game