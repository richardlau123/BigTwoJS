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
        break;
        case 5:
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