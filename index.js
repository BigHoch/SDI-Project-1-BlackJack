
class Deck {
    constructor(newDeck) {
        this.success = newDeck["success"]
        this.deck_id = newDeck["deck_id"]
        this.remaining = newDeck["remaining"]
        this.shuffled = newDeck["shuffled"]
    }
    getDeckSuccess = () => { return this.success }
    getDeckID = () => { return this.deck_id }
    getDeckShuffled = () => { return this.shuffled }
    getDeckRemaining = () => { return this.remaining }
}
class Hand {
    #name
    #totalCardValue
    constructor(name, totalCardValue = 0, arrayOfCards = []) {
        this.#name = name;
        this.#totalCardValue = totalCardValue;
        this.arrayOfCards = arrayOfCards;
        this.numberOfAces = 0;                              
    }
    getName = () => { return this.#name }
    getTotalCardValue = () => { return this.#totalCardValue }
    getCard = (position = 0) => { return this.arrayOfCards[position] !== undefined ? this.arrayOfCards[position] : null }
    getNumberOfCards = () => { return this.arrayOfCards.length }
    getNumberOfAces = () => { return this.numberOfAces }
    addCard = (card, value = 0) => {
        if (card !== undefined) {
            this.arrayOfCards.push(card);
            this.#totalCardValue += convertCardValueToNumber(value);
            value === "ACE" ? this.numberOfAces += 1 : null;
        }
    }
    resetHand() {
        while (this.arrayOfCards.length > 0) {
            removeHTMLCardObject(this.arrayOfCards[this.arrayOfCards.length - 1].getCardCode(), this.#name);
            this.arrayOfCards.pop();
        }
        this.#totalCardValue = 0;
        this.numberOfAces = 0;
    }
    setTotalCardValue(newValue) {
        this.#totalCardValue = newValue;
    }
    editNumberOfAces = (value) => { this.numberOfAces = this.numberOfAces + value; }
}

class Card {
    #faceDown
    constructor(isFaceDown, newCard) {
        this.#faceDown = isFaceDown
        this.success = newCard["success"]
        this.deck_id = newCard["deck_id"]
        this.cardCode = newCard["cards"][0]["code"]
        this.cardImage = newCard["cards"][0]["image"]
        this.cardValue = newCard["cards"][0]["value"]
        this.cardSuit = newCard["cards"][0]["suit"]
        this.remaining = newCard["remaining"]
    }
    getFaceDown = () => { return this.#faceDown }
    getCardSuccess = () => { return this.success }
    getDeckID = () => { return this.deck_id }
    getCardCode = () => { return this.cardCode }
    getCardImage = () => { return this.cardImage }
    getCardValue = () => { return this.cardValue }
    getCardSuit = () => { return this.cardSuit }
    getCardsRemaining = () => { return this.remaining }
    setFaceDown = (value) => { this.#faceDown = value }
}
function checkFetch(fetchObject) {
    if (fetchObject !== undefined) {
        if (fetchObject["success"] !== undefined) {
            if (fetchObject["success"] == true) {
                return fetchObject;
            }
        }
    }
    throw new error(fetchObject);
}
function convertCardValueToNumber(value) {
    if (value === "2") { return 2; }
    else if (value == "3") { return 3; }
    else if (value == "4") { return 4; }
    else if (value == "5") { return 5; }
    else if (value == "6") { return 6; }
    else if (value == "7") { return 7; }
    else if (value == "8") { return 8; }
    else if (value == "9") { return 9; }
    else if (value == "10") { return 10; }
    else if (value == "JACK") { return 10; }
    else if (value == "QUEEN") { return 10; }
    else if (value == "KING") { return 10; }
    else if (value == "ACE") { return 11; }
    else { return 1; }
}
function changeAceValue(hand) {
    while ((hand.getTotalCardValue() > 21) && (hand.getNumberOfAces() > 0)) {
        hand.setTotalCardValue(hand.getTotalCardValue() - 10);
        hand.editNumberOfAces(-1);
    }
}
function editHTMLMessage(id, message = null) {
    document.getElementById(id).textContent = message;
}
function addHTMLObject(container, id) {
    let Container = document.querySelector(`#${container}`);
    let Element = document.createElement('div');
    Element.setAttribute("class", "card");
    Element.setAttribute("id", id);
    Container.appendChild(Element);
}
function createHTMLCardObject(id, container, image) {
    let Container = document.querySelector(`#${container}`);
    let Element = document.createElement('img');
    Element.setAttribute("src", image);
    Element.setAttribute("class", "card");
    Element.setAttribute("id", id)
    Container.appendChild(Element);
}
function removeHTMLCardObject(id, container) {
    let Container = document.querySelector(`#${container}`);
    let Element = document.getElementById(`${id}`);
    Container.removeChild(Element);
}
function flipCard() {
    for (let downCard of dealerHand.arrayOfCards) {
        if (downCard.getFaceDown() == true) {
            removeHTMLCardObject(downCard.getCardCode(), "ComputerPlayer");
            createHTMLCardObject(downCard.getCardCode(), "ComputerPlayer", downCard.getCardImage());
            downCard.setFaceDown(false);
        }
    }
}
function gameStateReset() {
    let stringToFetch = `https://www.deckofcardsapi.com/api/deck/${deck.getDeckID()}/return/`;
    fetch(stringToFetch)
        .then(rawResponse => rawResponse.json())
        .then(response => checkFetch(response))
        .then(response => {
            deck = new Deck(response);
            stringToFetch = `https://www.deckofcardsapi.com/api/deck/${deck.getDeckID()}/shuffle/`;
            fetch(stringToFetch)
                .then(rawResponse => rawResponse.json())
                .then(response => checkFetch(response))
                .then(response => {
                    deck = new Deck(response);
                    dealerHand.getNumberOfCards() > 0 ? dealerHand.resetHand() : null;
                    userHand.getNumberOfCards() > 0 ? userHand.resetHand() : null;
                    if (!(document.getElementById("cardcpPosition1"))) {
                        addHTMLObject("ComputerPlayer", "cardcpPosition1");
                    }
                    if (!(document.getElementById("cardcpPosition2"))) {
                        addHTMLObject("ComputerPlayer", "cardcpPosition2");
                    }
                    if (!(document.getElementById("cardUserPosition1"))) {
                        addHTMLObject("User", "cardUserPosition1");
                    }
                    if (!(document.getElementById("cardUserPosition2"))) {
                        addHTMLObject("User", "cardUserPosition2");
                    }
                })
        })
    editHTMLMessage("message", null);
    gameState = false;
}
function addCardToHand(hand, isFaceDown) {
    let stringToFetch = `https://www.deckofcardsapi.com/api/deck/${deck.getDeckID()}/draw/?count=1`;
    fetch(stringToFetch)
        .then(rawResponse => rawResponse.json())
        .then(response => checkFetch(response))
        .then(response => {
            generatedCard = new Card(isFaceDown, response);
            hand.addCard(generatedCard, generatedCard.getCardValue());
            if ((hand.getTotalCardValue() > 21) && (hand.getNumberOfAces() > 0)) {
                changeAceValue(hand);
            }
            if (isFaceDown == true) {
                createHTMLCardObject(generatedCard.getCardCode(), hand.getName(), "https://www.deckofcardsapi.com/static/img/back.png");
            } else {
                createHTMLCardObject(generatedCard.getCardCode(), hand.getName(), generatedCard.getCardImage());
            }
        })
        .catch(response => {
            gameStateReset();
        })
}
function checkForWinnerOrLoser(hand) {
    if ((userHand.getTotalCardValue() === 21) && (dealerHand.getTotalCardValue() === 21)) {
        flipCard();
        editHTMLMessage("message", `You pushed, Click reset to start another round.`)
        return true;
    } else if (hand.getTotalCardValue() === 21 && hand.getName() == "User") {
        flipCard();
        editHTMLMessage("message", `You win! Click reset to start another round.`)
        return true;
    } else if (hand.getTotalCardValue() === 21 && hand.getName() == "Computer Player") {
        flipCard();
        editHTMLMessage("message", `The dealer wins, Click reset to start another round.`)
        return true;
    } else {
        return false;
    }
}
drawCard = (hand) => { ((gameState === true) && (hand.getTotalCardValue() < 21)) ? addCardToHand(hand, false) : null }

let gameState = false;
var mainDeck = {
    "success": true,
    "deck_id": "y8buwo0uvdmd",
    "remaining": 52,
    "shuffled": true
};
var deck = new Deck(mainDeck);
var dealerHand = new Hand("ComputerPlayer", 0, []);
var userHand = new Hand("User", 0, []);
let playButton = document.querySelector('#playButton');
let standButton = document.querySelector('#standButton');
let quitButton = document.querySelector('#quitButton');
let hitButton = document.querySelector('#hitButton');
let doubleDownButton = document.querySelector('#doubleDownButton');
playButton.addEventListener("click", () => {
    let stringToFetch = `https://www.deckofcardsapi.com/api/deck/${deck.getDeckID()}/return/`;
    fetch(stringToFetch)
        .then(rawResponse => rawResponse.json())
        .then(response => {
            if (response["success"] == true) {
                if (deck.getDeckShuffled() !== true && deck.getDeckRemaining() !== 52) {
                    gameStateReset();
                }
            } else {             
                let stringToFetch = `https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`;
                fetch(stringToFetch)
                    .then(rawResponse => rawResponse.json())
                    .then(response => checkFetch(response))
                    .then(response => deck = new Deck(response))
                    .catch(console.log(response))
            }
            
        });
        
    setTimeout(function () {
        removeHTMLCardObject("cardcpPosition1", "ComputerPlayer");
        addCardToHand(dealerHand, true);
    }, 500)
    setTimeout(function () {
        removeHTMLCardObject("cardcpPosition2", "ComputerPlayer");
        addCardToHand(dealerHand, false);
    }, 1000)
    setTimeout(function () {
        removeHTMLCardObject("cardUserPosition1", "User");
        addCardToHand(userHand, false);
    }, 1500)
    setTimeout(function () {
        removeHTMLCardObject("cardUserPosition2", "User");
        addCardToHand(userHand, false);
    }, 2000)
    setTimeout(function () {
        if (checkForWinnerOrLoser(userHand) == false) {
            if (checkForWinnerOrLoser(dealerHand) == false) {
                gameState = true;
            }
        }
    }, 2000)
});
standButton.addEventListener("click", () => { 
    if (gameState === true) {
        if (dealerHand.getTotalCardValue() < 17) {
            const checkCards = new Promise((resolve, reject) => {
                setTimeout(function () {
                    dealerHand.getTotalCardValue() < 17 ? addCardToHand(dealerHand, false) : null;
                    dealerHand.getTotalCardValue() < 17 ? resolve("Success") : reject("Failure");
                }, 500);
            });
            checkCards.then(response = () => {
                return new Promise((resolve, reject) => {
                    setTimeout(function () {
                        dealerHand.getTotalCardValue() < 17 ? addCardToHand(dealerHand, false) : null;
                        dealerHand.getTotalCardValue() < 17 ? resolve("Success") : reject("Failure");
                    }, 500);
                })
                    .then(response = () => {
                        return new Promise((resolve, reject) => {
                            setTimeout(function () {
                                dealerHand.getTotalCardValue() < 17 ? addCardToHand(dealerHand, false) : null;
                                dealerHand.getTotalCardValue() < 17 ? resolve("Success") : reject("Failure");
                            }, 500);
                        })
                    })
                    .then(response = () => {
                        return new Promise((resolve, reject) => {
                            setTimeout(function () {
                                dealerHand.getTotalCardValue() < 17 ? addCardToHand(dealerHand, false) : null;
                                dealerHand.getTotalCardValue() < 17 ? resolve("Success") : reject("Failure");
                            }, 500);
                        })
                    })
                    .then(response => {
                        return new Promise((reject) => {
                            setTimeout(function () {
                                dealerHand.getTotalCardValue() < 17 ? addCardToHand(dealerHand, false) : null;
                                reject("Failure");
                            }, 500);
                        })
                    })

            })
                .catch(response => {
                    flipCard();
                    if (checkForWinnerOrLoser(userHand) == false) {
                        if (checkForWinnerOrLoser(dealerHand) == false) {
                            if (userHand.getTotalCardValue() == dealerHand.getTotalCardValue()) {
                                editHTMLMessage("message", `You pushed, Click reset to start another round.`)
                            } else if ((dealerHand.getTotalCardValue() > 21) && (userHand.getTotalCardValue() > 21)) {
                                editHTMLMessage("message", `You pushed, Click reset to start another round.`)
                            } else if (userHand.getTotalCardValue() > dealerHand.getTotalCardValue() && userHand.getTotalCardValue() <= 21) {
                                editHTMLMessage("message", `You win! Click reset to start another round.`)
                            } else if (dealerHand.getTotalCardValue() > 21) {
                                editHTMLMessage("message", `You win! Click reset to start another round.`)
                            } else {
                                editHTMLMessage("message", `The dealer wins, Click reset to start another round.`)
                            }
                        }
                    }
                    gameState = false;
                });
        } else {
            flipCard();
            if (checkForWinnerOrLoser(userHand) == false) {
                if (checkForWinnerOrLoser(dealerHand) == false) {
                    if (userHand.getTotalCardValue() == dealerHand.getTotalCardValue()) {
                        editHTMLMessage("message", `You pushed, Click reset to start another round.`)
                    } else if ((dealerHand.getTotalCardValue() > 21) && (userHand.getTotalCardValue() > 21)) {
                        editHTMLMessage("message", `You pushed, Click reset to start another round.`)
                    } else if (userHand.getTotalCardValue() > dealerHand.getTotalCardValue() && userHand.getTotalCardValue() <= 21) {
                        editHTMLMessage("message", `You win! Click reset to start another round.`)
                    } else if (dealerHand.getTotalCardValue() > 21) {
                        editHTMLMessage("message", `You win! Click reset to start another round.`)
                    } else {
                        editHTMLMessage("message", `The dealer wins, Click reset to start another round.`)
                    }
                }
            }
            gameState = false;
        }
    }
});
quitButton.addEventListener("click", () => {
    gameStateReset();
});
hitButton.addEventListener("click", () => {
    drawCard(userHand);
});
let doubleDownUsed = false;
        doubleDownButton.addEventListener("click", () => {
       drawCard(userHand);
    });
