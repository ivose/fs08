import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import AuthorForm from './components/AuthorForm'
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'
import { ME } from './queries'
import { useApolloClient, useQuery } from '@apollo/client/react'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('phonebook-user-token'))
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ME, { skip: !token })
  const client = useApolloClient()

  if (token && result.loading && !result.data) {
    return <div>loading...</div>
  }

  const favoriteGenre = result.data?.me?.favoriteGenre

  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm
          setToken={setToken}
          setError={notify}
        />
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('recommend')}>recommend</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={onLogout}>logout</button>
      </div>

      <Authors show={page === 'authors'} />
      <Books
        show={page === 'books' || page === 'recommend'}
        recommend={page === 'recommend'}
        favoriteGenre={favoriteGenre}
      />

      <NewBook show={page === 'add'} />

      <br/>
      <AuthorForm show={page === 'authors'} />
    </div>
  )
}

export default App
