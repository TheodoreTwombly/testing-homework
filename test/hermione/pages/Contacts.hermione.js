describe("Контакты", async function () {
  it("Правильное отображение страницы", async function () {
    await this.browser.url("/hw/store/contacts");
    const block = await this.browser.$(".Contacts");

    await block.waitForExist();

    await this.browser.assertView("plain", "#root", {
      compositeImage: false,
      allowViewportOverflow: true,
    });
  });
});
