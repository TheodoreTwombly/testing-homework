describe("Главная", async function () {
  it("Правильное отображение страницы", async function () {
    await this.browser.url("/hw/store");
    const block = await this.browser.$(".Home");

    await block.waitForExist();

    await this.browser.assertView("plain", "#root", {
      compositeImage: false,
      allowViewportOverflow: true,
    });
  });
});
