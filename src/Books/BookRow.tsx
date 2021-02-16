import React from 'react'
import {BookToRead} from './BookToRead'

type Props = {
  book: BookToRead;
  onMemoChange: (id: number,memo: string) => void
  onDelete: (id: number) => void
}

const BookRow = (props: Props) => {
  const {title,author,memo} = props.book;

  const handleMemoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onMemoChange(props.book.id,e.target.value)
  };

  const handleDeleteClick = () => {
    props.onDelete(props.book.id)
  };

  return (
    <div className="book-row">
      <div className="title" title={title}>{title}</div>
      <div className="authors" title={author}>{author}</div>
      <input 
        type="text"
        className="memo"
        value={memo}
        onChange={handleMemoChange}
      />
      <div className="delete-row" onClick={handleDeleteClick}>削除</div>
    </div>
  )
}

export default BookRow