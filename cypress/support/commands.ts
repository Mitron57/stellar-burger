/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.getByCy('greeting')
       */
      getByCy(value: string): Chainable<JQuery<HTMLElement>>

      /**
       * Custom command to set auth tokens
       */
      setAuthTokens(): Chainable<void>

      /**
       * Custom command to clear auth tokens
       */
      clearAuthTokens(): Chainable<void>
    }
  }
}

Cypress.Commands.add('getByCy', (value: string) => {
  return cy.get(`[data-cy="${value}"]`)
})

Cypress.Commands.add("setAuthTokens", () => {
  cy.window().then((win) => {
    win.localStorage.setItem("refreshToken", "fake-refresh-token")
  })
  cy.setCookie("accessToken", "fake-access-token")
})

Cypress.Commands.add("clearAuthTokens", () => {
  cy.window().then((win) => {
    win.localStorage.removeItem("refreshToken")
  })
  cy.clearCookie("accessToken")
})

export {}
