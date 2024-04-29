Feature: Changing the game settings

Scenario: A registered user changes the number of questions in the game
    Given A registered user in the settings view
    When I change the game settings to 5 questions
    Then the game settings should be updated 

Scenario: A registered user changes the time limit in the game
    Given A registered user in the settings view
    When I change the game settings to 5:30 minutes
    Then the game settings should be updated 