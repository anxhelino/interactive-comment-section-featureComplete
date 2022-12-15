class sendReplyCommentView {
  _data;
  _parentElement = document.querySelector("main");
  render(data, parentData) {
    this._data = data;
    const markup = this._generateMarkup();
    this._parentElement.insertAdjacentHTML("afterend", markup);
    console.log(this._generateMarkup());
  }

  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join("");
  }

  addHandlerRenderComment(handler) {
    window.addEventListener("load", handler);
  }

  addHandlerRenderSendCommentBox() {
    const parent = document.querySelector(".send-comment");
    parent.addEventListener("click", function (e) {
      e.preventDefault();
      console.log(e.target.nodeName.toLowerCase());
      if (e.target.nodeName.toLowerCase() === "a") {
        console.log(parent.querySelector("textarea").value.trim(" "));
        const data = parent.querySelector("textarea").value.trim(" ");

        console.log(data);
      }
    });
  }
}

export default new sendReplyCommentView();
