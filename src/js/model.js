export const state = {
  comment: [],
  currentUser: {},
  id: 0,
};
export let indexParent;
export let indexReply;

export const loadComments = async function () {
  try {
    const res = await fetch("data.json");
    const data = await res.json();

    state.comment = data.comments.map((comment) => {
      return {
        id: comment.id,
        createdAt: comment.createdAt,
        content: comment.content,
        score: comment.score,
        userImg: comment.user.image.png,
        username: comment.user.username,
        replies: comment.replies,
      };
    });

    state.currentUser = {
      userImg: data.currentUser.image.png,
      username: data.currentUser.username,
    };
  } catch (err) {
    console.log(err);
  }
};

const getDate = function () {
  const now = new Date();
  const day = now.getDate() + 1;
  const month = now.getMonth();
  const year = now.getFullYear();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  return `Today ${hour}:${minutes}`;
};

const getId = function () {
  state.comment.forEach((comment, i) => {
    if (comment.id > state.id) {
      state.id = comment.id;
      comment.replies.forEach((reply) => {
        if (reply.id > state.id) {
          state.id = reply.id;
        }
      });
    }
  });
  state.id += 1;
};
export const uploadComment = function (newContent) {
  getId();
  state.comment.push({
    id: state.id,
    createdAt: getDate(),
    content: newContent,
    score: 0,
    userImg: state.currentUser.userImg,
    username: state.currentUser.username,
    replies: [],
  });
};

export const uploadReply = function (newContent, parentEl) {
  const parentId = +parentEl.classList[2].slice(3);

  getId();

  // let idi = state.comment.length + ;
  state.comment.forEach((comment, index) => {
    if (comment.id === parentId) indexParent = index;
    else
      comment.replies.forEach((reply, replyIndex) => {
        if (reply.id === parentId) {
          indexReply = replyIndex;
          indexParent = index;
        }
      });
  });

  if (!indexReply) {
    state.comment[indexParent].replies.push({
      id: state.id,
      createdAt: getDate(),
      content: newContent,
      score: 0,
      replyingTo: state.comment[indexParent].username,
      user: {
        image: {
          png: state.currentUser.userImg,
        },
        username: state.currentUser.username,
      },
      replies: [],
      // userImg: state.currentUser.userImg,
      // username: state.currentUser.username,
    });
  } else {
    state.comment[indexParent].replies[indexReply].replies.push({
      id: state.id,
      createdAt: getDate(),
      content: newContent,
      score: 0,
      replyingTo: state.comment[indexParent].replies[indexReply].username,
      user: {
        image: {
          png: state.currentUser.userImg,
        },
        username: state.currentUser.username,
      },
      replies: [],
      // userImg: state.currentUser.userImg,
      // username: state.currentUser.username,
    });
  }
};

//   state.comment[parentId].replies.push({
//     id: state.id,
//     createdAt: getDate(),
//     content: newContent,
//     score: 0,
//     replyingTo: state.comment[parentId].username,
//     userImg: state.currentUser.userImg,
//     username: state.currentUser.username,
//     // userImg: state.currentUser.userImg,
//     // username: state.currentUser.username,
//   });
// };

export const updateComment = function (newComment, id) {
  state.comment.forEach((comment, i) => {
    if (comment.id === id) {
      comment.content = newComment;
    } else
      comment.replies.forEach((reply) => {
        if (reply.id === id) {
          reply.content = newComment;
        }
      });
  });
};

export const deleteComment = function (commentId) {
  let deleteParentIndex;
  let deleteReplyIndex;

  state.comment.forEach((comment, index) => {
    if (comment.id === commentId) {
      deleteParentIndex = index;
    } else {
      comment.replies.forEach((reply, indexReply) => {
        if (reply.id === commentId) {
          deleteReplyIndex = indexReply;
          deleteParentIndex = index;
        }
      });
    }
  });

  if (deleteReplyIndex === undefined) {
    state.comment.splice(deleteParentIndex, 1);
  } else {
    state.comment[deleteParentIndex].replies.splice(deleteReplyIndex, 1);
  }
};
