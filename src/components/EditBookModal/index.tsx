import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal'
import { format } from 'date-fns';

import { useBooks } from 'hooks/useBooks';
import { createBookResolver } from 'resolvers/createBook';
import { api } from 'services/apiClient';
import { Book } from 'shared/types/Book';

import { Button } from 'components/Button';
import { Input } from 'components/Input';
import { RateRadio } from 'components/RateRadio';

import modalStyles from 'styles/modal.module.scss';

interface IEditBookModalProps {
  isOpen: boolean;
  bookIndex: number;
  onRequestClose: () => void;
}

interface IFormData {
  title: string;
  author: string;
  rate: string
}

ReactModal.setAppElement("#__next")

export function EditBookModal({ isOpen, bookIndex, onRequestClose }: IEditBookModalProps) {
  const { books, updateBook } = useBooks();
  const book = books[bookIndex] as Book | undefined;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = useForm<IFormData>({ resolver: createBookResolver })

  useEffect(() => {
    if (!book) return;

    reset({
      title: book.title,
      author: book.author,
      rate: book.rate?.toString()
    })
  }, [book, reset])

  const onSubmit = handleSubmit(async ({ rate, ...restForm }) => {
    if (!book) return;

    const data = { ...restForm, rate: Number(rate) };
    const res = await api.patch<Book>(`/books/${book.id}`, data)

    const { finishedAt, ...rest } = res.data;
    updateBook(bookIndex, {
      ...rest,
      finishedAt: finishedAt ? format(new Date(finishedAt), 'P p') : null,
    })
    onRequestClose()
  })

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="ReactModal__Overlay"
      className={modalStyles.modal}
    >
      <h2>Edit book</h2>

      <form onSubmit={onSubmit}>
        <Input
          label="Title"
          error={errors.title?.message}
          {...register('title')}
        />

        <Input
          label="Author"
          error={errors.author?.message}
          {...register('author')}
        />

        {book?.status === 'read' && (
          <RateRadio label='Rate' {...register('rate')} />
        )}

        <div className={modalStyles.actions}>
          <Button
            variant='secondary'
            disabled={isSubmitting}
            onClick={onRequestClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            Add book
          </Button>
        </div>
      </form>
    </ReactModal>
  );
}