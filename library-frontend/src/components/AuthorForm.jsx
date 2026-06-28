import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { UPDATE_AUTHOR, ALL_AUTHORS } from '../queries'

const AuthorForm = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const authorsResult = useQuery(ALL_AUTHORS)
  
  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  const authors = authorsResult.data?.allAuthors ?? []

  useEffect(() => {
    if (!name && authors.length > 0) {
      setName(authors[0].name)
    }
  }, [authors, name])

  useEffect(() => {
    const selectedAuthor = authors.find((author) => author.name === name)
    setBorn(selectedAuthor?.born?.toString() ?? '')
  }, [authors, name])

  if (!props.show) {
    return null
  }

  if (authorsResult.loading) {
    return <div>loading...</div>
  }

  const submit = async (event) => {
    event.preventDefault()

    if (!name || !born) {
      return
    }

    await updateAuthor({
      variables: {
        name,
        setBornTo: Number(born),
      },
    })
  }
  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="name">name</label>
          <select
            id="name"
            value={name}
            onChange={({ target }) => setName(target.value)}
          >
            {authors.map((author) => (
              <option key={author.name} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="born">born</label>
          <input
            id="born"
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default AuthorForm
