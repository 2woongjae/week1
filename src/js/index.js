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
        return resolve(null);
      });
  });
}

function getBooks(token) {
  return new Promise(resolve => {
    axios
      .get('https://api.ts-korea.org/v1/book', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        return resolve(res.data);
      })
      .catch(error => {
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
      localStorage.clear();
      window.location.href = '/login';
    })
    .catch(error => {
      localStorage.clear();
      window.location.href = '/login';
    });
}

function deleteBook(bookId) {
  return new Promise((resolve, reject) => {
    const token = getToken();
    if (token === null) {
      location = '/login';
      return resolve();
    }
    axios
      .delete(`https://api.ts-korea.org/v1/book/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(data => {
        return resolve(true);
      })
      .catch(error => {
        return reject(error);
      });
  });
}

function bindProfileButton() {
  const btnProfile = document.querySelector('#btn_profile');
  btnProfile.addEventListener('click', () => {
    location = '/profile';
  });
}

function bindLogoutButton() {
  const btnLogout = document.querySelector('#btn_logout');
  btnLogout.addEventListener('click', logout);
}

function bindAddButton() {
  const btnAdd = document.querySelector('#btn_add');
  btnAdd.addEventListener('click', () => {
    location = '/add';
  });
}

function main() {
  bindLogoutButton();
  bindAddButton();
  bindProfileButton();

  const token = getToken();

  if (token === null) {
    location = '/login';
    return;
  }

  getUserByToken(token)
    .then(user => {
      if (user === null) {
        location = '/login';
      }
      return getBooks(token);
    })
    .then(books => {
      if (books === null) {
        return;
      }
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
        deleteButtonElement.addEventListener('click', () => {
          deleteBook(book.bookId)
            .then(data => {
              location.reload();
            })
            .catch(error => {});
        });
        bookElement.append(deleteButtonElement);
        listElement.append(bookElement);
      }
    });
}

document.addEventListener('DOMContentLoaded', main);
