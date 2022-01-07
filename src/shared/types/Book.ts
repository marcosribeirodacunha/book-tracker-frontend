type Status = 'want_to_read' | 'reading' | 'read';

export type Book = {
  id: string;
  title: string;
  author: string;
  status: Status,
  finishedAt: string | null,
  createdAt: string,
  updatedAt: string,
  rate: number | null
}