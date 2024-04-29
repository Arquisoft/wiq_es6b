Feature: Login a user

Scenario: An user logs in with valid credentials
  Given An user is in the login page
  When I fill the data in the form and press submit
  Then The user should be redirected to the home page