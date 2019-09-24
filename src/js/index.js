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

function getBooks(token) {
  return new Promise(resolve => {
    axios
      .get('https://api.marktube.tv/v1/book', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(error => {
        console.log(error);
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

function bindProfileButton() {
  const btnProfile = document.querySelector('#btn_profile');
  btnProfile.addEventListener('click', () => {
    location.href = '/profile';
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

function render(books) {
  const listElement = document.querySelector('#list');
  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    const bookElement = document.createElement('div');
    const titleElement = document.createElement('a');
    titleElement.innerHTML = book.title === '' ? '제목 없음' : book.title;
    titleElement.href = `/book?id=${book.bookId}`;
    bookElement.append(titleElement);
    const deleteButtonElement = document.createElement('button');
    deleteButtonElement.innerHTML = 'delete';
    deleteButtonElement.addEventListener('click', async () => {
      try {
        await deleteBook(book.bookId);
        location.reload();
      } catch (error) {
        console.log(error);
      }
    });
    bookElement.append(deleteButtonElement);
    listElement.append(bookElement);
  }
}

async function main() {
  // 버튼에 이벤트 연결
  bindLogoutButton();
  bindAddButton();
  bindProfileButton();

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

  // 나의 책을 서버에서 받아오기
  const books = await getBooks(token);
  if (books === null) {
    return;
  }

  // 받아온 책을 그리기
  render(books);
}

document.addEventListener('DOMContentLoaded', main);
