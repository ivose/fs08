import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  if (!props.show) {
    return null
  }

  const [selectedGenre, setSelectedGenre] = useState('all')
  const result = useQuery(ALL_BOOKS)

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks
  const genres = [...new Set(books.flatMap((book) => book.genres))]
  const recommendGenre = props.favoriteGenre
  const filteredBooks = 
    props.recommend
    ? books.filter((book) => book.genres.includes(recommendGenre))
    :
    (selectedGenre === 'all'
    ? books
    : books.filter((book) => book.genres.includes(selectedGenre)))

  return (
    <div>
      <h2>{props.recommend ? 'recommendations' : 'books'}</h2>
      <div>in genre: {props.recommend ? recommendGenre : selectedGenre}</div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!props.recommend && (
        <div>
          {genres.map((genre) => (
            <button key={genre} onClick={() => setSelectedGenre(genre)} type="button">
              {genre}
            </button>
          ))}
          <button onClick={() => setSelectedGenre('all')} type="button">
            all genres
          </button>
        </div>
      )}
    </div>
  )
}

export default Books
