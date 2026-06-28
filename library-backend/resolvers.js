const Author = require('./models/Author')
const Book = require('./models/Book')

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const filter = {}

      if (args.genre) {
        filter.genres = { $in: [args.genre] }
      }

      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) {
          return []
        }
        filter.author = author._id
      }

      return Book.find(filter).populate('author')
    },
    allAuthors: async () => Author.find({}),
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author })

      if (!author) {
        author = await new Author({ name: args.author }).save()
      }

      const book = await new Book({
        title: args.title,
        published: args.published,
        genres: args.genres,
        author: author._id,
      }).save()

      return book.populate('author')
    },
    editAuthor: async (root, args) => {
      return Author.findOneAndUpdate(
        { name: args.name },
        { born: args.setBornTo },
        { new: true },
      )
    },
  },
  Author: {
    bookCount: async (root) => Book.collection.countDocuments({ author: root._id }),
  },
}

module.exports = resolvers