import { Book } from 'shared/types/Book';

import { Tag } from 'components/Tag';

import styles from './styles.module.scss';
import { BookActions } from './bookActions';

interface IBookCardProps {
  index: number;
  book: Book;
}
type Color = 'yellow' | 'blue' | 'green';

const tagMap: { [key in Book['status']]: [string, Color] } = {
  want_to_read: ['Want to read', 'yellow'],
  reading: ['Reading', 'blue'],
  read: ['Read', 'green'],
}

export function BookCard({ book, index }: IBookCardProps) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Tag color={tagMap[book.status][1]}>{tagMap[book.status][0]}</Tag>
      </header>

      <main>
        <h2>{book.title}</h2>
        <p className={styles.author}>{book.author}</p>
      </main>

      {book.rate && <span className={styles.rate}>{book.rate}</span>}

      <div className={styles.dates}>
        <p>Added at: <strong>{book.createdAt}</strong></p>
        {book.finishedAt && <p>Finished at: <strong>{book.finishedAt}</strong></p>}
      </div>

      <BookActions bookIndex={index} />
    </div>
  );
}
