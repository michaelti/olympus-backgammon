# Plan for 2.0

## Classes

### Tavli

- lastWinner
- score: {}
- game: Game
- startingRolls
- step: startingRoll | game

### Game (abstract)

- player: Player.black | Player.white
- moves: Move[]
- dice: Dice
- pips: Pip[]
- bar
- off
- firstPip\*
- lastPip\*
- possibleTurns\*
- constructor()
- abstract isMoveValid()
- abstract doMove()
- isGameOver(): 0 | 1 | 2
- getDestination(): number
- otherPlayer(): Player

### Portes, Plakoto, Fevga (extends Game)

- firstPip\*
- lastPip\*
- state (fevga only)
- constructor()
- startTurn()
- isMoveValid()
- doMove()
- isGameOver() (plakoto only)
- getDestination() (fevga only)

### Pip

new Pip(size, owner, isPinned?)

- owner
- size
- isPinned

### Move

- from: number
- to: number
- dieUsed: number
- sideEffect: {from, to}
- getReversed()

### Dice

- initial: [x, x]
- remaining: [x, x]
- roll()
- getLargest()
- getSmallest()
- isDoubles()
- use()
- unUse()
