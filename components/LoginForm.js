export default function LoginForm() {
  return `
    <div class="qcw-login-form">
      <div class="qcw-login-form__field">
        <label>User ID</label>
        <input type="text" name="user_id" id="userId_txt" value="fikri@qiscus.com">
      </div>
      <div class="qcw-login-form__field">
        <label>Display Name</label>
        <input type="text" name="display_name" id="displayName_txt" value="Fikri">
      </div>
      <div class="qcw-login-form__field">
        <label>Password</label>
        <input type="password" name="password" id="password_txt" value="password">
      </div>
      <button>Login</button>
    </div>
  `;
}