const suits = ["D","C","H","S"]
const type = ["","A","2","3","4","5","6","7","8","9","10","J","Q","K"]

export function newDeck(){
    let deck = []

    for(let i=1;i<14;i++){
        for(let j=0;j<4;j++){
            let value = (i === 1) ? 14 : (i === 2) ? 15 : i
            let imagePath = type[i] + suits[j] + ".png"
            let card = {
                type: type[i],
                suit: suits[j],
                value: value,
                imagePath: imagePath
            }
            deck.push(card)
        }
    }

    return shuffle(deck)
}

export function getSuitValue(suit){
    return (suit === "D") ? 1 : (suit === "C") ? 2 : (suit === "H") ? 3 : 4
}

export function isValidPlay(cards){
    if(cards == null) return false 
    sortCards(cards)
    console.log(cards)
    
    return isValidCardPairing(cards) || isValidFiveCardPlay(cards)
}

export function isValidCardPairing(cards){
    return (cards.length === 1) || (cards.length === 2 && cards[0].type === cards[1].type)
}

function isValidFiveCardPlay(cards){
    if(cards.length !== 5) return false
    console.log(isStraight(cards))
    console.log("is flush?", isFlush(cards))
    console.log("is fullhouse?", isFullHouse(cards))

    return isStraight(cards) || isFlush(cards) || isFullHouse(cards) || isFourOfAKind(cards)
}

function isStraight(cards){
    let values = getCardValues(cards)

    // Ace straight
    if(values.includes(14)){
        return (values.includes(10) && values.includes(11) && values.includes(12) && values.includes(13)) || (values.includes(3) && values.includes(4) && values.includes(5) && values.includes(15))
    } else if(values.includes(15)) {
        return (values.includes(3) && values.includes(4) && values.includes(5) && values.includes(6)) 
    } else {
        for(let i=1;i<5;i++){
            if(values[i] - values[i-1] !== 1) return false
        }
        return true
    }
        
}

function isFlush(cards){
    for(let i=1;i<5;i++){
        if(cards[i].suit !== cards[0].suit) return false
    }
    return true
}

function isFullHouse(cards){
    let values = getCardValues(cards)
    console.log(values)
    return values[0] === values[1] && values[3] === values[4] && (values[2] === values[1] || values[2] === values[3])
}

function isFourOfAKind(cards){
    let values = getCardValues(cards)
    return (values[0] === values[1] === values[2] === values[3]) || (values[4] === values[1] === values[2] === values[3])
}

function beatsLastMove(lastTurn, cards){

}

export function setUserCards(deck){
    let userCards = []
    for(let i=0;i < 25;i++){
        userCards.push(deck.pop())
    }
    return userCards
}

export function setFirstTurn(playerCards, opponentCards){
    let smallestCard = {
        value: 15, suit: 4
    }
    let playerTurn

    playerCards.forEach((card) => {
        let suitValue = getSuitValue(card.suit)
        if((card.value <= smallestCard.value) && (suitValue <= smallestCard.suit)){
            smallestCard = {
                value: card.value, suit: suitValue
            }
            playerTurn = true
        } 
    })

    opponentCards.forEach((card) => {
        let suitValue = getSuitValue(card.suit)
        if((card.value <= smallestCard.value) && (suitValue <= smallestCard.suit)){
            smallestCard = {
                value: card.value, suit: suitValue
            }
            playerTurn = false
        } 
    })
    return playerTurn
}

function getCardValues(cards){
    let values = []
    cards.forEach((card) => {
        values.push(card.value)
    })
    return values
}

function sortCards(cards) {
    cards.sort((a,b)=> {
        return a.value - b.value
    })
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}





