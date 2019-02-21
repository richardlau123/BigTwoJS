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
            playerCards: [], opponentLeftCards: [], opponentTopCards: [], opponentRightCards: [],
            playerField: [], opponentLeftField: [], opponentTopField: [], opponentRightField: [],
            startingTurn: true,
            turn: null,
            cardsPlayed: [],
            lastMove: [],
            lastMovePlayer: null,
            freeMove: true,
            gameOver: false,
        }
        this.playerPlayCards = this.playerPlayCards.bind(this)
        this.playerPassTurn = this.playerPassTurn.bind(this)
        this.AIplayCards = this.AIplayCards.bind(this)
        this.updateNextTurn = this.updateNextTurn.bind(this)
        this.updateField = this.updateField.bind(this)
        this.updateNextTurnCards = this.updateNextTurnCards.bind(this)
        this.getCardsforTurn = this.getCardsforTurn.bind(this)
        this.numberSort = this.numberSort.bind(this)
        this.suitSort = this.suitSort.bind(this)
        this.isGameOver = this.isGameOver.bind(this)
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
            startingTurn: true
        })
        if(turn !== "player") this.AIplayCards()
    }

    playerPlayCards(cards){
        if(this.state.startingTurn){
            let validPlay = Rules.isValidStartingPlay(cards)
            
            if(validPlay) {
                this.updateNextTurnCards(cards)
                this.setState({startingTurn: false})
                return true
            } else {
                console.log("play must contain 3 of diamonds and be valid")
            }
        } else {
            let validPlay = Rules.isValidPlay(cards)
            let isFreeMove = this.state.lastMovePlayer === "player"

            if(validPlay && (isFreeMove || Rules.isStrongerPlay(this.state.lastMove, cards))){
                this.updateNextTurnCards(cards)
                return true
            } else {
                console.log("invalid play of cards or not stronger than previous play")
            }
        }
        
    }

    AIplayCards(){
        let currentPlayerCards = this.getCardsforTurn()
        let playableCards 
        
        if(this.state.startingTurn){
            playableCards = Computer.AIplayStartingTurn(currentPlayerCards)
            this.setState({startingTurn: false})  
        } else {
            console.log("last move player:", this.state.lastMovePlayer,"current turn is:", this.state.turn)
            if(this.state.lastMovePlayer === this.state.turn) {
                playableCards = Computer.AIplayFreeMove(currentPlayerCards)
                console.log(playableCards)
                
            } else {
                playableCards = Computer.AIplayCards(currentPlayerCards, this.state.lastMove)
            }
            console.log(this.state.turn, playableCards)
        }
        
        this.updateNextTurnCards(playableCards)          
        
    }

    getCardsforTurn(){
        if(this.state.turn === "opponentLeft") return this.state.opponentLeftCards 
        if(this.state.turn === "opponentTop") return this.state.opponentTopCards 
        if(this.state.turn === "opponentRight") return this.state.opponentRightCards
        if(this.state.turn === "player") return this.state.playerCards
    }

    updateNextTurnCards(cards){
        if(cards){
            let cardsPlayed = this.state.cardsPlayed
            let currentPlayerCards = this.getCardsforTurn()
            console.log("update next cards:", cards)
            cards.forEach((card)=> {
                currentPlayerCards.splice(currentPlayerCards.indexOf(card), 1)
                
            })
            
            if(this.state.lastMove){
                this.state.lastMove.forEach((card)=> {cardsPlayed.push(card)})
            }
            
            if(this.state.turn === "opponentLeft") this.setState({opponentLeftCards: currentPlayerCards})
            if(this.state.turn === "opponentTop") this.setState({opponentTopCards: currentPlayerCards})
            if(this.state.turn === "opponentRight") this.setState({opponentRightCards: currentPlayerCards})
            if(this.state.turn === "player") this.setState({playerCards: currentPlayerCards})
            
            this.updateField(cards)

            this.setState({
                cardsPlayed: cardsPlayed,
                lastMove: cards,
                lastMovePlayer: this.state.turn,
                freeMove: false,
            }, ()=>{this.updateNextTurn()})
        } else {
            if(this.state.turn === "opponentLeft") this.setState({opponentLeftField: []})
            if(this.state.turn === "opponentTop") this.setState({opponentTopField: []})
            if(this.state.turn === "opponentRight") this.setState({opponentRightField: []})
            if(this.state.turn === "player") this.setState({playerField: []})
            
            this.updateNextTurn()
        }
        
    }

    updateField(cards){
        if(this.state.turn === "opponentLeft") this.setState({opponentLeftField: []}, ()=>{
            this.setState({opponentLeftField: cards})
        })
        if(this.state.turn === "opponentTop") this.setState({opponentTopField: []}, ()=>{
            this.setState({opponentTopField: cards})
        })
        if(this.state.turn === "opponentRight") this.setState({opponentRightField: []}, ()=>{
            this.setState({opponentRightField: cards})
        })
        if(this.state.turn === "player") this.setState({playerField: []}, ()=>{
            this.setState({playerField: cards})
        })
    }

    updateNextTurn(){
        if(this.isGameOver()) return
        setTimeout(()=> {
            if(this.state.turn === "player") {
                this.setState({turn: "opponentRight"}, ()=>{this.AIplayCards()})
            } else if(this.state.turn === "opponentRight") {
                this.setState({turn: "opponentTop"}, ()=>{this.AIplayCards()})
            } else if(this.state.turn === "opponentTop") {
                this.setState({turn: "opponentLeft"}, ()=>{this.AIplayCards()})
            } else 
                this.setState({turn: "player"})
        }, 0)
            

    }

    playerPassTurn(){
        this.setState({playerField: []})
        this.updateNextTurn()
    }

    numberSort(){
        let cards = this.state.playerCards
        Rules.sortCardsValue(cards)

        this.setState({playerCards: cards})
    }

    suitSort(){
        console.log("last player move:", this.state.lastMovePlayer)
        console.log("this turn is:" ,this.state.turn)
        let cards = this.state.playerCards
        Rules.sortCardsSuit(cards)

        this.setState({playerCards: cards})
    }

    isGameOver(){
        let currentPlayerCards = this.getCardsforTurn()
        if(currentPlayerCards.length === 0){
            this.setState({gameOver: true})
            return true
        }
    }

    render(){
        return(
        <div className="game-container">
            <div className="game-left">
                <Opponent class="opponent-container-left" cardClass="computer-side" cards={this.state.opponentLeftCards} ></Opponent>
            </div>
            <div className="game-middle">
                <Opponent class="opponent-container-top" cardClass="computer-top" cards={this.state.opponentTopCards} ></Opponent>
                <PlayingField
                    player={this.state.playerField}
                    opponentRight={this.state.opponentRightField}
                    opponentLeft={this.state.opponentLeftField}
                    opponentTop={this.state.opponentTopField}
                >    
                </PlayingField>
                <Player 
                    cards={this.state.playerCards} 
                    playCards={this.playerPlayCards} 
                    passTurn={this.playerPassTurn} 
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