import * as Rules from './Rules.js'

export function AIplayCards(cards, lastMove){
    Rules.sortCards(cards)
    Rules.sortCards(lastMove)
    let selectedCards

    switch(lastMove.length) {
        case 1:
            selectedCards = AIselectSingleCard(cards, lastMove)
        break;
        case 2:
            selectedCards = AIselectPair(cards, lastMove)
        break;
        case 5:
            selectedCards = AIselectFiveCardPlay(cards, lastMove)
        break;
        default:
    }
    return selectedCards
}

export function AIplayFreeMove(cards){

}

export function AIselectSingleCard(cards, lastMove){
    
    console.log(lastMove)
    for(let i=0;i<cards.length;i++){
        if(Rules.isStrongerSingle(lastMove[0], cards[i])){
            console.log(cards[i])
            return [cards[i]]
        }
        
    }
    
    return null
}

export function AIselectPair(cards, lastMove){
    let pairs = getAllPairs(cards)
    
    if(pairs){
        for(let i=0;i<pairs.length;i++){
            if(Rules.isStrongerPair(lastMove, pairs[i])){
                console.log(pairs[i])
                return pairs[i]
            }
        }
    }
    return null
}

export function AIselectFiveCardPlay(cards, lastMove){
    let validSet = getAllFiveCardPlays(cards)

    if(validSet){
        for(let i=0;i<validSet.length;i++){
            if(Rules.isStrongerPlay(lastMove, validSet[i])){
                console.log(validSet[i])
                return validSet[i]
            }
        }
    }
    return null
}

function getAllFiveCardPlays(cards){
    let validSet = []
    
    function getAllFiveCardPlaysHelper(cards, subset, i){
        if(i === cards.length){
            subset = subset.filter(card => card !== null)
            subset = subset.slice(0,5)
            if(Rules.isValidFiveCardPlay(subset)){    
                validSet.push(subset)
            }
            return
        }
        
        subset[i] = cards[i]
        getAllFiveCardPlaysHelper(cards,subset,i+1)
        subset[i] = null
        getAllFiveCardPlaysHelper(cards, subset, i+1)
    }
    getAllFiveCardPlaysHelper(cards, [], 0)
    
    return validSet

}

function getAllPairs(cards){
    let seenCards = new Map()
    let pairs = []

    for(let i=0;i<cards.length;i++){
        if(seenCards.has(cards[i].type)){
            let lastSeenCard = seenCards.get(cards[i].type)
            pairs.push([lastSeenCard, cards[i]])
        } else {
            seenCards.set(cards[i].type, cards[i])
        }
    }

    return pairs 
}

var testingcards = [
    {type: "7", suit: "H", value: 7},
    {type: "7", suit: "D", value: 7},
    {type: "7", suit: "S", value: 7},
    {type: "7", suit: "C", value: 7},
    {type: "Q", suit: "H", value: 12},
    {type: "Q", suit: "D", value: 12},
    {type: "6", suit: "H", value: 6},
    {type: "5", suit: "H", value: 5},
    {type: "4", suit: "H", value: 4},
    {type: "8", suit: "H", value: 8},
]