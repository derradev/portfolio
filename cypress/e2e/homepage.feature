Feature: Homepage
  As a visitor
  I want to view the portfolio homepage
  So that I can learn about Demi's work and skills

  Background:
    Given I visit the homepage

  Scenario: Homepage loads successfully
    Then I should see the main heading
    And I should see navigation links
    And I should see featured projects

  Scenario: Navigation works correctly
    When I click on the "Projects" link
    Then I should be redirected to the projects page
    When I click on the "Experience" link
    Then I should be redirected to the experience page
    When I click on the "Blog" link
    Then I should be redirected to the blog page
    When I click on the "Learning" link
    Then I should be redirected to the learning page

  Scenario: Featured projects are displayed
    Then I should see at least one featured project
    And each project should have a title
    And each project should have technologies displayed
    And each project should have links to GitHub and live demo

  Scenario: Contact section is visible
    Then I should see a "Get In Touch" section
    And I should see an email link

