const DEFAULT_OPTIONS = {
    title: '欢迎回来',
    subtitle: '登录你的 Symphony Demo 账户',
    demoEmail: 'demo@symphony.local',
    demoPassword: 'symphony123'
};

function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setFieldError(field, message) {
    const input = field.querySelector('input');
    const error = field.querySelector('[data-error]');
    field.classList.toggle('is-invalid', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    error.textContent = message || '';
}

function validate(form) {
    const emailField = form.querySelector('[data-field="email"]');
    const passwordField = form.querySelector('[data-field="password"]');
    const email = form.elements.email.value.trim();
    const password = form.elements.password.value;
    let isValid = true;

    if (!email) {
        setFieldError(emailField, '请输入邮箱地址');
        isValid = false;
    } else if (!validEmail(email)) {
        setFieldError(emailField, '请输入有效的邮箱地址');
        isValid = false;
    } else {
        setFieldError(emailField, '');
    }

    if (!password) {
        setFieldError(passwordField, '请输入密码');
        isValid = false;
    } else if (password.length < 8) {
        setFieldError(passwordField, '密码至少需要 8 个字符');
        isValid = false;
    } else {
        setFieldError(passwordField, '');
    }

    return isValid;
}

function buildLoginMarkup(options) {
    return `
        <main class="login-shell">
            <section class="login-panel" aria-labelledby="login-title">
                <div class="login-mark" aria-hidden="true">S</div>
                <p class="login-eyebrow">SYMPHONY DEMO</p>
                <h1 id="login-title">${options.title}</h1>
                <p class="login-subtitle">${options.subtitle}</p>
                <form class="login-form" novalidate>
                    <div class="form-field" data-field="email">
                        <label for="login-email">邮箱地址</label>
                        <input id="login-email" name="email" type="email" autocomplete="email" placeholder="name@example.com" aria-describedby="email-error" required>
                        <p class="field-error" id="email-error" data-error role="alert"></p>
                    </div>
                    <div class="form-field" data-field="password">
                        <div class="field-label-row">
                            <label for="login-password">密码</label>
                            <button class="text-button" type="button" data-action="toggle-password" aria-controls="login-password" aria-pressed="false">显示密码</button>
                        </div>
                        <input id="login-password" name="password" type="password" autocomplete="current-password" placeholder="至少 8 个字符" aria-describedby="password-error" required minlength="8">
                        <p class="field-error" id="password-error" data-error role="alert"></p>
                    </div>
                    <div class="form-options">
                        <label class="remember-option"><input type="checkbox" name="remember"> <span>记住我</span></label>
                        <button class="text-button" type="button" data-action="forgot-password">忘记密码？</button>
                    </div>
                    <button class="submit-button" type="submit"><span data-submit-label>登录</span><span class="button-spinner" aria-hidden="true"></span></button>
                    <p class="form-status" data-status role="status" aria-live="polite"></p>
                </form>
                <p class="login-footer">还没有账户？ <button class="text-button" type="button" data-action="signup">创建账户</button></p>
            </section>
        </main>`;
}

/** Mounts the isolated mock login experience into a container. */
export function createLogin(container, customOptions = {}) {
    if (!(container instanceof HTMLElement)) {
        throw new TypeError('createLogin requires an HTMLElement container');
    }

    const options = { ...DEFAULT_OPTIONS, ...customOptions };
    container.innerHTML = buildLoginMarkup(options);
    const form = container.querySelector('.login-form');
    const status = container.querySelector('[data-status]');
    const submitButton = form.querySelector('.submit-button');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        status.className = 'form-status';
        status.textContent = '';
        if (!validate(form)) return;

        submitButton.disabled = true;
        submitButton.classList.add('is-loading');
        form.querySelector('[data-submit-label]').textContent = '验证中';

        window.setTimeout(() => {
            submitButton.disabled = false;
            submitButton.classList.remove('is-loading');
            form.querySelector('[data-submit-label]').textContent = '登录';
            status.className = 'form-status is-success';
            status.textContent = `登录成功，欢迎回来，${form.elements.email.value.trim()}！`;
        }, 650);
    });

    container.addEventListener('click', (event) => {
        const action = event.target.closest('[data-action]')?.dataset.action;
        if (!action) return;
        if (action === 'toggle-password') {
            const password = form.elements.password;
            const button = event.target.closest('[data-action]');
            const visible = password.type === 'text';
            password.type = visible ? 'password' : 'text';
            button.textContent = visible ? '显示密码' : '隐藏密码';
            button.setAttribute('aria-pressed', String(!visible));
        } else if (action === 'forgot-password' || action === 'signup') {
            status.className = 'form-status is-info';
            status.textContent = action === 'forgot-password' ? '找回密码功能暂未开放。' : '注册功能暂未开放。';
        }
    });

    return { form, destroy: () => { container.replaceChildren(); } };
}

