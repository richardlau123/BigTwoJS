class Rules {
    deck = []
    suits = ["D","C","H","S"]
    type = ["","A","2","3","4","5","6","7","8","9","10","J","Q","K"]

    newDeck(){
        for(let i=1;i<14;i++){
            for(let j=0;j<4;j++){
                let value = (i === 1) ? 14 : (i === 2) ? 15 : i
                let imagePath = this.type[i] + this.suits[j] + ".png"
                let card = {
                    type: this.type[i],
                    suit: this.suits[j],
                    value: value,
                    imagePath: imagePath
                }
                this.deck.push(card)
            }
        }

        this.shuffle(this.deck)
    }

    getSuitValue(suit){
        return (suit === "D") ? 1 : (suit === "C") ? 2 : (suit === "H") ? 3 : 4
    }

    isValidPlay(lastTurn, cards){
        this.isValidCardPairing(cards)
        if(lastTurn.length === cards.length){
            if(cards.length === 5){
                return this.isValidFiveCardPlay(cards)
            } else if(cards.length < 4){
                return this.isValidCardPairing(cards)
            }
        } 
        
        return false
    }

    isValidCardPairing(cards){
        console.log(cards)
    }

    isValidFiveCardPlay(cards){

    }
    beatsLastMove(lastTurn, cards){

    }

    setUserCards(){
        let userCards = []
        for(let i=0;i < 13;i++){
            userCards.push(this.deck.pop())
        }
        return userCards
    }

    setFirstTurn(playerCards, opponentCards){
        let smallestCard = {
            value: 15, suit: 4
        }
        let playerTurn

        playerCards.forEach((card) => {
            let suitValue = this.getSuitValue(card.suit)
            if((card.value <= smallestCard.value) && (suitValue <= smallestCard.suit)){
                smallestCard = {
                    value: card.value, suit: suitValue
                }
                playerTurn = true
            } 
        })

        opponentCards.forEach((card) => {
            let suitValue = this.getSuitValue(card.suit)
            if((card.value <= smallestCard.value) && (suitValue <= smallestCard.suit)){
                smallestCard = {
                    value: card.value, suit: suitValue
                }
                playerTurn = false
            } 
        })
        return playerTurn
    }

    shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }
}

export default Rules


