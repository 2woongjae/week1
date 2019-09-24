function getToken() {
  return localStorage.getItem('token');
}

function getUserByToken(token) {
  return new Promise(resolve => {
    axios
      .get('https://api.marktube.tv/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(error => {
        console.log('getUserByToken error', error);
        resolve(null);
      });
  });
}

function logout() {
  const token = getToken();
  if (token === null) {
    location.href = '/login';
    return;
  }
  axios
    .delete('https://api.marktube.tv/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .catch(error => {
      console.log('logout error', error);
    })
    .finally(() => {
      localStorage.clear();
      location.href = '/login';
    });
}

function save() {
  const titleElement = document.querySelector('#title');
  const messageElement = document.querySelector('#message');
  const authorElement = document.querySelector('#message');
  const urlElement = document.querySelector('#message');

  const title = titleElement.value;
  const message = messageElement.value;
  const author = authorElement.value;
  const url = urlElement.value;

  const token = getToken();
  if (token === null) {
    location.href = '/login';
    return;
  }

  axios
    .post(
      'https://api.marktube.tv/v1/book',
      {
        title,
        message,
        author,
        url,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then(() => {
      location.href = '/';
    })
    .catch(error => {
      console.log('save error', error);
      alert('책 추가 실패');
    });
}

function bindLogoutButton() {
  const btnLogout = document.querySelector('#btn_logout');
  btnLogout.addEventListener('click', logout);
}

function bindMoveListButton() {
  const btnMoveList = document.querySelector('#btn_moveList');
  btnMoveList.addEventListener('click', () => {
    location.href = '/';
  });
}

function bindSaveButton() {
  const btnSave = document.querySelector('#btn_save');
  btnSave.addEventListener('click', save);
}

async function main() {
  // 버튼에 이벤트 연결
  bindMoveListButton();
  bindLogoutButton();
  bindSaveButton();

  // 토큰 체크
  const token = getToken();
  if (token === null) {
    location.href = '/login';
    return;
  }

  // 토큰으로 서버에서 나의 정보 받아오기
  const user = await getUserByToken(token);
  if (user === null) {
    localStorage.clear();
    location.href = '/login';
    return;
  }
}

document.addEventListener('DOMContentLoaded', main);
