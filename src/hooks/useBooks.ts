import { BooksContext } from "pages/books";
import { useContext } from "react";

export function useBooks() {
  const context = useContext(BooksContext);
  if (!context) throw new Error('useBooks must be used within an BookProvider');

  return context;
}