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
  const detailElement = document.querySelector('#detail');

  const titleElement = document.createElement('p');
  titleElement.innerHTML = book.title;
  detailElement.append(titleElement);

  const messageElement = document.createElement('p');
  messageElement.innerHTML = book.message;
  detailElement.append(messageElement);

  const authorElement = document.createElement('p');
  authorElement.innerHTML = book.author;
  detailElement.append(authorElement);

  const urlElement = document.createElement('p');
  urlElement.innerHTML = book.url;
  detailElement.append(urlElement);

  const createdAtElement = document.createElement('p');
  createdAtElement.innerHTML = book.createdAt;
  detailElement.append(createdAtElement);

  const deleteButtonElement = document.createElement('button');
  deleteButtonElement.innerHTML = 'delete';
  deleteButtonElement.addEventListener('click', async () => {
    try {
      await deleteBook(book.bookId);
      location.href = '/';
    } catch (error) {
      console.log(error);
    }
  });
  detailElement.append(deleteButtonElement);

  const editButtonElement = document.createElement('button');
  editButtonElement.innerHTML = 'edit';
  editButtonElement.addEventListener('click', () => {
    location.href = `/edit?id=${book.bookId}`;
  });
  detailElement.append(editButtonElement);
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
    location.href = '/login';
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
