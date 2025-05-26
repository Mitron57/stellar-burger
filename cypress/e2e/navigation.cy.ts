/// <reference types="cypress" />

describe("Navigation", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/ingredients", { fixture: "ingredients.json" }).as("getIngredients")
    cy.intercept("GET", "**/api/orders/all", { fixture: "orders-feed.json" }).as("getOrdersFeed")
  })

  it("should navigate between pages", () => {
    cy.visit("/")
    cy.wait("@getIngredients")

    // Переходим на страницу ленты заказов
    cy.contains("Лента заказов").click()
    cy.url().should("include", "/feed")

    // Возвращаемся на главную
    cy.getByCy("logo").click()
    cy.url().should("eq", Cypress.config().baseUrl + "/")
  })

  it("should redirect to login when accessing protected routes", () => {
    cy.visit("/profile")
    cy.url().should("include", "/login")
  })
})
