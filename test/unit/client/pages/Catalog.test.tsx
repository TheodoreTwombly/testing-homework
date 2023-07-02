import React from "react";
import { createMemoryHistory, MemoryHistory } from "history";
import { Router } from "react-router";
import { Provider } from "react-redux";
import { CartApi, ExampleApi } from "../../../../src/client/api";
import { initStore } from "../../../../src/client/store";
import { Catalog } from "../../../../src/client/pages/Catalog";
import { ProductShortInfo } from "../../../../src/common/types";
import { render, within } from "@testing-library/react";

describe("Каталог", () => {
  let api: ExampleApi;
  let application: React.ReactElement;

  beforeEach(() => {
    const basename = "/hw/store";
    api = new ExampleApi(basename);

    const history = createMemoryHistory({
      initialEntries: ["/catalog"],
      initialIndex: 0,
    });

    const cart = new CartApi();

    const store = initStore(api, cart);

    application = (
      <Router history={history}>
        <Provider store={store}>
          <Catalog />
        </Provider>
      </Router>
    );
  });

  it("Отображение списка товаров", async () => {
    const mockProducts: ProductShortInfo[] = [
      {
        id: 0,
        name: "Product 0",
        price: 100,
      },
      {
        id: 1,
        name: "Product 1",
        price: 101,
      },
    ];
    api.getProducts = jest.fn().mockResolvedValueOnce({ data: mockProducts });

    const { findAllByTestId } = render(application);

    const productCard0 = await findAllByTestId(0);
    const productCard1 = await findAllByTestId(1);
    const productNames = [...productCard0, ...productCard1].map(
      (card) => within(card).getByRole("heading").textContent
    );

    expect(productNames).toContain("Product 0");
    expect(productNames).toContain("Product 1");
  });
});
