Feature: Admin Login
  As an admin user
  I want to login to the admin panel
  So that I can manage my portfolio content

  Scenario: Admin can login with valid credentials
    Given I visit the admin login page
    When I enter valid admin credentials
    And I click the login button
    Then I should be redirected to the admin dashboard
    And I should see the admin navigation menu

  Scenario: Admin cannot login with invalid credentials
    Given I visit the admin login page
    When I enter invalid admin credentials
    And I click the login button
    Then I should see an error message
    And I should remain on the login page

  Scenario: Admin can logout
    Given I am logged in as admin
    When I click the logout button
    Then I should be redirected to the login page
    And I should not see the admin dashboard

