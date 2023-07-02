import React from "react";
import { Router } from "react-router";
import { createMemoryHistory, MemoryHistory } from "history";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { render, waitFor, within } from "@testing-library/react";
import events from "@testing-library/user-event";

import { ExampleApi, CartApi } from "../../../../src/client/api";
import { initStore } from "../../../../src/client/store";
import { Cart } from "../../../../src/client/pages/Cart";
import { CartState } from "../../../../src/common/types";
import { AxiosResponse } from "axios";

describe("Корзина", () => {
  let api: ExampleApi;
  let cartApi: CartApi;
  let history: MemoryHistory;

  beforeEach(() => {
    const basename = "/hw/store";
    api = new ExampleApi(basename);

    cartApi = new CartApi();

    history = createMemoryHistory({
      initialEntries: ["/cart"],
      initialIndex: 0,
    });
  });

  it("Отображение информации о выбранных товарах в корзине с суммарным количеством", async () => {
    cartApi.getState = jest.fn().mockReturnValueOnce({
      0: {
        name: "Product 0",
        count: 1,
        price: 100,
      },
      1: {
        name: "Product 1",
        count: 2,
        price: 200,
      },
    });

    const store = initStore(api, cartApi);
    const application = (
      <Router history={history}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </Router>
    );

    const { findByTestId, container } = render(application);

    const row0 = await findByTestId(0);
    const cellsContent0 = within(row0)
      .getAllByRole("cell")
      .map((cell) => cell.textContent);
    expect(cellsContent0).toContain("Product 0");
    expect(cellsContent0).toContain("1");
    expect(cellsContent0).toContain("$100");
    expect(cellsContent0).toContain("$100");

    const row1 = await findByTestId(1);
    const cellsContent1 = within(row1)
      .getAllByRole("cell")
      .map((cell) => cell.textContent);
    expect(cellsContent1).toContain("Product 1");
    expect(cellsContent1).toContain("2");
    expect(cellsContent1).toContain("$200");
    expect(cellsContent1).toContain("$400");

    const totalOrderPrice =
      container.querySelector(".Cart-OrderPrice")?.textContent;

    expect(totalOrderPrice).toEqual("$500");
  });

  it('Отображение "Cart is empty" если корзина пустая', () => {
    cartApi.getState = jest.fn().mockReturnValueOnce({});
    const store = initStore(api, cartApi);
    const application = (
      <Router history={history}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </Router>
    );

    const { queryByText, getByRole } = render(application);

    expect(
      queryByText(/cart is empty\. please select products in the \./i)
    ).toBeInTheDocument();

    const catalogLinkHref = getByRole("link", {
      name: /catalog/i,
    }).getAttribute("href");
    expect(catalogLinkHref).toEqual("/catalog");
  });

  it('Не отображается "Cart is empty" если корзина не пустая', () => {
    cartApi.getState = jest.fn().mockReturnValueOnce({
      0: {
        name: "Product 0",
        count: 1,
        price: 100,
      },
      1: {
        name: "Product 1",
        count: 2,
        price: 200,
      },
    });
    const store = initStore(api, cartApi);
    const application = (
      <Router history={history}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </Router>
    );

    const { queryByText } = render(application);

    expect(
      queryByText(/cart is empty\. please select products in the \./i)
    ).not.toBeInTheDocument();
  });

  it("Отображение checkout если корзина не пустая", () => {
    cartApi.getState = jest.fn().mockReturnValueOnce({
      0: {
        name: "Product 0",
        count: 1,
        price: 100,
      },
      1: {
        name: "Product 1",
        count: 2,
        price: 200,
      },
    });
    const store = initStore(api, cartApi);
    const application = (
      <Router history={history}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </Router>
    );

    const { queryByRole } = render(application);
    expect(queryByRole("heading", { name: /сheckout/i })).toBeInTheDocument();
  });

  it("Не отображается checkout если корзина не пустая", () => {
    cartApi.getState = jest.fn().mockReturnValueOnce({});
    const store = initStore(api, cartApi);
    const application = (
      <Router history={history}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </Router>
    );

    const { queryByRole } = render(application);

    expect(
      queryByRole("heading", { name: /сheckout/i })
    ).not.toBeInTheDocument();
  });

  it("Отправка формы если все поля заполнены правильно", async () => {
    const cartState: CartState = {
      0: {
        name: "Product 0",
        count: 1,
        price: 100,
      },
      1: {
        name: "Product 1",
        count: 2,
        price: 200,
      },
    };

    const form = {
      name: "Test",
      phone: "12345678910",
      address: "Moscow",
    };

    cartApi.getState = jest.fn().mockReturnValueOnce(cartState);
    const response: AxiosResponse = {
      data: { id: 5 },
      status: 200,
      statusText: "OK",
      config: {},
      headers: {},
    };
    api.checkout = jest.fn().mockReturnValueOnce(Promise.resolve(response));

    const store = initStore(api, cartApi);
    const application = (
      <Router history={history}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </Router>
    );

    const { getByRole, container } = render(application);

    const nameField = getByRole("textbox", {
      name: /name/i,
    });

    const phoneField = getByRole("textbox", {
      name: /phone/i,
    });

    const addressField = getByRole("textbox", {
      name: /address/i,
    });

    await events.type(nameField, form.name);
    await events.type(phoneField, form.phone);
    await events.type(addressField, form.address);

    const submitBtn = getByRole("button", {
      name: /checkout/i,
    });
    await events.click(submitBtn);

    const successMsg = container.querySelector(".Cart-SuccessMessage");

    await waitFor(() => expect(successMsg).toBeInTheDocument());
  });

  it("Отображается ошибка если отправить пустую форму", async () => {
    const cartState: CartState = {
      0: {
        name: "Product 0",
        count: 1,
        price: 100,
      },
      1: {
        name: "Product 1",
        count: 2,
        price: 200,
      },
    };
    cartApi.getState = jest.fn().mockReturnValueOnce(cartState);
    const store = initStore(api, cartApi);
    const application = (
      <Router history={history}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </Router>
    );

    const { getByRole, container } = render(application);
    const submitBtn = getByRole("button", {
      name: /checkout/i,
    });
    events.click(submitBtn);

    expect(container.querySelector(".invalid-feedback")).toBeInTheDocument();
  });
});
