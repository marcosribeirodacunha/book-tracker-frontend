import { useState } from 'react';

import { Book } from 'shared/types/Book';

import { useBooks } from 'hooks/useBooks';
import { Button } from 'components/Button';

import styles from './styles.module.scss';
import { api } from 'services/apiClient';

interface IBookActionsProps {
  bookIndex: number
}

type Resource = 'start' | 'edit' | 'delete';
type Loading = { is: boolean, resource?: Resource }

const buttonStatusMap: { [key in Book['status']]?: string } = {
  want_to_read: 'Start',
  reading: 'Finish',
}

function sleep(ms = 3000) {
  return new Promise(res => setTimeout(res, 10000))
}

export function BookActions({ bookIndex }: IBookActionsProps) {
  const [loading, setLoading] = useState<Loading>({ is: false });

  const { books, updateBook, removeBook, openModal } = useBooks()
  const { id, status, rate } = books[bookIndex]

  async function loadWhile(resource: Resource, fn: () => Promise<void>) {
    setLoading({ is: true, resource })
    await fn()
    setLoading({ is: false })
  }

  function handleChangeBookStatus() {
    if (status !== 'want_to_read') {
      openModal('rate', bookIndex);
      return;
    }

    loadWhile('start', async () => {
      const res = await api.patch<Book>(`books/${id}/status`);
      updateBook(bookIndex, res.data)
    })
  }

  function handleDeleteBook() {
    loadWhile('delete', async () => {
      await api.delete(`books/${id}`);
      removeBook(bookIndex)
    })
  }

  function handleOpenEditModal() {
    openModal('edit', bookIndex);
  }

  return (
    <div className={styles.actions}>
      {status === 'read' && !rate && (
        <Button
          isLoading={loading.is && loading.resource === 'start'}
          disabled={loading.is && loading.resource !== 'start'}
          onClick={handleChangeBookStatus}
        >
          Rate
        </Button>
      )}

      {status !== 'read' && (
        <Button
          isLoading={loading.is && loading.resource === 'start'}
          disabled={loading.is && loading.resource !== 'start'}
          onClick={handleChangeBookStatus}
        >
          {buttonStatusMap[status]}
        </Button>
      )}

      <Button
        variant='secondary'
        isLoading={loading.is && loading.resource === 'edit'}
        disabled={loading.is && loading.resource !== 'edit'}
        onClick={handleOpenEditModal}
      >
        Edit
      </Button>

      <Button
        variant='danger'
        isLoading={loading.is && loading.resource === 'delete'}
        disabled={loading.is && loading.resource !== 'delete'}
        onClick={handleDeleteBook}
      >
        Delete
      </Button>
    </div>
  );
}
