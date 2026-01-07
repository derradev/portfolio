Feature: Blog
  As a visitor
  I want to view blog posts
  So that I can read about Demi's thoughts and experiences

  Background:
    Given I visit the blog page

  Scenario: Blog page displays all posts
    Then I should see a list of blog posts
    And each post should have a title
    And each post should have a publish date
    And each post should have a category

  Scenario: User can view a single blog post
    When I click on a blog post
    Then I should see the full blog post content
    And I should see the post title
    And I should see the post author
    And I should see the post publish date
    And I should see the post content

  Scenario: Blog posts have proper meta tags
    When I view a blog post
    Then the page should have Open Graph meta tags
    And the page should have Twitter Card meta tags

