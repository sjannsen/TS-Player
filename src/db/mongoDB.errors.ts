class MongoDBError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MongoDBError'
  }
}

export { MongoDBError }
