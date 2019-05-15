function getToken() {
  return localStorage.getItem('token');
}

function getIsLogin() {
  return new Promise(resolve => {
    const token = getToken();
    if (token === null) {
      return resolve(false);
    }
    axios
      .get('https://api.ts-korea.org/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        return resolve(true);
      })
      .catch(error => {
        if (data) {
          const state = data.error;
          if (state === 'INVALID_TOKEN') {
            alert('토큰이 유효하지 않습니다.');
          }
        }
        return resolve(false);
      });
  });
}

function login() {
  const githubIdElement = document.querySelector('#githubId');
  const passwordElement = document.querySelector('#password');

  const githubId = githubIdElement.value;
  const password = passwordElement.value;

  axios
    .post('https://api.ts-korea.org/v1/me', {
      githubId,
      password,
    })
    .then(res => {
      const { token } = res.data;
      if (token === undefined) {
        return;
      }
      localStorage.setItem('token', token);
      location = '/';
    })
    .catch(error => {
      const data = error.response.data;
      if (data) {
        const state = data.error;
        if (state === 'USER_NOT_EXIST') {
          alert('사용자가 존재하지 않습니다.');
        } else if (state === 'PASSWORD_NOT_MATCH') {
          alert('비밀번호가 틀렸습니다.');
        }
      }
    });
}

function bindLoginButton() {
  const btnLogin = document.querySelector('#btn_login');
  btnLogin.addEventListener('click', login);
}

function main() {
  bindLoginButton();

  getIsLogin().then(isLogin => {
    if (isLogin) {
      location = '/';
    }
  });
}

document.addEventListener('DOMContentLoaded', main);
