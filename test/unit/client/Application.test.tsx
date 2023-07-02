import { Store } from "redux";
import { createMemoryHistory } from "history";
import { initStore, ApplicationState, Action } from "../../../src/client/store";
import { CartApi, ExampleApi } from "../../../src/client/api";
import { Router } from "react-router";
import { Provider } from "react-redux";
import React from "react";
import { Application } from "../../../src/client/Application";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Routing", () => {
  let store: Store<ApplicationState, Action>;

  beforeEach(() => {
    const basename = "/hw/store";

    const api = new ExampleApi(basename);
    const cart = new CartApi();

    store = initStore(api, cart);
  });

  it("render Home page on / route", () => {
    const history = createMemoryHistory({
      initialEntries: ["/"],
      initialIndex: 0,
    });

    const application = (
      <Router history={history}>
        <Provider store={store}>
          <Application />
        </Provider>
      </Router>
    );

    const { container } = render(application);
    expect(container.getElementsByClassName("Home").length).toBe(1);
  });

  it("render Contacts page on /contacts route", () => {
    const history = createMemoryHistory({
      initialEntries: ["/contacts"],
      initialIndex: 0,
    });

    const application = (
      <Router history={history}>
        <Provider store={store}>
          <Application />
        </Provider>
      </Router>
    );

    const { getByRole } = render(application);
    expect(getByRole("heading").textContent).toBe("Contacts");
  });

  it("render Delivery page on /delivery route", () => {
    const history = createMemoryHistory({
      initialEntries: ["/delivery"],
      initialIndex: 0,
    });

    const application = (
      <Router history={history}>
        <Provider store={store}>
          <Application />
        </Provider>
      </Router>
    );

    const { getByRole } = render(application);
    expect(getByRole("heading").textContent).toBe("Delivery");
  });

  it("render Catalog page on /catalog route", () => {
    const history = createMemoryHistory({
      initialEntries: ["/catalog"],
      initialIndex: 0,
    });

    const application = (
      <Router history={history}>
        <Provider store={store}>
          <Application />
        </Provider>
      </Router>
    );

    const { getByRole } = render(application);
    expect(getByRole("heading").textContent).toBe("Catalog");
  });

  it("render Product page on /catalog/:i route", () => {
    const history = createMemoryHistory({
      initialEntries: ["/catalog/0"],
      initialIndex: 0,
    });

    const application = (
      <Router history={history}>
        <Provider store={store}>
          <Application />
        </Provider>
      </Router>
    );

    const { container } = render(application);
    expect(container.getElementsByClassName("Product").length).toBe(1);
  });

  it("render Cart page on /cart route", () => {
    const history = createMemoryHistory({
      initialEntries: ["/cart"],
      initialIndex: 0,
    });

    const application = (
      <Router history={history}>
        <Provider store={store}>
          <Application />
        </Provider>
      </Router>
    );

    const { getByRole } = render(application);
    expect(getByRole("heading").textContent).toBe("Shopping cart");
  });
});
