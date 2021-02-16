import React from 'react';
import './App.css'
import {BookToRead} from './Books/BookToRead'
import BookRow from './Books/BookRow'
import { useState,useEffect } from 'react';
import Modal from 'react-modal'
import BookSearchDialog from './Books/BookSearchDialog';
import {BookDescription} from './Books/BookDescription'

Modal.setAppElement("#root")

const customStyle = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.8)"
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    padding: 0,
    transform: "translate(-50%, -50%)"
  }
}

const API_KEY = "apikey"

const App = () => {
  const [books,setBooks] = useState([] as BookToRead[]);
  const [modalIsOpen,setModalIsOpen] = useState(false)

  useEffect(() => {
    const storedBooks = localStorage.getItem(API_KEY);
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks))
    }
  },[])

  useEffect(() => {
    localStorage.setItem(API_KEY,JSON.stringify(books))
  },[books])

  const handleAddClick = () => {
    setModalIsOpen(true)
  }
  const handleCloseClick = () => {
    setModalIsOpen(false)
  }
  
  const handleBookDelete = (id: number) => {
    const newBooks = books.filter(t => t.id !== id)
    setBooks(newBooks)
  }

  const handleBookMemoChange = (id: number,memo: string) => {
    const newBooks = books.map(t => {
      return t.id === id
      ? {...t,memo: memo}
      : t
    })
    setBooks(newBooks)
  }

  const handleBookAdd = (book: BookDescription) => {
    const newBook: BookToRead = {...book,id: Date.now(),memo: ""}
    const newBooks = [...books,newBook];
    setBooks(newBooks);
    setModalIsOpen(false)
  }

  const bookRows = books.map(t => {
    return (
      <BookRow
        book={t}
        key={t.id}
        onDelete={(id) => handleBookDelete(id)}
        onMemoChange={(id,memo) => handleBookMemoChange(id,memo)}
      />
    )
  })
  return (
    <div className="A pp">
      <section className="nav">
        <div className="button-like" onClick={handleAddClick} >本を追加</div>
      </section>
      <section className="main">{bookRows}</section>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseClick}
        style={customStyle}
      >
        <BookSearchDialog maxResults={20} onBookAdd={(b) => handleBookAdd(b)} />
      </Modal>
    </div>
  );
}

export default App