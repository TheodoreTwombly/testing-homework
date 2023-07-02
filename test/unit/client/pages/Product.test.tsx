import React from "react";
import { Router } from "react-router";
import { Provider } from "react-redux";
import { createMemoryHistory, MemoryHistory } from "history";
import { CartApi, ExampleApi } from "../../../../src/client/api";
import { Product as ProductType } from "../../../../src/common/types";
import { initStore } from "../../../../src/client/store";
import { render } from "@testing-library/react";
import { Application } from "../../../../src/client/Application";
import "@testing-library/jest-dom";

describe("Товар", () => {
  let api: ExampleApi;
  let cart: CartApi;
  let history: MemoryHistory;

  beforeEach(() => {
    const basename = "/hw/store";
    api = new ExampleApi(basename);
    const mockProduct: ProductType = {
      id: 0,
      name: "Product 0",
      price: 100,
      description: "Description of product 0.",
      material: "wood",
      color: "white",
    };
    api.getProductById = jest.fn().mockResolvedValueOnce({ data: mockProduct });

    cart = new CartApi();

    history = createMemoryHistory({
      initialEntries: ["/catalog/0"],
      initialIndex: 0,
    });
  });

  it("Отображение информации о товаре", async () => {
    const store = initStore(api, cart);
    const application = (
      <Router history={history}>
        <Provider store={store}>
          <Application />
        </Provider>
      </Router>
    );

    const { findByRole, findByText } = render(application);

    const heading = await findByRole("heading");
    expect(heading.textContent).toEqual("Product 0");
    expect(await findByText(/description of product 0\./i)).toBeInTheDocument();
    expect(await findByText(/\$100/i)).toBeInTheDocument();
    expect(await findByText(/wood/i)).toBeInTheDocument();
    expect(await findByText(/white/i)).toBeInTheDocument();
  });
});
