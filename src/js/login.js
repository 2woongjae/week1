function getToken() {
  return localStorage.getItem('token');
}

function login() {
  const emailElement = document.querySelector('#email');
  const passwordElement = document.querySelector('#password');

  const email = emailElement.value;
  const password = passwordElement.value;

  axios
    .post('https://api.marktube.tv/v1/me', {
      email,
      password,
    })
    .then(res => {
      const { token } = res.data;
      if (token === undefined) {
        return;
      }
      localStorage.setItem('token', token);
      location.href = '/';
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

async function main() {
  // 버튼에 이벤트 연결
  bindLoginButton();

  // 토큰 체크
  const token = getToken();
  if (token !== null) {
    location.href = '/';
    return;
  }
}

document.addEventListener('DOMContentLoaded', main);
