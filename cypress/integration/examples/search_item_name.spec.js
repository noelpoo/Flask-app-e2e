/// <reference types="cypress" />

describe("Search item name", () => {
  beforeEach(() => {
    cy.visit("https://noelpoo.github.io/Flask-app-fe/");
  });

  // CHECKING "search item" BOX HAS CORRECT ELEMENTS
  it("check 'search item' box elements", () => {
    cy.get(".operation.operation--search").should("exist");
    cy.get(".operation.operation--search")
      .children(".form.form--search")
      .should("exist");
    cy.get(".form.form--search").children(
      ".form__input.form__input--item--search"
    );
    cy.get(".form.form--search").children(".form__btn.form__btn--search");
  });

  // CHECKING "search item" INPUT FIELD
  it("search item string input", () => {
    const randomString = generateRandomString(5);
    cy.get(".form__input.form__input--item--search").type(randomString);
    cy.get(".form__input.form__input--item--search").should(
      "have.value",
      randomString
    );
  });

  // CHECKING "search item" SENDS OUT CORRECT REQUEST
  it("search item request", () => {
    const randomString = generateRandomString(5);
    cy.get(".form__input.form__input--item--search").type(randomString);

    cy.intercept("GET", "**/item?name=**").as("get-item");
    cy.get(".form__btn.form__btn--search").click();
    cy.wait("@get-item").then(function (req) {
      assert.include(req.request.url, randomString);
    });
  });

  // CHECKING SEARCH RESULT MODAL WINDOW
  it("search result modal window", () => {
    const fixture_path = "get_item_resp.json";
    const randomString = generateRandomString(5);
    cy.get(".form__input.form__input--item--search").type(randomString);
    cy.intercept("GET", "**/item?name=**", { fixture: fixture_path });
    cy.get(".form__btn.form__btn--search").click();

    cy.get(".modal").should("exist");
    cy.get(".search__item__id").should("have.text", "item id: 999");
    cy.get(".search__item__name").should("have.text", "name: test item");
    cy.get(".search__item__price").should("have.text", "price: 9.99");
  });

  const generateRandomString = function (length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
});
