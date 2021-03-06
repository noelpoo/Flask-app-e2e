/// <reference types="cypress" />

describe("Mainlist", () => {
  beforeEach(() => {
    cy.visit("https://noelpoo.github.io/Flask-app-fe/");
  });

  // CHECKING NAV BAR
  it("check nav bar", () => {
    cy.get("nav").children(".welcome").should("exist");
    cy.get("nav").children(".login").should("exist");
  });

  // CHECKING EACH ROW ELEMENT
  it("check row elements", () => {
    cy.get(".movements").children();
    cy.document()
      .then((doc) => {
        const movementContainer = doc.querySelectorAll(".movements__row");
        console.log("movements", movementContainer);
        return movementContainer;
      })
      .then((container) => {
        container.forEach((row) => {
          cy.get(row).children().should("have.length", 3);
          cy.get(row).children(".movements__type").should("exist");
          cy.get(row).children(".movements__time").should("exist");
          cy.get(row).children(".movements__value").should("exist");
        });
      });
  });

  // MOCKING MAINLIST API RESPONSE
  it("mocking mainlist and check row elements", () => {
    const fixture_path = "items_list_resp.json";
    cy.intercept("GET", "**/items?sort=1**", { fixture: fixture_path });
    cy.visit("https://noelpoo.github.io/Flask-app-fe/");
    cy.get(".movements").children();
    cy.document()
      .then((doc) => {
        const container = doc.querySelectorAll(".movements__row");
        console.log("movements", container);
        return container;
      })
      .then((container) => {
        container.forEach((row) => {
          cy.get(row).children().should("have.length", 3);
          cy.get(row).children(".movements__type").should("exist");
          cy.get(row).children(".movements__time").should("exist");
          cy.get(row).children(".movements__value").should("exist");
        });
      });
  });

  //CHECKING CURRENT DATE
  it("check current date", () => {
    cy.get(".date").should("have.text", getCurrentDate());
  });

  // CHECKING IF SORT BUTTONS CALL CORRECT API
  it("sort button calls correct API", () => {
    cy.intercept("GET", "**/items?sort=**").as("sorted");
    cy.get(".btn--sort").click();
    cy.wait("@sorted")
      .its("response.statusCode")
      .should("be.oneOf", [200, 400]);
  });

  // CHECKING THAT /items?sort API RETURNS CORRECT NO. OF ITEMS
  it("sort API returns correct list", () => {
    cy.intercept("GET", "**/items?sort=1").as("get_list");
    cy.visit("https://noelpoo.github.io/Flask-app-fe/");
    cy.wait("@get_list")
      .then((resp) => {
        console.log(resp);
        const resp_json = resp.response.body;
        const items = resp_json.items;
        const items_count = items.length;
        console.log("items count: ", items_count);
        return items_count;
      })
      .then((items_count) => {
        cy.intercept("GET", "**/items?sort=**").as("sorted");
        cy.get(".btn--sort").click();
        cy.wait("@sorted").then((resp) => {
          assert.equal(resp.response.body.items.length, items_count);
        });
      });
  });

  const getCurrentDate = function () {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();

    today = dd + "/" + mm + "/" + yyyy;
    return String(today);
  };
});
