export default function ChatWidget() {
  return `
    <div class="qcw-container">
      <div class="qcw-header">
        <img src="" /><div class="qcw-header__room-name"></div>
      </div>
      <ul class="qcw-comments"></ul>
      <div class="qcw-comment-form">
        <textarea></textarea>
        <i class="material-icons send-btn">send</i>
      </div>
    </div>
  `;
}