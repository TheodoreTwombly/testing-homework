describe("Меню", async function () {
  it("Навигация сайта", async function () {
    await this.browser.url("/hw/store");
    await this.browser.assertView("menu", ".navbar .container", {
      compositeImage: true,
      selectorToScroll: ".navbar .container",
    });
  });
});

describe("Мобильное меню", async function () {
  it("Открытие, закрытие гамбургера", async function () {
    await this.browser.setWindowSize(575, 1000);
    await this.browser.url("/hw/store");

    const block = this.browser.$(".Application-Toggler");
    await block.waitForExist();
    await block.click();
    await this.browser.pause(1000);
    await this.browser.assertView("opened", ".navbar .container", {
      compositeImage: true,
    });

    await block.click();
    await this.browser.pause(1000);
    await this.browser.assertView("closed", ".navbar .container", {
      compositeImage: true,
    });

    await block.click();
    await this.browser.pause(2000);
    await this.browser.$(".navbar-nav").$(".nav-link").click();
    await this.browser.pause(1000);
    await this.browser.assertView("clicked on link", ".navbar .container", {
      compositeImage: true,
    });

    await this.browser.execute(() => {
      const cartState = {
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
      localStorage.setItem("example-store-cart", JSON.stringify(cartState));
    });

    await this.browser.url("/hw/store/catalog");

    await block.waitForExist();
    await block.click();
    await this.browser.pause(1000);
    await this.browser.assertView(
      "opened with not empty cart",
      ".navbar .container",
      {
        compositeImage: true,
      }
    );

    await block.click();
    await this.browser.pause(1000);
    await this.browser.assertView(
      "closed with not empty cart",
      ".navbar .container",
      {
        compositeImage: true,
      }
    );

    await block.click();
    await this.browser.pause(2000);
    await this.browser.$(".navbar-nav").$(".nav-link").click();
    await this.browser.pause(1000);
    await this.browser.assertView(
      "clicked on link with not empty cart",
      ".navbar .container",
      {
        compositeImage: true,
      }
    );

    await this.browser.execute(() => {
      localStorage.clear();
    });
  });
});
