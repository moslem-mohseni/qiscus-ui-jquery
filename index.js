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
        /* 
          If you're confused with code style above, don't
          It's just ES6, in ES5 you wrote object like this obj = { a: a, b: b}
          in ES6 you can wrote obj = { a, b }
        */
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

  // add lightbox for images
  // $('.qcw-container').find('a.lightbox').colorbox();
  $('#qiscus-widget').on('click', '.lightbox', function() {
    console.log('clicked')
    $.colorbox({href:$(this).attr('href'), open:true});
    return false;
  });
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
  const isFile = comment.message.substring(0,6) == '[file]';
  let commentMessage = comment.message;
  if(isFile) {
    const messageURI =  comment.message.substring(6,comment.message.length-7).trim();
    const isImage    =  isFile && ['jpg','gif','jpeg','png'].includes(messageURI.split('.').pop().toLowerCase());
    commentMessage = `<a class="lightbox" href="${messageURI}"><img src="${messageURI}" class="qcw-image-attachment" /></a>`
  }
  // If it's not a file type, means that it's text type
  // let's check whether it's a reply
  if(comment.type == 'reply') {
    commentMessage = `<div class="qcw-reply-preview"><small>${comment.payload.replied_comment_sender_username}</small>${comment.payload.replied_comment_message}</div>${comment.payload.text}`;
  }
  let commentClass = `qcw-comment__message`;
  if(isMe) commentClass += ` qcw-comment__message--me`;
  if(isTop) commentClass += ` qcw-comment__message--top`;
  return `
    <li class="${commentClass}">
      <img src="${comment.avatar}" class="qcw-avatar" />
      <div class="qcw-comment__bubble">
        <strong>${comment.username_real}</strong>
        <div class="qcw-comment__text">${commentMessage}</div>
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