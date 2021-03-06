import React, { Component } from 'react';
import Player from './Player.jsx'
import Opponent from './Opponent.jsx'
import PlayingField from './PlayingField.jsx'
import './Screen.css'
import * as Rules from './Rules.js'
import * as Computer from './Computer.js'
import resetImg from "./res/images/baseline_refresh_black_18dp.png"
import diamondImg from "./res/images/diamond.gif"
import heartImg from "./res/images/heart.gif"
import spadeImg from "./res/images/spade.gif"
import clubImg from "./res/images/club.png"

class Game extends Component {
    constructor(props) {
        super(props)
        this.state = {
            playerCards: [], opponentLeftCards: [], opponentTopCards: [], opponentRightCards: [],
            playerField: [], opponentLeftField: [], opponentTopField: [], opponentRightField: [],
            startingTurn: true,
            turn: null,
            cardsPlayed: [],
            lastMove: [],
            lastMovePlayer: null,
            freeMove: false,
            gameOver: false,
        }
        this.resetGame = this.resetGame.bind(this)
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
        this.displayPassTurn = this.displayPassTurn.bind(this)
    }

    componentWillMount() {
        this.resetGame()
    }

    async resetGame() {
        let deck = Rules.newDeck()

        let playerCards = await Rules.setUserCards(deck)
        let opponentLeftCards = await Rules.setUserCards(deck)
        let opponentTopCards = await Rules.setUserCards(deck)
        let opponentRightCards = await Rules.setUserCards(deck)

        let turn = Rules.setFirstTurn(playerCards, opponentLeftCards, opponentTopCards, opponentRightCards)

        this.setState({
            playerField: [], opponentLeftField: [], opponentTopField: [], opponentRightField: [],
            playerCards: playerCards,
            opponentLeftCards: opponentLeftCards,
            opponentTopCards: opponentTopCards,
            opponentRightCards: opponentRightCards,
            turn: turn,
            startingTurn: true,
            cardsPlayed: [],
            lastMove: [],
            lastMovePlayer: null,
            freeMove: false,
            gameOver: false,
            playerFieldText: "",
        })
        if (turn !== "player") this.AIplayCards()
    }

    playerPlayCards(cards) {
        this.setState({ playerFieldText: "" })
        if (this.state.startingTurn) {
            let validPlay = Rules.isValidStartingPlay(cards)

            if (validPlay) {
                this.updateNextTurnCards(cards)
                this.setState({ startingTurn: false })
                return true
            } else {
                this.setState({ playerFieldText: "starting turn must be valid and contain 3 of diamonds" })
            }
        } else {
            let validPlay = Rules.isValidPlay(cards)
            let isFreeMove = this.state.lastMovePlayer === "player"

            if (validPlay && (isFreeMove || Rules.isStrongerPlay(this.state.lastMove, cards))) {
                this.updateNextTurnCards(cards)
                return true
            } else {
                if (!validPlay) {
                    this.setState({ playerFieldText: "Your play must be valid and the same number of cards as the previous play" })
                } else {
                    this.setState({ playerFieldText: "Your play must be stronger than the previous play" })
                }
            }
        }

    }

    AIplayCards() {
        let currentPlayerCards = this.getCardsforTurn()
        let playableCards

        if (this.state.startingTurn) {
            playableCards = Computer.AIplayStartingTurn(currentPlayerCards)
            this.setState({ startingTurn: false })
        } else {
            if (this.state.lastMovePlayer === this.state.turn) {
                playableCards = Computer.AIplayFreeMove(currentPlayerCards)

            } else {
                playableCards = Computer.AIplayCards(currentPlayerCards, this.state.lastMove)
            }
        }

        this.updateNextTurnCards(playableCards)

    }

    getCardsforTurn() {
        if (this.state.turn === "opponentLeft") return this.state.opponentLeftCards
        if (this.state.turn === "opponentTop") return this.state.opponentTopCards
        if (this.state.turn === "opponentRight") return this.state.opponentRightCards
        if (this.state.turn === "player") return this.state.playerCards
    }

    updateNextTurnCards(cards) {
        if (cards) {
            let cardsPlayed = this.state.cardsPlayed
            let currentPlayerCards = this.getCardsforTurn()

            cards.forEach((card) => {
                currentPlayerCards.splice(currentPlayerCards.indexOf(card), 1)

            })

            if (this.state.lastMove) {
                this.state.lastMove.forEach((card) => { cardsPlayed.push(card) })
            }

            if (this.state.turn === "opponentLeft") this.setState({ opponentLeftCards: currentPlayerCards })
            if (this.state.turn === "opponentTop") this.setState({ opponentTopCards: currentPlayerCards })
            if (this.state.turn === "opponentRight") this.setState({ opponentRightCards: currentPlayerCards })
            if (this.state.turn === "player") this.setState({ playerCards: currentPlayerCards })

            this.updateField(cards)

            this.setState({
                cardsPlayed: cardsPlayed,
                lastMove: cards,
                lastMovePlayer: this.state.turn,
                freeMove: false,
            }, () => { this.updateNextTurn() })
        } else {
            if (this.state.turn === "opponentLeft") this.setState({ opponentLeftField: [] }, () => {
                this.displayPassTurn()
            })
            if (this.state.turn === "opponentTop") this.setState({ opponentTopField: [] }, () => {
                this.displayPassTurn()
            })
            if (this.state.turn === "opponentRight") this.setState({ opponentRightField: [] }, () => {
                this.displayPassTurn()
            })
            if (this.state.turn === "player") this.setState({ playerField: [] }, () => {
                this.displayPassTurn()
            })

            this.updateNextTurn()
        }

    }

    updateField(cards) {
        if (this.state.turn === "opponentLeft") this.setState({ opponentLeftField: [] }, () => {
            this.setState({ opponentLeftField: cards })
        })
        if (this.state.turn === "opponentTop") this.setState({ opponentTopField: [] }, () => {
            this.setState({ opponentTopField: cards })
        })
        if (this.state.turn === "opponentRight") this.setState({ opponentRightField: [] }, () => {
            this.setState({ opponentRightField: cards })
        })
        if (this.state.turn === "player") this.setState({ playerField: [] }, () => {
            this.setState({ playerField: cards })
        })
    }

    updateNextTurn() {
        if (this.isGameOver()) return
        setTimeout(() => {
            if (this.state.turn === "player") {
                this.setState({ turn: "opponentRight", playerFieldText: "" }, () => { this.AIplayCards() })
            } else if (this.state.turn === "opponentRight") {
                this.setState({ turn: "opponentTop" }, () => { this.AIplayCards() })
            } else if (this.state.turn === "opponentTop") {
                this.setState({ turn: "opponentLeft" }, () => { this.AIplayCards() })
            } else
                this.setState({ turn: "player" })
        }, 1200)

    }

    playerPassTurn() {
        if (this.state.startingTurn) {
            this.setState({ playerFieldText: "You cannot pass the first turn" })
        } else {
            this.setState({ playerField: [], playerFieldText: "" })
            this.displayPassTurn()
            this.updateNextTurn()
        }
    }

    numberSort() {
        let cards = this.state.playerCards
        Rules.sortCardsValue(cards)

        this.setState({ playerCards: cards })
    }

    suitSort() {
        let cards = this.state.playerCards
        Rules.sortCardsSuit(cards)

        this.setState({ playerCards: cards })
    }

    isGameOver() {
        let currentPlayerCards = this.getCardsforTurn()
        if (currentPlayerCards.length === 0) {
            this.setState({ gameOver: true })
            return true
        }
    }

    displayPassTurn() {
        let node = document.createElement("div")
        let nodetext = document.createTextNode("Pass Turn")
        node.append(nodetext)
        node.setAttribute("class", "tracking-in-expand-fwd")

        let field = this.state.turn
        document.getElementById(field).append(node)
        setTimeout(() => {
            document.getElementById(field).removeChild(node)
        }, 1200)
    }

    render() {
        return (
            <div style={{display: "flex"}}>
            <div className="game-container">
                <div className="game-opponent">
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
                            playerFieldText={this.state.playerFieldText}
                        >
                        </PlayingField>
                    </div>
                    <div className="game-right">
                        <img src={resetImg} onClick={this.resetGame} alt="reset" className="resetButton"></img>
                        <Opponent class="opponent-container-right" cardClass="computer-side" cards={this.state.opponentRightCards} ></Opponent>
                    </div>
                </div>
                <Player
                    cards={this.state.playerCards}
                    playerTurn={(this.state.turn === "player")}
                    playCards={this.playerPlayCards}
                    passTurn={this.playerPassTurn}
                    turn={this.state.turn}
                    numberSort={this.numberSort}
                    suitSort={this.suitSort}
                    gameOver={this.state.gameOver}
                    resetGame={this.resetGame}>
                </Player>
            </div>
            <div className="rules-container">
                <div className="rules-text">Originating in coastal China around 1980, Big Two has become a popular card game amongst East Asians, especially throughout Shanghai, Hong Kong, Taiwan and also in the Philippines and Singapore.
                There are many variations to this game, this is one of them.
                </div>
                <br></br>
                <div className="rules-text">OBJECTIVE - First player to play all their cards win!</div>
                
                <div className="rules-text">STARTING TURN - Player with the 3<img className="suitImg" alt="" src={diamondImg}></img> of Diamonds goes first. Their play must include 3<img className="suitImg" alt="" src={diamondImg}></img></div>
                
                <div className="rules-text">GAMEPLAY</div>
                <div className="rules-text">You may choose to play cards or pass your turn. You must play a single, pair, or 5 card combo following the previous play. If every player passes one player's move they have a free move to play any combo.</div>
                
                <div className="rules-text">HAND RANKINGS</div>
                <div className="rules-text"><img className="suitImg" alt="" src={spadeImg}></img> > <img className="suitImg" alt="" src={heartImg}></img> > <img className="suitImg" alt="" src={clubImg}></img> > <img className="suitImg" alt="" src={diamondImg}></img></div>
                <div className="rules-text">2 > A > K > Q > J > 10 > 9 > 8 > 7 > 6 > 5 > 4 > 3</div>
                <div className="rules-text">Straight Flush - 6<img className="suitImg" alt="" src={heartImg}></img> 7<img className="suitImg" alt="" src={heartImg}></img> 8<img className="suitImg" alt="" src={heartImg}></img> 9<img className="suitImg" alt="" src={heartImg}></img> 10<img className="suitImg" alt="" src={heartImg}></img></div>
                <div className="rules-text">Four of a Kind - 5<img className="suitImg" alt="" src={diamondImg}></img> 5<img className="suitImg" alt="" src={clubImg}></img> 5<img className="suitImg" alt="" src={heartImg}></img> 5<img className="suitImg" alt="" src={spadeImg}></img> A<img className="suitImg" alt="" src={heartImg}></img></div>
                <div className="rules-text">Full House - Q<img className="suitImg" alt="" src={spadeImg}></img> Q<img className="suitImg" alt=""  src={heartImg}></img> Q<img className="suitImg" alt="" src={diamondImg}></img> 4<img className="suitImg" alt=""  src={spadeImg}></img> 4<img className="suitImg" alt="" src={heartImg}></img></div>
                <div className="rules-text">Flush - 6<img className="suitImg" alt="" src={spadeImg}></img>  8<img className="suitImg" alt="" src={spadeImg}></img>  J<img className="suitImg" alt="" src={spadeImg}></img> K<img className="suitImg" alt="" src={spadeImg}></img> 2<img className="suitImg" alt="" src={spadeImg}></img> </div>
                <div className="rules-text">Straight - A<img className="suitImg" alt="" src={heartImg}></img> 2<img className="suitImg" alt="" src={spadeImg}></img> 3<img className="suitImg" alt="" src={diamondImg}></img> 4<img className="suitImg" alt=""  src={clubImg}></img> 5<img className="suitImg" alt=""  src={diamondImg}></img></div>
            </div>
            </div>
        )
    }
}

export default Game