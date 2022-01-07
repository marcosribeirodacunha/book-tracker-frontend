import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal'
import { format } from 'date-fns';

import { useBooks } from 'hooks/useBooks';
import { api } from 'services/apiClient';
import { Book } from 'shared/types/Book';

import { Button } from 'components/Button';

import modalStyles from 'styles/modal.module.scss';
import { RateRadio } from 'components/RateRadio';

interface RateBookModalProps {
  isOpen: boolean;
  bookIndex: number;
  onRequestClose: () => void;
}

interface IFormData {
  rate: string;
}

ReactModal.setAppElement("#__next")

export function RateBookModal({ isOpen, bookIndex, onRequestClose }: RateBookModalProps) {
  const { books, updateBook } = useBooks();
  const book = books[bookIndex] as Book | undefined;

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isSubmitSuccessful }
  } = useForm<IFormData>()

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      onRequestClose()
    }
  }, [isSubmitSuccessful, onRequestClose, reset])

  const onSubmit = handleSubmit(async ({ rate }) => {
    if (!book) return;
    const isEdit = !!book.finishedAt;

    if (isEdit && !rate) return

    // If the user already finished the book (status === 'read')
    // then we need to updated the data instead of change status
    const baseUrl = `/books/${book.id}`;
    const url = baseUrl + (isEdit ? '' : '/status')

    const data = { rate: Number(rate) };
    const res = await api.patch<Book>(url, data);
    const { finishedAt, ...rest } = res.data;
    updateBook(bookIndex, {
      ...rest,
      finishedAt: finishedAt ? format(new Date(finishedAt), 'P p') : null,
    });
  })

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="ReactModal__Overlay"
      className={modalStyles.modal}
    >
      <h2>Would you like to rate the book you finished to read?</h2>

      <form onSubmit={onSubmit}>
        <RateRadio label='Rate' {...register('rate')} />

        <div className={modalStyles.actions}>
          <Button
            variant='secondary'
            disabled={isSubmitting}
            onClick={onRequestClose}
          >
            Cancel
          </Button>

          <Button
            variant='secondary'
            disabled={isSubmitting}
            onClick={() => reset()}
          >
            Clear
          </Button>

          <Button
            type="submit"
            isLoading={isSubmitting}
          >
            Finish
          </Button>
        </div>
      </form>
    </ReactModal>
  );
}