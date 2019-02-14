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

export function isStrongerPlay(lastTurn, cards){
    if(lastTurn.length !== cards.length) return false

    if(cards.length <=2) {
        return isStrongerPairing(lastTurn, cards)
    } else {
        let lastRank = getFiveCardRanking(lastTurn)
        let currRank = getFiveCardRanking(cards)
        if(lastRank < currRank) {
            return true
        } else if(lastRank === currRank){
            return isStrongerFiveCardPlay(lastTurn, cards)
        } 
    }
    return false
}

function isStrongerPairing(lastTurn,cards){
    let lastCard = lastTurn[lastTurn.length-1]
    let lastValue = lastCard.value + getSuitValue(lastCard.suit) 
    let currCard = cards[cards.length-1]
    let currValue = currCard.value + getSuitValue(currCard.suit) 
    
    return (currValue > lastValue)
}

function isStrongerFiveCardPlay(lastTurn, cards){
    sortCards(lastTurn)
    sortCards(cards)
    let ranking = getFiveCardRanking(cards)
    return (ranking === 1) ? isStrongerStraight(lastTurn, cards) : (ranking === 2) ? isStrongerFlush(lastTurn,cards) : (ranking === 3) ? isStrongerFullHouse(lastTurn, cards) : isStrongerFourOfAKind(lastTurn, cards) 
}

function isStrongerStraight(lastTurn, cards){
    let lastVals = getCardValues(lastTurn)
    let currVals = getCardValues(cards)
    if(lastVals.includes(15) && !currVals.includes(15)){
        return true
    } else {
        return lastVals.pop() <= currVals.pop()
    }
}

function isStrongerFlush(lastTurn,cards){
    let lastSuit = getSuitValue(lastTurn[0].suit) 
    let currSuit = getSuitValue(cards[0].suit)
    
    if(lastSuit === currSuit){
        return lastTurn[4].value < cards[4].value
    } else {
        return lastSuit < currSuit
    }
}

function isStrongerFullHouse(lastTurn, cards){
    return lastTurn[2].value < cards[2].value
}

function isStrongerFourOfAKind(lastTurn,cards) {
    return lastTurn[2].value < cards[2].value
}

function getFiveCardRanking(cards){
    if(isValidFiveCardPlay(cards)){
        return (isStraight(cards) && isFlush(cards)) ? 5 : isStraight(cards) ? 1 : isFlush(cards) ? 2 : isFullHouse(cards) ? 3 : 4
    }
    console.log("ERROR INVALID 5 CARD COMBO")
}

export function setUserCards(deck){
    let userCards = []
    for(let i=0;i < 13;i++){
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

export function sortCards(cards) {
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





