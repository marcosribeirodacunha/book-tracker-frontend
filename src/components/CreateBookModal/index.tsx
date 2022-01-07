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

import modalStyles from 'styles/modal.module.scss';

interface ICreateBookModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

interface IFormData {
  title: string;
  author: string;
}

ReactModal.setAppElement("#__next")

export function CreateBookModal({ isOpen, onRequestClose }: ICreateBookModalProps) {
  const { addBook } = useBooks();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = useForm<IFormData>({ resolver: createBookResolver })

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      onRequestClose()
    }
  }, [isSubmitSuccessful, onRequestClose, reset])

  const onSubmit = handleSubmit(async (data) => {
    const res = await api.post<Book>('/books', data)
    const { finishedAt, createdAt, ...rest } = res.data;
    addBook({
      ...rest,
      finishedAt: finishedAt ? format(new Date(finishedAt), 'P p') : null,
      createdAt: format(new Date(createdAt), 'P p'),
    })
  })

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="ReactModal__Overlay"
      className={modalStyles.modal}
    >
      <h2>Add a new book</h2>

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