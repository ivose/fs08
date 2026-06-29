import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  if (!props.show) {
    return null
  }

  const [selectedGenre, setSelectedGenre] = useState('all')
  const recommendGenre = props.favoriteGenre
  const activeGenre = props.recommend
    ? recommendGenre
    : (selectedGenre === 'all' ? null : selectedGenre)

  const filteredResult = useQuery(ALL_BOOKS, {
    variables: { genre: activeGenre },
    skip: props.recommend && !recommendGenre,
  })
  const allBooksResult = useQuery(ALL_BOOKS)

  if (filteredResult.loading || allBooksResult.loading) {
    return <div>loading...</div>
  }

  if (props.recommend && !recommendGenre) {
    return <div>no favorite genre set</div>
  }

  const books = filteredResult.data.allBooks
  const allBooks = allBooksResult.data.allBooks
  const genres = [...new Set(allBooks.flatMap((book) => book.genres))]

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
          {books.map((a) => (
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
