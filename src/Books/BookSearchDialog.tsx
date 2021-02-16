import React from 'react'
import { useState,useEffect } from 'react';
import {BookDescription} from './BookDescription'
import BookSearchItem from './BookSearchItem';

type BookSearchDialogProps = {
  maxResults: number;
  onBookAdd: (book: BookDescription) => void
}

function buildSearchUrl(title: string,author: string,maxResults: number): string {
  let url = "https://www.googleapis.com/books/v1/volumes?q=";
  const conditions: string[] = []
  if (title) {
    conditions.push(`intitle:${title}`);
  }
  if (author) {
    conditions.push(`inauthor:${author}`)
  }
  return url + conditions.join("+") + `&maxResults=${maxResults}`;
}

function extractBooks(json: any): BookDescription[] {
  const items: any[] = json.items;
  return items.map((item: any) => {
    const volumeInfo: any = item.volumeInfo;
    return {
      title: volumeInfo.title,
      author: volumeInfo.authours ? volumeInfo.authors.join(',') : "",
      thumbnail: volumeInfo.imageLinks ? volumeInfo.imageLinks.smallThumbnail : "",
    }
  })
}

const BookSearchDialog = (props: BookSearchDialogProps) => {
  const [books,setBooks] = useState([] as BookDescription[])
  const [title,setTitle] = useState('');
  const [author,setAuthor] = useState('')
  const [isSearching,setIsSearching] = useState(false)

  useEffect(() => {
    if (isSearching) {
      const url = buildSearchUrl(title,author,props.maxResults)
      fetch(url)
        .then((res) => {
          return res.json()
        })
        .then((json) => {
          return extractBooks(json)
        })
        .then((books) => {
          setBooks(books)
        })
        .catch((err) => {
          console.log(err)
        })
    }
    setIsSearching(false)
  },[isSearching])

  const handleTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }
  const handleAuthorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(e.target.value)
  }

  const handleSearchClick = () => {
    if (!title && !author) {
      alert("条件を記入してください");
      return
    }
    setIsSearching(true)
  }

  const handleBookAdd = (book: BookDescription) => {
    props.onBookAdd(book)
  }

  const bookItems = books.map((b,index) => {
    return (
      <BookSearchItem
        description={b}
        onBookAdd={(b) => handleBookAdd(b)}
        key={index}
      />
    )
  })

  return (
    <div className="dialog">
      <div className="operation">
        <div className="conditions">
          <input 
            type="text"
            onChange={handleTitleInputChange}
            placeholder="タイトル検索"
          />
          <input 
            type="text"
            onChange={handleAuthorInputChange}
            placeholder="作者名検索"
          />
        </div>
        <div className="button-like" onClick={handleSearchClick}>検索</div>
      </div>
      <div className="search-results">{bookItems}</div>
    </div>
  )
} 

export default BookSearchDialog