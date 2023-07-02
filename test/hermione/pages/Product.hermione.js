describe("Товар", async function () {
  it("Добавление товара в корзину", async function () {
    const screenshotCartLink = async (name) => {
      const cartLink = this.browser.$('.nav-link[href="/hw/store/cart"]');
      await cartLink.waitForExist();
      await cartLink.scrollIntoView();
      await this.browser.pause(1000);
      await this.browser.assertView(name, '.nav-link[href="/hw/store/cart"]', {
        compositeImage: false,
      });
    };

    const addToCart = async (id) => {
      await this.browser.url("/hw/store/catalog/" + id);

      const block = await this.browser.$(".ProductDetails-AddToCart");
      await block.scrollIntoView();
      await this.browser.waitUntil(() => block.isClickable(), 1000);

      await block.click();
      await this.browser.pause(1000);
    };

    const screenshotProductDetails = async (name) => {
      const details = await this.browser.$(".ProductDetails");
      await details.waitForExist();
      await this.browser.assertView(name, ".ProductDetails-AddToCart", {
        compositeImage: true,
        selectorToScroll: ".ProductDetails",
        tolerance: 5,
        ignoreAntialiasing: true,
      });
    };
    await this.browser.setWindowSize(1200, 4000);
    await this.browser.url("/hw/store/catalog/6");

    await screenshotProductDetails("product");

    await addToCart(4);

    await screenshotProductDetails("show message item in cart");
    await screenshotCartLink("menu cart link 1");

    await this.browser.execute("window.localStorage.clear()");
  });
});
