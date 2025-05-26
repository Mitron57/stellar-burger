/// <reference types="cypress" />
import { SELECTORS } from '../support/selectors';

describe("Burger Constructor", () => {
  beforeEach(() => {
    // Перехватываем запросы к API
    cy.intercept("GET", "**/api/ingredients", { fixture: "ingredients.json" }).as("getIngredients")
    cy.intercept("GET", "**/api/auth/user", { fixture: "user.json" }).as("getUser")
    cy.intercept("POST", "**/api/orders", { fixture: "order.json" }).as("createOrder")

    // Посещаем главную страницу
    cy.visit("/")

    // Ждем загрузки ингредиентов
    cy.wait("@getIngredients")
  })

  describe("Adding ingredients to constructor", () => {
    it("should add bun to constructor", () => {
      // Находим булку и добавляем в конструктор
      cy.getByCy("Булки").within(() => {
        cy.get('li').first().find('button').click();
      })

      // Проверяем, что булка добавилась в конструктор
      cy.get(SELECTORS.CONSTRUCTOR).within(() => {
        cy.get(SELECTORS.CONSTRUCTOR_BUN).should("exist")
        cy.contains("Краторная булка N-200i").should("exist")
      })
    })

    it("should add main ingredient to constructor", () => {
      // Добавляем основной ингредиент
      cy.getByCy("Начинки").within(() => {
        cy.get('li').first().find('button').click();
      })

      // Проверяем, что ингредиент добавился
      cy.get(SELECTORS.CONSTRUCTOR).within(() => {
        cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT).should("exist")
      })
    })

    it("should add sauce to constructor", () => {
      // Добавляем соус
      cy.getByCy("Соусы").within(() => {
        cy.get('li').first().find('button').click();
      })

      // Проверяем, что соус добавился
      cy.get(SELECTORS.CONSTRUCTOR).within(() => {
        cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT).should("exist")
        cy.contains("Соус Spicy-X").should("exist")
      })
    })
  })

  describe("Ingredient modal functionality", () => {
    it("should open ingredient modal on click", () => {
      // Кликаем на ингредиент
      cy.get(SELECTORS.INGREDIENT_ITEM).first().click()

      // Проверяем, что модальное окно открылось
      cy.get(SELECTORS.MODAL).should("be.visible")
      cy.contains("Детали ингредиента").should("be.visible")
    })

    it("should display correct ingredient data in modal", () => {
      // Кликаем на конкретный ингредиент
      cy.getByCy("Булки").within(() => {
        cy.get(SELECTORS.INGREDIENT_ITEM).first().click()
      })

      // Проверяем данные в модальном окне
      cy.get(SELECTORS.MODAL).within(() => {
        cy.contains("Краторная булка N-200i").should("be.visible")
        cy.contains("420").should("be.visible") // калории
        cy.contains("80").should("be.visible") // белки
        cy.contains("24").should("be.visible") // жиры
        cy.contains("53").should("be.visible") // углеводы
      })
    })

    it("should close modal on close button click", () => {
      // Открываем модальное окно
      cy.get(SELECTORS.INGREDIENT_ITEM).first().click()
      cy.get(SELECTORS.MODAL).should("be.visible")

      // Закрываем по кнопке
      cy.get(SELECTORS.MODAL_CLOSE).click()
      cy.get(SELECTORS.MODAL).should("not.exist")
    })

    it("should close modal on overlay click", () => {
      // Открываем модальное окно
      cy.get(SELECTORS.INGREDIENT_ITEM).first().click()
      cy.get(SELECTORS.MODAL).should("be.visible")

      // Закрываем по клику на оверлей
      cy.get(SELECTORS.MODAL_OVERLAY).click({ force: true })
      cy.get(SELECTORS.MODAL).should("not.exist")
    })
  })

  describe("Order creation process", () => {
    beforeEach(() => {
      // Устанавливаем токены авторизации
      cy.setAuthTokens()
    })

    afterEach(() => {
      // Очищаем токены после теста
      cy.clearAuthTokens()
    })

    it("should create order successfully", () => {
      // Добавляем булку
      cy.getByCy("Булки").within(() => {
        cy.get('li').first().find('button').click();
      })

      // Добавляем основной ингредиент
      cy.getByCy("Начинки").within(() => {
        cy.get('li').first().find('button').click();
      })

      // Добавляем соус
      cy.getByCy("Соусы").within(() => {
        cy.get('li').first().find('button').click();
      })

      // Кликаем на кнопку "Оформить заказ"
      cy.contains("Оформить заказ").click()

      // Ждем создания заказа
      cy.wait("@createOrder")

      // Проверяем, что модальное окно с номером заказа открылось
      cy.get(SELECTORS.MODAL).should("be.visible")
      cy.contains("12345").should("be.visible")
      cy.contains("идентификатор заказа").should("be.visible")

      // Закрываем модальное окно
      cy.get(SELECTORS.MODAL_CLOSE).click()
      cy.get(SELECTORS.MODAL).should("not.exist")

      // Проверяем, что конструктор очистился
      cy.get(SELECTORS.CONSTRUCTOR).within(() => {
        cy.contains("Выберите булки").should("be.visible")
        cy.contains("Выберите начинку").should("be.visible")
      })
    })

    it("should redirect to login if not authenticated", () => {
      // Очищаем токены и ждем обновления состояния
      cy.clearAuthTokens()
      cy.intercept("GET", "**/api/auth/user", { statusCode: 401 }).as("getUser")
      cy.wait("@getUser")

      // Перезагружаем страницу для применения нового состояния
      cy.reload()
      cy.wait("@getUser")

      // Добавляем ингредиенты
      cy.getByCy("Булки").within(() => {
        cy.get('li').first().find('button').click();
      })

      // Пытаемся оформить заказ
      cy.contains("Оформить заказ").click()

      // Проверяем редирект на страницу логина
      cy.url().should("include", "/login")
    })
  })
})
