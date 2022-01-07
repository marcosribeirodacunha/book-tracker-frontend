import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { format } from "date-fns";

import { useArray } from "hooks/useArray";
import { useToggle } from "hooks/useToggle";
import { setupAPIClient } from "services/api"
import { withSSRAuth } from "utils/withSSRAuth"
import { Book } from 'shared/types/Book';

import { Header } from "components/Header";
import { BookCard } from "components/BookCard";
import { Button } from "components/Button";
import { CreateBookModal } from "components/CreateBookModal";
import { RateBookModal } from "components/RateBookModal";

import styles from 'styles/books.module.scss'
import { EditBookModal } from "components/EditBookModal";

interface IBooksProps {
  books: Book[]
}

type ModalName = 'rate' | 'edit';

type BooksContextData = {
  books: Book[];
  addBook: (book: Book) => void;
  updateBook: (index: number, updated: Book) => void;
  removeBook: (index: number) => void;
  openModal: (modal: ModalName, bookIndex: number) => void;
}

export const BooksContext = createContext({} as BooksContextData)

export default function Books({ books: initialState }: IBooksProps) {
  const isInitialMount = useRef(true)

  const { array: books, prepend, update, remove, replace } = useArray(initialState)
  const [selectedBook, setSelectedBook] = useState(-1);
  const [bookStatus, setBookStatus] = useState('');

  const [isCreateModalOpen, toggleCreateModal] = useToggle()
  const [isRateModalOpen, toggleRateModal] = useToggle()
  const [isEditModalOpen, toggleEditModal] = useToggle()

  const handleOpenModal = useCallback((modal: ModalName, bookIndex: number) => {
    setSelectedBook(bookIndex)
    modal === 'rate' ? toggleRateModal() : toggleEditModal();
  }, [toggleEditModal, toggleRateModal])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    async function loadBooks() {
      const api = setupAPIClient()
      const res = await api.get<Book[]>(`/books?status=${bookStatus}`);

      const books = res.data.map(({ finishedAt, createdAt, ...rest }) => ({
        ...rest,
        finishedAt: finishedAt ? format(new Date(finishedAt), 'P p') : null,
        createdAt: format(new Date(createdAt), 'P p'),
      }))

      replace(books)
    }
    loadBooks()
  }, [bookStatus, replace])

  return (
    <>
      <Header />

      <BooksContext.Provider value={{
        books,
        addBook: prepend,
        updateBook: update,
        removeBook: remove,
        openModal: handleOpenModal
      }}>
        <section className={styles.header}>
          <h1>My books</h1>

          <div>
            <select className={styles.select} onChange={e => setBookStatus(e.target.value)}>
              <option value="">Status</option>
              <option value="want_to_read">Want to read</option>
              <option value="reading" selected>Reading</option>
              <option value="read">Read</option>
            </select>

            <Button onClick={toggleCreateModal}>Add book</Button>
          </div>
        </section>

        <section className={styles.booksContainer}>
          {books.map((book, index) => (
            <BookCard
              key={book.id}
              book={book}
              index={index}
            />
          ))}
        </section>

        <CreateBookModal
          isOpen={isCreateModalOpen}
          onRequestClose={toggleCreateModal}
        />

        <RateBookModal
          isOpen={isRateModalOpen}
          onRequestClose={toggleRateModal}
          bookIndex={selectedBook}
        />

        <EditBookModal
          isOpen={isEditModalOpen}
          onRequestClose={toggleEditModal}
          bookIndex={selectedBook}
        />
      </BooksContext.Provider>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const api = setupAPIClient(ctx)
  const res = await api.get<Book[]>('/books');

  const books = res.data.map(({ finishedAt, createdAt, ...rest }) => ({
    ...rest,
    finishedAt: finishedAt ? format(new Date(finishedAt), 'P p') : null,
    createdAt: format(new Date(createdAt), 'P p'),
  }))

  return { props: { books } }
})

