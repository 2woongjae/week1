function getToken() {
  return localStorage.getItem('token');
}

function getUserByToken(token) {
  return new Promise(resolve => {
    axios
      .get('https://api.ts-korea.org/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        return resolve(res.data);
      })
      .catch(error => {
        console.log(error);
        return resolve(null);
      });
  });
}

function logout() {
  const token = getToken();
  if (token === null) {
    location = '/login';
    return;
  }
  axios
    .delete('https://api.ts-korea.org/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(data => {
      console.log(data);
      localStorage.clear();
      window.location.href = '/login';
    })
    .catch(error => {
      console.log(error);
      localStorage.clear();
      window.location.href = '/login';
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
    location = '/login';
    return;
  }
  axios
    .post(
      'https://api.ts-korea.org/v1/book',
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
    .then(data => {
      console.log(data);
      window.location.href = '/';
    })
    .catch(error => {
      console.log(error);
    });
}

function bindLogoutButton() {
  const btnLogout = document.querySelector('#btn_logout');
  btnLogout.addEventListener('click', logout);
}

function bindMoveListButton() {
  const btnMoveList = document.querySelector('#btn_moveList');
  btnMoveList.addEventListener('click', () => {
    location = '/';
  });
}

function bindSaveButton() {
  const btnSave = document.querySelector('#btn_save');
  btnSave.addEventListener('click', save);
}

function main() {
  bindMoveListButton();
  bindLogoutButton();
  bindSaveButton();

  const token = getToken();

  if (token === null) {
    location = '/login';
    return;
  }

  getUserByToken(token).then(user => {
    if (user === null) {
      location = '/login';
    }
  });
}

document.addEventListener('DOMContentLoaded', main);
