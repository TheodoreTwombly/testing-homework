describe("Каталог", async function () {
  it("Правильное отображение страницы товаров", async function () {
    await this.browser.url("/hw/store/catalog");
    const block = await this.browser.$('.ProductItem[data-testid="0"]');

    await block.waitForExist();
    await block.scrollIntoView();
    await this.browser.pause(1000);
    await this.browser.assertView("item 1", '.ProductItem[data-testid="0"]', {
      compositeImage: false,
      allowViewportOverflow: true,
      ignoreElements: [".ProductItem-Name", ".ProductItem-Price"],
    });

    const block26 = await this.browser.$('.ProductItem[data-testid="26"]');

    await block26.waitForExist();
    await block26.scrollIntoView();
    await this.browser.pause(1000);
    await this.browser.assertView("item 26", '.ProductItem[data-testid="26"]', {
      compositeImage: false,
      allowViewportOverflow: true,
      ignoreElements: [".ProductItem-Name", ".ProductItem-Price"],
    });

    await this.browser.$("#root").scrollIntoView();
    await this.browser.pause(1000);

    await this.browser.assertView("catalog", "#root", {
      compositeImage: false,
      allowViewportOverflow: true,
      ignoreElements: [".ProductItem-Name", ".ProductItem-Price"],
    });

    await this.browser
      .$(".ProductItem[data-testid='0']")
      .$("a")
      .scrollIntoView();
    await this.browser.pause(3000);
    this.browser.$(".ProductItem[data-testid='0']").$("a").click();

    await this.browser.$(".ProductDetails").waitForExist();
    await this.browser.$(".ProductDetails").scrollIntoView();

    await this.browser.pause(1000);
    await this.browser.assertView(
      "product details",
      ".ProductDetails-AddToCart",
      {
        compositeImage: false,
        allowViewportOverflow: true,
      }
    );
  });
});
