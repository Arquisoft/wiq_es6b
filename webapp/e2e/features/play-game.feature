Feature: Playing a game

Scenario: Starts a new game
  Given A logged user in play view
  When I press "COMENZAR A JUGAR"
  Then A new game starts
Scenario: Results are shown
  Given A logged user in a game
  When I choose an option
  Then Show results
Scenario: Shows the next questions 
  Given A logged user in a game
  When I choose an option
  Then New Question appears
Scenario: Finish the game
  Given A logged user in a game
  When I play until the game ends
  Then The game is finished