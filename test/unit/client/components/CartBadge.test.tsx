import React from "react";
import { Router } from "react-router";
import { createMemoryHistory, MemoryHistory } from "history";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";

import { ExampleApi, CartApi } from "../../../../src/client/api";
import { initStore } from "../../../../src/client/store";
import { CartState, ProductShortInfo } from "../../../../src/common/types";
import { CartBadge } from "../../../../src/client/components/CartBadge";

describe("Корзина в меню навигации", () => {
  let cart: CartApi;
  let history: MemoryHistory;
  let api: ExampleApi;
  let mockProduct: ProductShortInfo;

  beforeEach(() => {
    const basename = "/hw/store";
    api = new ExampleApi(basename);

    history = createMemoryHistory({
      initialEntries: ["/catalog"],
      initialIndex: 0,
    });

    cart = new CartApi();

    mockProduct = {
      id: 0,
      name: "Product 0",
      price: 100,
    };
  });

  it('Отображение "Item in cart" если товар в корзине', () => {
    const cartState: CartState = {
      0: {
        name: "Product 0",
        price: 100,
        count: 1,
      },
    };
    cart.getState = jest.fn().mockReturnValueOnce(cartState);
    const store = initStore(api, cart);
    const component = (
      <Router history={history}>
        <Provider store={store}>
          <CartBadge id={0} />
        </Provider>
      </Router>
    );

    const { getByText } = render(component);

    expect(getByText(/item in cart/i)).toBeInTheDocument();
  });

  it('Не отображается "Item in cart" если товар не в корзине', () => {
    const cartState: CartState = {};
    cart.getState = jest.fn().mockReturnValueOnce(cartState);
    const store = initStore(api, cart);
    const component = (
      <Router history={history}>
        <Provider store={store}>
          <CartBadge id={0} />
        </Provider>
      </Router>
    );

    const { container } = render(component);

    expect(container.getElementsByClassName("CartBadge").length).toBe(0);
  });
});
