import React, { Component } from 'react';
import Player from './Player.js'
import Opponent from './Opponent.jsx'
import PlayingField from './PlayingField.jsx'
import './Screen.css'
import * as Rules from './Rules.js'
import * as Computer from './Computer.js'

class Game extends Component{
    constructor(props){
        super(props)
        this.state = {
            playerCards: [],
            opponentCards: [],
            playerTurn: null,
            cardsPlayed: [],
            lastMove: [],
            freeMove: true,
        }
        this.playCards = this.playCards.bind(this)
        this.passTurn = this.passTurn.bind(this)
        this.AIplayCards = this.AIplayCards.bind(this)

    }

    componentWillMount(){
        this.resetGame()
    }

    async resetGame(){
        let deck = Rules.newDeck()
        
        let playerCards = await Rules.setUserCards(deck)
        let opponentCards = await Rules.setUserCards(deck)
        Rules.sortCards(opponentCards)
        let playerTurn = Rules.setFirstTurn(playerCards, opponentCards)
        // console.log(playerCards)
        // console.log(opponentCards)
        // console.log(playerTurn)
        this.setState({
            playerCards: playerCards,
            opponentCards: opponentCards,
            playerTurn: playerTurn,
        })
    }

    playCards(cards){
        // console.log(Rules.isValidPlay(cards))
        let validPlay = Rules.isValidPlay(cards)

        if((this.state.freeMove && validPlay) || (validPlay && Rules.isStrongerPlay(this.state.lastMove, cards))){
            let playerCards = this.state.playerCards
            let cardsPlayed = this.state.cardsPlayed

            cards.forEach((card)=> {
                playerCards.splice(playerCards.indexOf(card), 1)
                cardsPlayed.push(card)
            })

            this.setState({
                playerCards: playerCards,
                cardsPlayed: cardsPlayed,
                lastMove: cards
            })


            return true
        } else {
            console.log("NOPE SON")
        }
    }

    AIplayCards(){
        let cards = Computer.AIselectSingleCard(this.state.opponentCards, this.state.lastMove)
        if(cards){
            let opponentCards = this.state.opponentCards
            let cardsPlayed = this.state.cardsPlayed

            cards.forEach((card)=> {
                opponentCards.splice(opponentCards.indexOf(card), 1)
                cardsPlayed.push(card)
            })

            this.setState({
                opponentCards: opponentCards,
                cardsPlayed: cardsPlayed,
                lastMove: cards
            })
        }
        return
        let validTurn = Computer.AIplayCards(this.state.opponentCards, this.state.lastMove)

        if(validTurn){
            //Set new state (look at playCards method)
        } else {
            // computer pass turn
        }
    }

    passTurn(){
        this.setState({
            playerTurn: true
        })
        this.AIplayCards()
    }

    render(){
        return(
        <div className="game-container">
            <Opponent cards={this.state.opponentCards} ></Opponent>
            <PlayingField lastMove={this.state.lastMove} cards={this.state.cardsPlayed}/>
            <Player cards={this.state.playerCards} playCards={this.playCards} passTurn={this.passTurn} playerTurn={this.state.playerTurn}></Player>
        </div>
        )
    }
}

export default Game