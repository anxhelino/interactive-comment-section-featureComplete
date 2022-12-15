class CommentView {
  _data;
  _parentElement = document.querySelector("main");
  _bodyElement = document.querySelector("body");
  _newContent = "";
  parentReply;

  render(data, currentUser) {
    this._data = data;
    this._clear();
    this._data.forEach((comment) => {
      this._parentElement.insertAdjacentHTML(
        "beforeend",
        this._generateMarkupPreview(comment, currentUser)
      );
      setTimeout(function () {
        document
          .querySelector(`.id-${comment.id}`)
          .classList.remove("hidden_div");
      }, 200);

      comment.replies.forEach((reply) => {
        this._parentElement.insertAdjacentHTML(
          "beforeend",
          this._generateMarkupReplyPreview(reply, currentUser)
        );
        setTimeout(function () {
          document
            .querySelector(`.id-${reply.id}`)
            .classList.remove("hidden_div");
        }, 200);
      });
    });
    this._parentElement.insertAdjacentHTML(
      "afterend",
      this._generateMarkupSendComment(currentUser)
    );
  }

  renderNewComment(data, currentUser) {
    this._parentElement.insertAdjacentHTML(
      "beforeend",
      this._generateMarkupPreview(data, currentUser)
    );
    setTimeout(function () {
      document.querySelector(`.id-${data.id}`).classList.remove("hidden_div");
    }, 200);
  }

  renderNewReply(data, currentUser, parentEl) {
    parentEl.insertAdjacentHTML(
      "afterend",
      this._generateMarkupReplyPreview(data, currentUser)
    );
    setTimeout(function () {
      document.querySelector(`.id-${data.id}`).classList.remove("hidden_div");
    }, 200);
  }

  addHandlerRenderComment(handler) {
    window.addEventListener("load", handler);
  }

  updateScore(currentUser) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".icon");

      if (!btn) return;
      const updateTo = +btn.dataset.updateTo;
      const commentId = btn.dataset.id;
      if (commentId === currentUser.username) return;
      const iconPlus = e.target.closest(".icon-plus");
      const iconMinus = e.target.closest(".icon-minus");
      if (iconPlus) {
        const numContainerPlus = iconPlus.nextElementSibling;
        if (
          +numContainerPlus.firstChild.nextElementSibling.textContent < updateTo
        )
          +numContainerPlus.firstChild.nextElementSibling.textContent++;
        const eventClickAudo = new Audio("./eventClick.wav");
        eventClickAudo.play();
      }
      if (iconMinus) {
        const eventClickAudo = new Audio("./eventClick.wav");
        eventClickAudo.play();
        const numContainerMinus = iconMinus.previousElementSibling;
        if (
          +numContainerMinus.firstChild.nextElementSibling.textContent >
          updateTo
        )
          +numContainerMinus.firstChild.nextElementSibling.textContent--;
      }
    });
  }

  _generateMarkupPreview(data, currentUser, replyComment = false) {
    return `
        <div class="container ${
          replyComment === false ? "submit-comment" : "reply-comment"
        } id-${data.id} hidden_div">
        <div class="aside">
          <div class="icon-plus icon" data-update-to="${
            data.score + 1
          }" data-id ="${data.username}">
            <img src="/src/img/icon-plus.svg" alt="" />
          </div>
          <div class="number">
            <p>${data.score}</p>
          </div>
          <div class="icon-minus icon" data-update-to="${
            data.score - 1
          }" data-id ="${data.username}">
            <img src="/src/img/icon-minus.svg" alt="" />
          </div>
        </div>
        <div class="comment">
          <div class="header-commenter">
            <div class="profile">
              <img
                class="profile-icon"
                src="${data.userImg}"
                alt=""
              />
              <p class="profile-name">${data.username}</p>
              ${
                data.username === currentUser.username
                  ? `
                  <p class="current-user">you</p>`
                  : ""
              }                  
              </div>
            <p class="time-written">${data.createdAt}</p>
            <div class="reply">
            ${
              data.username === currentUser.username
                ? `
            <img
            class="reply-icon"
            src="/src/img/icon-delete.svg"
            alt=""
            class="delete"
          />
          <p class="delete-text id-${data.id}">Delete</p>
          <img
            class="reply-icon"
            src="/src/img/icon-edit.svg"
            alt=""
            class="edit"
          />
          <p class="edit-text id-${data.id}">Edit</p>
            `
                : `
            <img
            class="reply-icon"
            src="/src/img/icon-reply.svg"
            alt=""
            class="reply"
          />
          <p class="reply-text id-${data.id}">Reply</p>
            `
            }
             
            </div>
          </div>
          <div class="comments">
            <p>
            ${data.content} 
            </p>
          </div>
        </div>
      </div> 
        
      <div class="container reply-container reply-comment reply-comment-id-${
        data.id
      } id-${data.id} hidden hidden_div" style="margin-top: 3vh;">
      <div>
        <img
          class="profile-icon"
          src="${currentUser.userImg}"
          alt=""
        />
      </div>
      <div class="input">
        <textarea class = 'reply-input'>${
          data.username === currentUser.username
            ? data.content
            : `@${data.username + " "} `
        } </textarea>
        ${
          data.username === currentUser.username
            ? `<a type='submit' class="update-link" href="#">Update</a>`
            : `<a type='submit' class="reply-link" href="#">Reply</a>`
        }
      </div>
    </div>`;
  }

  _generateMarkupReplyPreview(data, currentUser) {
    return `
      <div class="container reply-comment  id-${data.id} ${
      data.replyingTo
    } hidden_div" style="margin-top: 3vh">
      <div class="aside">
        <div class="icon-plus icon" data-update-to="${
          data.score + 1
        }" data-id ="${data.user.username}">
          <img src="/src/img/icon-plus.svg" alt="" />
        </div>
        <div class="number">
          <p>${data.score}</p>
        </div>
        <div class="icon-minus icon" data-update-to="${
          data.score - 1
        }" data-id ="${data.user.username}">
          <img src="/src/img/icon-minus.svg" alt="" />
        </div>
      </div>
      <div class="comment">
        <div class="header-commenter">
          <div class="profile">
            <img
              class="profile-icon"
              src="${data.user.image.png}"
              alt=""
            />
            <p class="profile-name">${data.user.username}</p>
            ${
              data.user.username === currentUser.username
                ? `
                <p class="current-user">you</p>`
                : ""
            }
          </div>
          <p class="time-written">${data.createdAt}</p>
          <div class="reply">
         ${
           data.user.username === currentUser.username
             ? `
         <img
         class="reply-icon"
         src="/src/img/icon-delete.svg"
         alt=""
         class="delete"
       />
       <p class="delete-text id-${data.id}">Delete</p>
       <img
         class="reply-icon"
         src="/src/img/icon-edit.svg"
         alt=""
         class="edit"
       />
       <p class="edit-text id-${data.id}">Edit</p>
         `
             : `
         <img
         class="reply-icon"
         src="/src/img/icon-reply.svg"
         alt=""
         class="reply"
       />
       <p class="reply-text id-${data.id}">Reply</p>
         `
         }
          </div>
        </div>
        <div class="comments">
          <p>${data.content}</p>
        </div>
      </div>
    </div>
    <div class="container reply-container reply-comment reply-comment-id-${
      data.id
    } id-${data.id} hidden hidden_div" style="margin-top: 3vh;">
      <div>
        <img
          class="profile-icon"
          src="${currentUser.userImg}"
          alt=""
        />
      </div>
      <div class="input">
        <textarea class = 'reply-input'>${
          data.user.username === currentUser.username
            ? data.content
            : `@${data.user.username + " "}`
        } </textarea>
    ${
      data.user.username === currentUser.username
        ? `<a type='submit' class="update-link" href="#">Update</a>`
        : `<a type='submit' class="reply-link" href="#">Reply</a>`
    }
        
      </div>
    </div>
    `;
  }
  _generateMarkupSendComment(data) {
    return `
   <div class="container reply-container send-comment" style="margin-top: 3vh">
   <div>
     <img
       class="profile-icon"
       src="${data.userImg}"
       alt=""
     />
   </div>
   <div class="input">
     <textarea class="input-textarea" placeholder="Add a comment"></textarea>
     <a class="send-comment-link" href="#">Send</a>
   </div>
  </div>
   `;
  }

  addHandlerRenderReplyBox() {
    this._parentElement.addEventListener("click", function (e) {
      e.preventDefault();
      if (e.target.closest(".reply-text") || e.target.closest(".edit-text")) {
        const eventClickAudo = new Audio("./eventClick.wav");
        eventClickAudo.play();
        const id = e.target.closest(`.container`).classList[2];

        const replyBox = document.querySelector(`.reply-comment-${id}`);
        if (replyBox.classList.contains("hidden")) {
          // debugger;
          replyBox.classList.remove("hidden");
          setTimeout(function () {
            replyBox.classList.remove("hidden_div");
          }, 100);
        } else if (!replyBox.classList.contains("hidden")) {
          replyBox.classList.add("hidden_div");
          setTimeout(function () {
            replyBox.classList.add("hidden");
          }, 400);
        }
      }
    });
  }

  addHandlerRenderSendReply(handler) {
    this._parentElement.addEventListener("click", function (e) {
      if (e.target.classList.contains("reply-link")) {
        const sendClickAudo = new Audio("./sendComment.wav");
        sendClickAudo.play();
        const id = e.target.closest(`.container`).classList[4];
        const replyBox = document.querySelector(`.reply-comment-${id}`);
        this._newContent = replyBox.querySelector("textarea").value;

        const parent = document.querySelector(`.${id}`);

        handler(this._newContent, parent);

        replyBox.querySelector("textarea").value = `${replyBox
          .querySelector("textarea")
          .textContent.trim(" ")}`;
        replyBox.classList.add("hidden");
        replyBox.classList.add("hidden_div");
      }
    });
  }

  addHandlerRenderUpdateReply(handler) {
    this._parentElement.addEventListener("click", function (e) {
      if (e.target.classList.contains("update-link")) {
        const id = e.target.closest(`.container`).classList[4];
        const replyBox = document.querySelector(`.reply-comment-${id}`);

        this._newContent = replyBox.querySelector("textarea").value;

        const arrIndex = +id.slice(3);
        const parent = document.querySelector(`.${id}`);
        handler(this._newContent, arrIndex);
        parent.querySelector(".comments").firstElementChild.innerHTML =
          this._newContent;
        replyBox.querySelector("textarea").value = this._newContent.trim(" ");

        replyBox.classList.add("hidden_div");
        setTimeout(function () {
          replyBox.classList.add("hidden");
        }, 200);
      }
    });
  }

  addHandlerRenderSendCommentBox(handler) {
    this._bodyElement.addEventListener("click", function (e) {
      e.preventDefault();

      if (e.target.classList.contains("send-comment-link")) {
        const sendClickAudo = new Audio("./sendComment.wav");
        sendClickAudo.play();
        const textarea = document.querySelector(".input-textarea");

        this._newContent = textarea.value.trim(" ");
        handler(this._newContent);
        textarea.value = "";
      }
    });
  }

  addHandlerDeleteComment(handler) {
    this._bodyElement.addEventListener("click", function (e) {
      if (e.target.classList.contains("btn--primary")) {
        const deleteClickAudo = new Audio("./deleteClick.wav");
        deleteClickAudo.play();
        const id = e.target.classList[1].slice(3);
        handler(+id);
      }
    });
  }

  showDeleteCommentModal() {
    this._parentElement.addEventListener("click", function (e) {
      if (e.target.classList.contains("delete-text")) {
        const id = e.target.closest(`.container`).classList[2];
        document.querySelector("body").insertAdjacentHTML(
          "beforeend",
          `
            <div class="modal hidden_div">
              <div class="modal--container">
                <h1>Delete comment</h1>
                <p>
                  Are you sure you want to delete this comment? This will remove the
                  comment and can't be undone.
                </p>
                <div class="modal--buttons">
                  <button class="btn--secondary">NO, CANCEL</button>
                  <button class="btn--primary ${id}">YES,DELETE</button>
                </div>
              </div>
            </div>
    `
        );
        setTimeout(function () {
          document.querySelector(".modal").classList.remove("hidden_div");
        }, 100);
      }
      // document.querySelector(".modal").classList.add("hidden_div");
      // document.querySelector(".modal").classList.remove("hidden_div");
    });
  }
  hideDeleteCommentModal() {
    this._bodyElement.addEventListener("click", function (e) {
      if (
        e.target.classList.contains("btn--secondary") ||
        e.target.classList.contains("modal")
      ) {
        document.querySelector(".modal").classList.add("hidden_div");
        setTimeout(function () {
          document.querySelector(".modal").remove();
        }, 500);
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = "";
    document.querySelector(".modal")?.remove();
    document.querySelector(".send-comment")?.remove();
  }
}

export default new CommentView();
