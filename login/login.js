document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageEl = document.getElementById('message');

    messageEl.className = 'message';
    messageEl.style.display = 'none';

    if (!username || !password) {
        showMessage('请输入用户名和密码', 'error');
        return;
    }

    if (username === 'admin' && password === 'admin123') {
        showMessage('登录成功！', 'success');
        setTimeout(() => {
            console.log('Mock login successful for user:', username);
        }, 1000);
    } else {
        showMessage('用户名或密码错误', 'error');
    }
});

function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = 'message ' + type;
    messageEl.style.display = 'block';
}
