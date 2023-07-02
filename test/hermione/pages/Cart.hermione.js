describe("Корзина", async function () {
  it("Проверка формы", async function () {
    const addToCart = async (id) => {
      await this.browser.url("/hw/store/catalog/" + id);

      const block = await this.browser.$(".ProductDetails-AddToCart");
      await block.scrollIntoView();
      await this.browser.waitUntil(() => block.isClickable(), 1000);

      await block.click();
      await this.browser.pause(1000);
    };

    const screenshotCart = async (name) => {
      const blockCart = await this.browser.$(".Cart");

      await blockCart.waitForExist();

      await this.browser.assertView(name, ".Cart", {
        compositeImage: true,
        selectorToScroll: ".Cart",
        ignoreElements: [
          ".Cart-Name",
          ".Cart-Price",
          ".Cart-Total",
          ".Cart-OrderPrice",
        ],
      });
    };

    await addToCart(0);
    await this.browser.url("/hw/store/cart");
    const clearBtn = await this.browser.$(".Cart-Clear");
    await clearBtn.waitForExist();
    await clearBtn.scrollIntoView();
    await this.browser.waitUntil(() => clearBtn.isClickable(), 1000);
    await clearBtn.click();
    await this.browser.pause(1000);
    await screenshotCart("cleared");

    await addToCart(2);
    await addToCart(3);
    await addToCart(2);

    await this.browser.url("/hw/store/cart");

    await this.browser.pause(1000);

    const blockFormSubmit = await this.browser.$(".Form-Submit");
    await blockFormSubmit.waitForExist();
    await blockFormSubmit.scrollIntoView();
    await this.browser.waitUntil(() => blockFormSubmit.isClickable(), 1000);
    await blockFormSubmit.click();
    await this.browser.pause(1000);

    const form = await this.browser.$(".Form");
    await form.waitForExist();
    await form.scrollIntoView();
    await this.browser.pause(1000);
    await this.browser.assertView("form invalid", ".Form", {
      compositeImage: false,
      allowViewportOverflow: true,
    });

    const blockFormName = await this.browser.$(".Form-Field_type_name");
    const blockFormPhone = await this.browser.$(".Form-Field_type_phone");
    const blockFormAddress = await this.browser.$(".Form-Field_type_address");

    await blockFormName.setValue("Ivan Ivanov");
    await blockFormPhone.setValue("7978");
    await blockFormAddress.setValue("Russia, Moscow");

    await this.browser.waitUntil(() => blockFormSubmit.isClickable(), 1000);
    await blockFormSubmit.click();

    await form.waitForExist();
    await form.scrollIntoView();
    await this.browser.pause(1000);
    await this.browser.assertView("form invalid phone", ".Form", {
      compositeImage: false,
      allowViewportOverflow: true,
    });

    await blockFormPhone.setValue("79789999999");
    await this.browser.waitUntil(() => blockFormSubmit.isClickable(), 1000);
    await blockFormSubmit.click();

    const blockCartSuccess = await this.browser.$(".Cart-SuccessMessage");

    await blockCartSuccess.scrollIntoView();

    await this.browser.assertView("form submit", ".Cart-SuccessMessage", {
      compositeImage: true,
      selectorToScroll: ".Cart-SuccessMessage",
      tolerance: 5,
      antialiasingTolerance: 4,
      ignoreElements: [".Cart-Number"],
    });

    await this.browser.execute("window.localStorage.clear()");
  });
});
