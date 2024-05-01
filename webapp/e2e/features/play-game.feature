Feature: Playing a game

Scenario: Starts a new game
  Given A logged user in play view
  When I press "COMENZAR A JUGAR"
  Then A new game starts
