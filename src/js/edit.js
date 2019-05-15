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

function getBook(bookId) {
  return new Promise(resolve => {
    const token = getToken();
    if (token === null) {
      location = '/login';
      return resolve(null);
    }
    axios
      .get(`https://api.ts-korea.org/v1/book/${bookId}`, {
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

function updateBook(bookId) {
  const titleElement = document.querySelector('#title');
  const messageElement = document.querySelector('#message');
  const authorElement = document.querySelector('#author');
  const urlElement = document.querySelector('#url');

  const title = titleElement.value;
  const message = messageElement.value;
  const author = authorElement.value;
  const url = urlElement.value;

  return new Promise((resolve, reject) => {
    const token = getToken();
    if (token === null) {
      location = '/login';
      return resolve();
    }
    axios
      .patch(
        `https://api.ts-korea.org/v1/book/${bookId}`,
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
        return resolve(true);
      })
      .catch(error => {
        return reject(error);
      });
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

function bindListButton() {
  const btnList = document.querySelector('#btn_list');
  btnList.addEventListener('click', () => {
    location = '/';
  });
}

function renderBook(book) {
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
      location = `book?id=${book.bookId}`;
    });
  });

  const cancelButtonElement = document.querySelector('#btn_cancel');
  cancelButtonElement.addEventListener('click', () => {
    location = `book?id=${book.bookId}`;
  });
}

function main() {
  bindAddButton();
  bindListButton();
  bindLogoutButton();

  const token = getToken();

  if (token === null) {
    location = '/login';
    return;
  }

  const bookId = new URL(location.href).searchParams.get('id');

  getUserByToken(token)
    .then(user => {
      if (user === null) {
        location = '/login';
      }
      return getBook(bookId);
    })
    .then(book => {
      renderBook(book);
    });
}

document.addEventListener('DOMContentLoaded', main);
