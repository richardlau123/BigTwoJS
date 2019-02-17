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
            opponentLeftCards: [],
            opponentTopCards: [],
            opponentRightCards: [],
            turn: null,
            cardsPlayed: [],
            lastMove: [],
            freeMove: true,
        }
        this.playCards = this.playCards.bind(this)
        this.passTurn = this.passTurn.bind(this)
        this.AIplayCards = this.AIplayCards.bind(this)
        this.updateTurn = this.updateTurn.bind(this)
        this.getCardsforTurn = this.getCardsforTurn.bind(this)
        this.numberSort = this.numberSort.bind(this)
        this.suitSort = this.suitSort.bind(this)

    }

    componentWillMount(){
        this.resetGame()
    }

    async resetGame(){
        let deck = Rules.newDeck()
        
        let playerCards = await Rules.setUserCards(deck)
        let opponentLeftCards = await Rules.setUserCards(deck)
        let opponentTopCards = await Rules.setUserCards(deck)
        let opponentRightCards = await Rules.setUserCards(deck)

        let turn = Rules.setFirstTurn(playerCards, opponentLeftCards, opponentTopCards, opponentRightCards)
        
        this.setState({
            playerCards: playerCards,
            opponentLeftCards: opponentLeftCards,
            opponentTopCards: opponentTopCards,
            opponentRightCards: opponentRightCards,
            turn: turn,
        })
    }

    playCards(cards){
        let validPlay = Rules.isValidPlay(cards)

        if((this.state.freeMove && validPlay) || (validPlay && Rules.isStrongerPlay(this.state.lastMove, cards))){
            this.updateTurn(cards)
            return true
        } else {
            console.log("NOPE SON")
        }
    }

    AIplayCards(){
        let currentPlayerCards = this.getCardsforTurn(this.turn)
        let playableCards = Computer.AIplayCards(currentPlayerCards, this.state.lastMove)
        
        this.updateTurn(playableCards)
        
    }

    getCardsforTurn(turn){
        if(turn === "opponentLeft") return this.state.opponentLeftCards 
        if(turn === "opponentTop") return this.state.opponentTopCards 
        if(turn === "opponentRight") return this.state.opponentRightCards
        if(turn === "player") return this.state.playerCards
    }

    updateTurn(cards){
        if(cards){
            let cardsPlayed = this.state.cardsPlayed
            let currentPlayerCards = this.getCardsforTurn(this.turn)

            cards.forEach((card)=> {
                currentPlayerCards.splice(currentPlayerCards.indexOf(card), 1)
                cardsPlayed.push(card)
            })
            
            if(this.turn === "opponentLeft") this.setState({opponentLeftCards: currentPlayerCards})
            if(this.turn === "opponentTop") this.setState({opponentTopCards: currentPlayerCards})
            if(this.turn === "opponentRight") this.setState({opponentRightCards: currentPlayerCards})
            if(this.turn === "player") this.setState({playerCards: currentPlayerCards})

            this.setState({
                cardsPlayed: cardsPlayed,
                lastMove: cards,
                freeMove: false,
            })
        } else {
            this.setState({freeMove: true})
        } 
    }

    passTurn(){
        this.setState({
            turn: true
        })
        this.AIplayCards()
    }

    numberSort(){
        let cards = this.state.playerCards
        Rules.sortCardsValue(cards)
        console.log(cards)
        this.setState({playerCards: cards})
    }

    suitSort(){
        let cards = this.state.playerCards
        Rules.sortCardsSuit(cards)
        console.log(cards)
        this.setState({playerCards: cards})
    }

    render(){
        return(
        <div className="game-container">
            <div className="game-left">
                <Opponent class="opponent-container-left" cardClass="computer-side" cards={this.state.opponentLeftCards} ></Opponent>
            </div>
            <div className="game-middle">
                <Opponent class="opponent-container-top" cardClass="computer-top" cards={this.state.opponentTopCards} ></Opponent>
                <PlayingField lastMove={this.state.lastMove} cards={this.state.cardsPlayed}/>
                <Player 
                    cards={this.state.playerCards} 
                    playCards={this.playCards} 
                    passTurn={this.passTurn} 
                    turn={this.state.turn}
                    numberSort={this.numberSort}
                    suitSort={this.suitSort}>
                </Player>
            </div>
            <div className="game-right">
                <Opponent class="opponent-container-right" cardClass="computer-side" cards={this.state.opponentRightCards} ></Opponent>
            </div>
        </div>
        )
    }
}

export default Game