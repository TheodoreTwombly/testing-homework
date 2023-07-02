describe("Доставка", async function () {
  it("Правильное отображение страницы", async function () {
    await this.browser.url("/hw/store/delivery");
    const block = await this.browser.$(".Delivery");

    await block.waitForExist();

    await this.browser.assertView("plain", "#root", {
      compositeImage: false,
      allowViewportOverflow: true,
    });
  });
});
