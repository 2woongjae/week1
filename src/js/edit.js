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

function getBook(bookId) {
  const token = getToken();
  if (token === null) {
    location.href = '/login';
    return;
  }
  return new Promise(resolve => {
    axios
      .get(`https://api.marktube.tv/v1/book/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(error => {
        console.log('getBook error', error);
        resolve(null);
      });
  });
}

function deleteBook(bookId) {
  const token = getToken();
  if (token === null) {
    location.href = '/login';
    return;
  }
  return axios.delete(`https://api.marktube.tv/v1/book/${bookId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function updateBook(bookId) {
  const titleElement = document.querySelector('#title');
  const messageElement = document.querySelector('#message');
  const authorElement = document.querySelector('#author');
  const urlElement = document.querySelector('#url');

  const title = titleElement.value;
  const message = messageElement.value;
  const author = authorElement.value;
  const url = urlElement.value;

  const token = getToken();
  if (token === null) {
    location = '/login';
    return resolve();
  }

  return axios.patch(
    `https://api.marktube.tv/v1/book/${bookId}`,
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
  );
}

function bindLogoutButton() {
  const btnLogout = document.querySelector('#btn_logout');
  btnLogout.addEventListener('click', logout);
}

function bindAddButton() {
  const btnAdd = document.querySelector('#btn_add');
  btnAdd.addEventListener('click', () => {
    location.href = '/add';
  });
}

function bindListButton() {
  const btnList = document.querySelector('#btn_list');
  btnList.addEventListener('click', () => {
    location.href = '/';
  });
}

function render(book) {
  const titleElement = document.querySelector('#title');
  titleElement.value = book.title;

  const messageElement = document.querySelector('#message');
  messageElement.value = book.message;

  const authorElement = document.querySelector('#author');
  authorElement.value = book.author;

  const urlElement = document.querySelector('#url');
  urlElement.value = book.url;

  const saveButtonElement = document.querySelector('#btn_save');
  saveButtonElement.addEventListener('click', () => {
    updateBook(book.bookId).then(() => {
      location.href = `book?id=${book.bookId}`;
    });
  });

  const cancelButtonElement = document.querySelector('#btn_cancel');
  cancelButtonElement.addEventListener('click', () => {
    location.href = `book?id=${book.bookId}`;
  });
}

async function main() {
  // 버튼에 이벤트 연결
  bindAddButton();
  bindListButton();
  bindLogoutButton();

  // 브라우저에서 id 가져오기
  const bookId = new URL(location.href).searchParams.get('id');

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
    location = '/login';
    return;
  }

  // 책을 서버에서 받아오기
  const book = await getBook(bookId);
  if (book === null) {
    alert('서버에서 책 가져오기 실패');
    return;
  }

  // 받아온 책을 그리기
  render(book);
}

document.addEventListener('DOMContentLoaded', main);
