import QiscusCore from 'qiscus-sdk-core';
const AppId = 'sdksample';
const $WidgetContainer = $('#qiscus-widget');
import LoginForm from './components/LoginForm';
import ChatWidget from './components/ChatWidget';
const qiscus = new QiscusCore();

$(function(){
  if(!qiscus.isLogin) {
    $WidgetContainer.html(LoginForm);
  } else {
    $WidgetContainer.html(ChatWidget)
  }

  // attach event handler for login form
  $('.qcw-login-form button').on('click', function(){
    const userId = $('#userId_txt').val();
    const displayName = $('#displayName_txt').val();
    const password = $('#password_txt').val();
    qiscus.init({
      AppId: AppId,
      options: {
        loginSuccessCallback,
        newMessagesCallback,
      }
    });
    qiscus.setUser(userId, password, displayName);
  })

  // attach event listener for submit form
  $('#qiscus-widget').on('click', '.send-btn', function(){
    let $CommentForm = $('.qcw-comment-form textarea');
    qiscus.sendComment(qiscus.selected.id, $CommentForm.val())
      .then(() => {
        $CommentForm.empty();
        renderCommentsList();
        setTimeout(() => scrollToBottom, 0);
      });
  })
});

function loginSuccessCallback() {
  $WidgetContainer.html(ChatWidget);
  qiscus.chatTarget('guest@qiscus.com').then(res => {
    renderChatWidget();
  });
}

function newMessagesCallback() {
  renderCommentsList();
}

function renderChatWidget() {
  // re render header
  $('.qcw-header__room-name').html(qiscus.selected.name);
  $('.qcw-header img').attr('src', qiscus.selected.avatar);
  // re render comments list
  renderCommentsList();
}

function renderCommentsList() {
  const $commentsList = $('ul.qcw-comments');
  $commentsList.empty();
  qiscus.selected.comments.map((comment, index) => {
    const commentBefore = index > 0 ? qiscus.selected.comments[index-1] : null;
    $commentsList.append(renderComment(comment, commentBefore));
  });
  setTimeout(scrollToBottom, 0);
}

function renderComment(comment, commentBefore) {
  const isMe = comment.username_real == qiscus.user_id;
  const isTop = commentBefore != null 
    ? comment.username_real !== commentBefore.username_real
    : true;
  let commentClass = `qcw-comment__message`;
  if(isMe) commentClass += ` qcw-comment__message--me`;
  if(isTop) commentClass += ` qcw-comment__message--top`;
  return `
    <li class="${commentClass}">
      <img src="${comment.avatar}" class="qcw-avatar" />
      <div class="qcw-comment__bubble">
        <strong>${comment.username_real}</strong>
        ${comment.message}
      </div>
      <div class="qcw-comment__meta">
        <div class="qcw-comment__meta-time">${comment.time}</div>
      </div>
    </li>
  `;
}

function scrollToBottom() {
  $('ul.qcw-comments').scrollTop(9999);
}