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
        console.log(res);
        return resolve(true);
      })
      .catch(error => {
        console.log(error);
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
        console.log('error');
        return;
      }
      localStorage.setItem('token', token);
      location = '/';
    })
    .catch(error => {
      console.log(error.response);
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
