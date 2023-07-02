import React from "react";
import { createMemoryHistory, MemoryHistory } from "history";
import { Router } from "react-router";
import { Provider } from "react-redux";
import { render, within } from "@testing-library/react";
import events from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { CartApi, ExampleApi } from "../../../../src/client/api";
import { ProductShortInfo } from "../../../../src/common/types";
import { initStore } from "../../../../src/client/store";
import { ProductItem } from "../../../../src/client/components/ProductItem";

describe("Карточка товара", () => {
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

  it("Отображение информации о товаре", () => {
    const store = initStore(api, cart);
    const component = (
      <Router history={history}>
        <Provider store={store}>
          <ProductItem product={mockProduct} />
        </Provider>
      </Router>
    );

    const { getByTestId } = render(component);

    const card = getByTestId(0);
    expect(card).toBeInTheDocument();
    expect(within(card).getByRole("heading").textContent).toEqual("Product 0");
    expect(within(card).getByText(/\$100/i)).toBeInTheDocument();
  });

  it("Открытие /catalog/:i по клику на Детали", async () => {
    const store = initStore(api, cart);
    const component = (
      <Router history={history}>
        <Provider store={store}>
          <ProductItem product={mockProduct} />
        </Provider>
      </Router>
    );

    const { getByTestId } = render(component);
    const card = getByTestId(0);
    await events.click(within(card).getByRole("link"));

    expect(history.location.pathname).toBe("/catalog/0");
  });
});
