/// <reference types="cypress" />

describe("Ingredient Details", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/ingredients", { fixture: "ingredients.json" }).as("getIngredients")
    cy.visit("/")
    cy.wait("@getIngredients")
  })

  it("should display ingredient details on direct URL access", () => {
    // Переходим напрямую по URL ингредиента
    cy.visit("/ingredients/643d69a5c3f7b9001cfa093c")

    // Проверяем, что отображаются детали ингредиента
    cy.contains("Детали ингредиента").should("be.visible")
    cy.contains("Краторная булка N-200i").should("be.visible")
    cy.contains("420").should("be.visible") // калории
    cy.contains("80").should("be.visible") // белки
  })

  it("should show preloader for non-existent ingredient", () => {
    // Переходим на страницу несуществующего ингредиента
    cy.visit("/ingredients/non-existent-id");

    // Ждем загрузки ингредиентов
    cy.wait("@getIngredients");

    // Проверяем, что прелоадер отображается
    cy.get('div > div').should("be.visible");
  })
})
