"use strict";
import * as model from "./model.js";
import commentView from "./views/commentView.js";
import sendReplyCommentView from "./views/sendReplyCommentView.js";

const controlComments = async function () {
  try {
    // Load comments from API
    await model.loadComments();
    /// Render comments
    commentView.render(model.state.comment, model.state.currentUser);
    commentView.addHandlerRenderReplyBox();
    commentView.updateScore(model.state.currentUser);
    commentView.showDeleteCommentModal();
    commentView.hideDeleteCommentModal();
  } catch (err) {
    console.error(err);
  }
};

const controlAddComment = function (content) {
  model.uploadComment(content);
  commentView.renderNewComment(
    model.state.comment[model.state.comment.length - 1],
    model.state.currentUser
  );
};

const controlAddReply = function (content, parentEl) {
  model.uploadReply(content, parentEl);

  const parentId = +parentEl.classList[2].slice(3) - 1;
  if (!model.indexReply) {
    commentView.renderNewReply(
      model.state.comment[model.indexParent].replies[
        model.state.comment[model.indexParent].replies.length - 1
      ],
      model.state.currentUser,
      parentEl
    );
  } else {
    commentView.renderNewReply(
      model.state.comment[model.indexParent].replies[model.indexReply].replies[
        model.state.comment[model.indexParent].replies[model.indexReply].replies
          .length - 1
      ]
    );
  }
};

const controlUpdateComment = function (content, parentEl) {
  model.updateComment(content, parentEl);
};

const controlDeleteComment = function (commentId) {
  model.deleteComment(commentId);
  commentView.render(model.state.comment, model.state.currentUser);
};

const init = function () {
  // Ad handler Method PUBLISHER SUBSCRIBER METHOD
  commentView.addHandlerRenderComment(controlComments);
  commentView.addHandlerRenderSendReply(controlAddReply);
  commentView.addHandlerRenderUpdateReply(controlUpdateComment);
  commentView.addHandlerDeleteComment(controlDeleteComment);
  commentView.addHandlerRenderSendCommentBox(controlAddComment);
};
init();
