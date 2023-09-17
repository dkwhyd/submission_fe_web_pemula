document.addEventListener("DOMContentLoaded", function () {
  const inputBookTitle = document.querySelector("#inputBookTitle");
  const inputBookAuthor = document.querySelector("#inputBookAuthor");
  const inputBookYear = document.querySelector("#inputBookYear");
  const inputBookIsComplete = document.querySelector("#inputBookIsComplete");
  const statusBook = document.querySelector("#status");
  const incompleteBookshelfList = document.querySelector(
    "#incompleteBookshelfList"
  );
  const completeBookshelfList = document.querySelector(
    "#completeBookshelfList"
  );

  inputBookIsComplete.addEventListener("click", function () {
    changeStatusButton();
  });

  // Change button status
  function changeStatusButton() {
    if (inputBookIsComplete.checked) {
      statusBook.innerText = "Selesai dibaca";
    } else {
      statusBook.innerText = "Belum selesai dibaca";
    }
  }

  //create book
  function createBook(title, author, year, isComplete) {
    return {
      id: +new Date(),
      title,
      author,
      year,
      isComplete,
    };
  }

  // renderBook
  function renderBook(book, isComplete) {
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");
    bookItem.setAttribute("id", book.id);

    const bookTitle = document.createElement("h3");
    bookTitle.innerText = book.title;

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = `Penulis: ${book.author}`;

    const bookYear = document.createElement("p");
    bookYear.innerText = `Tahun: ${book.year}`;

    const bookAction = document.createElement("div");
    bookAction.classList.add("action");

    // completed or uncompleted button
    if (isComplete) {
      const unCompletedButton = document.createElement("button");
      unCompletedButton.classList.add("green");
      unCompletedButton.innerText = "Belum selesai di Baca";

      unCompletedButton.addEventListener("click", function () {
        markAsUncompleted(book.id);
      });

      bookAction.appendChild(unCompletedButton);
    } else {
      const completeButton = document.createElement("button");
      completeButton.classList.add("green");
      completeButton.innerText = "Selesai dibaca";

      completeButton.addEventListener("click", function () {
        markAsComplete(book.id);
      });

      bookAction.appendChild(completeButton);
    }

    // edit button
    const editButton = document.createElement("button");
    editButton.classList.add("yellow");
    editButton.innerText = "Edit";

    editButton.addEventListener("click", function () {
      editForm(book.id, isComplete);
    });
    bookAction.appendChild(editButton);

    // deleted button
    const deletedButton = document.createElement("button");
    deletedButton.classList.add("red");
    deletedButton.innerText = "Hapus";

    deletedButton.addEventListener("click", function () {
      deleteBook(book.id, isComplete);
    });

    bookAction.appendChild(deletedButton);
    bookItem.appendChild(bookTitle);
    bookItem.appendChild(bookAuthor);
    bookItem.appendChild(bookYear);
    bookItem.appendChild(bookAction);

    if (isComplete) {
      completeBookshelfList.appendChild(bookItem);
    } else {
      incompleteBookshelfList.appendChild(bookItem);
    }
  }

  //AddBook
  function addBook() {
    const title = inputBookTitle.value;
    const author = inputBookAuthor.value;
    const year = parseInt(inputBookYear.value);
    const isComplete = inputBookIsComplete.checked;

    if (title && author && year) {
      const book = createBook(title, author, year, isComplete);
      saveBook(book);
      renderBook(book, isComplete);
      clearInput();
    } else {
      alert("Mohon lengkapi data buku terlebih dahulu.");
    }
  }

  //Save to localStorage
  function saveBook(book) {
    const books = getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  //Get book from localStorage
  function getBooks() {
    const booksData = localStorage.getItem("books");
    if (booksData) {
      return JSON.parse(booksData);
    } else {
      return [];
    }
  }

  //deleteBook using Id
  function deleteBook(bookId, isComplete) {
    const books = getBooks();

    const confirmContainer = document.createElement("div");
    confirmContainer.classList.add("delConfirm");
    confirmContainer.innerHTML = "<h4>Yakin ingin menghapus?</h4>";

    const buttonAgree = document.createElement("button");
    buttonAgree.classList.add("green");
    buttonAgree.innerText = "Iya";

    const buttonDisagree = document.createElement("button");
    buttonDisagree.classList.add("red");
    buttonDisagree.innerText = "Tidak";

    confirmContainer.appendChild(buttonAgree);
    confirmContainer.appendChild(buttonDisagree);

    const bookTarget = document.getElementById(`${bookId}`);
    bookTarget.getElementsByClassName("action")[0].style.display = "none";
    bookTarget.appendChild(confirmContainer);

    buttonAgree.addEventListener("click", function () {
      const updatedBooks = books.filter((book) => book.id !== bookId);

      completeBookshelfList.innerHTML = "";
      incompleteBookshelfList.innerHTML = "";
      localStorage.setItem("books", JSON.stringify(updatedBooks));

      updatedBooks.forEach((book) => {
        renderBook(book, book.isComplete);
      });
    });

    buttonDisagree.addEventListener("click", function () {
      bookTarget.getElementsByClassName("action")[0].style.display = "inline";
      confirmContainer.remove();
    });
  }

  // markAsComplete Book
  function markAsComplete(bookId) {
    const books = getBooks();
    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex !== -1) {
      books[bookIndex].isComplete = true;
      localStorage.setItem("books", JSON.stringify(books));

      completeBookshelfList.innerHTML = "";
      incompleteBookshelfList.innerHTML = "";

      books.forEach((book) => {
        renderBook(book, book.isComplete);
      });
    }
  }

  // markAsUncompleted
  function markAsUncompleted(bookId) {
    const books = getBooks();
    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex !== -1) {
      books[bookIndex].isComplete = false;
      localStorage.setItem("books", JSON.stringify(books));

      completeBookshelfList.innerHTML = "";
      incompleteBookshelfList.innerHTML = "";

      books.forEach((book) => {
        renderBook(book, book.isComplete);
      });
    }
  }

  // ClearInput Form
  function clearInput() {
    inputBookTitle.value = "";
    inputBookAuthor.value = "";
    inputBookYear.value = "";
    inputBookIsComplete.checked = false;
    statusBook.innerText = "Belum selesai dibaca";
  }

  // Filtering Books by title
  function filterBooks(searchQuery) {
    const books = getBooks();
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(searchQuery)
    );

    completeBookshelfList.innerHTML = "";
    incompleteBookshelfList.innerHTML = "";

    filteredBooks.forEach((book) => {
      renderBook(book, book.isComplete);
    });
  }

  //HandlerSubmit for Form
  document.getElementById("inputBook").addEventListener("submit", function (e) {
    e.preventDefault();
    addBook();
  });

  //HandlerSubmit for Search
  document
    .getElementById("searchBook")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const searchQuery = document
        .getElementById("searchBookTitle")
        .value.toLowerCase();
      filterBooks(searchQuery);
    });

  // Edit books
  function editForm(bookId, isComplete) {
    const books = getBooks();
    const book = books.find((book) => book.id === bookId);

    if (!book) {
      return;
    }

    const editFormContainer = document.createElement("div");
    editFormContainer.classList.add("edit-form");
    editFormContainer.setAttribute("id", "inputBook");

    const editForm = document.createElement("form");
    editForm.innerHTML = `
        <div class="input">
          <label for="editTitle">Judul</label>
          <input id="editTitle" type="text" value="${book.title}" required>
        </div>
        <div class="input">
          <label for="editAuthor">Penulis</label>
          <input id="editAuthor" type="text" value="${book.author}" required>
        </div>
        <div class="input">
          <label for="editYear">Tahun</label>
          <input id="editYear" type="number" value="${book.year}" required>
        </div>
        <div class="input_inline">
          <label for="editIsComplete">Selesai dibaca</label>
          <input id="editIsComplete" type="checkbox" ${
            book.isComplete ? "checked" : ""
          }>
        </div>
        <button id="editBookSubmit" type="submit" class="green">Simpan</button>
        <button id="editBookCancel" class="red">Batal</button>

      `;

    editFormContainer.appendChild(editForm);

    if (isComplete) {
      document.getElementById(bookId).innerHTML = "";
      document.getElementById(bookId).appendChild(editFormContainer);
    } else {
      document.getElementById(bookId).innerHTML = "";
      document.getElementById(bookId).appendChild(editFormContainer);
    }
    editForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveEditedBook(bookId, isComplete);
      editFormContainer.remove();
    });

    document
      .querySelector("#editBookCancel")
      .addEventListener("click", function (e) {
        completeBookshelfList.innerHTML = "";
        incompleteBookshelfList.innerHTML = "";
        editFormContainer.remove();

        books.forEach((book) => {
          renderBook(book, book.isComplete);
        });
      });
  }

  // SaveEditedBook
  function saveEditedBook(bookId, isComplete) {
    const books = getBooks();
    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex !== -1) {
      const editedBook = {
        id: bookId,
        title: document.querySelector("#editTitle").value,
        author: document.querySelector("#editAuthor").value,
        year: parseInt(document.querySelector("#editYear").value),
        isComplete: document.querySelector("#editIsComplete").checked,
      };

      books[bookIndex] = editedBook;
      localStorage.setItem("books", JSON.stringify(books));

      completeBookshelfList.innerHTML = "";
      incompleteBookshelfList.innerHTML = "";

      books.forEach((book) => {
        renderBook(book, book.isComplete);
      });
    }
  }

  // Rendering Book
  const books = getBooks();
  books.forEach((book) => {
    renderBook(book, book.isComplete);
  });
});
