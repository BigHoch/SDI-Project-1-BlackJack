# SDI Project 1 Blackjack

## Summary

This is a web based implementation of the popular card game Blackjack, it is utitlizing HTML, CSS, and Javascript to run the application itself and the [Deck of Cards API](https://deckofcardsapi.com) is being used to provide the deck.
The Dealer Score and PlayerScore functions are not operation at this time and will be added at a later date. They have no effect on the the other functions of the game.

## Installation instructions

 - Clone this application directly to your machine from Github using your preferred code editor.
 - Open the files in your preferred code editor and run it utilizing LiveServer.

## Blackjack Rules

Here are the basic rules of Blackjack implemented in this application:

-  The objective of the game is to beat the dealer's hand without exceeding a total card value of 21.
-  You are initially dealt two cards face-up. The dealer receives one card face-up and one card face-down.
-  Cards 2-10 are worth their face value, face cards (Jack, Queen, King) are worth 10 points, and the Ace can be worth 1 or 11 points. In this implementation, the Ace is treated as an 11 until a player "busts", in which case it changes its value to 1.
- Players can choose to "Hit" to receive additional cards or "Stand" to keep their current hand.
- If the player's hand exceeds 21, they "bust" and lose the round.
- Once the player stands, the dealer reveals their face-down card and continues drawing until their hand value is at least 17.
- If the dealer's hand exceeds 21, they bust and the player wins. Otherwise, the hands are compared, and the higher hand wins.
- In case of a tie, the round is a "push".