// Shared query helper for pagination, filtering, sorting and search across
// list endpoints, so controllers stay thin and behave consistently.
export default class ApiFeatures {
  constructor(query, queryString) {
    this.query = query
    this.queryString = queryString
  }

  filter() {
    const excluded = ['page', 'sort', 'limit', 'fields', 'search']
    const queryObj = { ...this.queryString }
    excluded.forEach((field) => delete queryObj[field])

    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    this.query = this.query.find(JSON.parse(queryStr))
    return this
  }

  search(fields = []) {
    if (this.queryString.search && fields.length) {
      const regex = new RegExp(this.queryString.search, 'i')
      this.query = this.query.find({ $or: fields.map((f) => ({ [f]: regex })) })
    }
    return this
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort('-createdAt')
    }
    return this
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ')
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select('-__v')
    }
    return this
  }

  paginate() {
    const page = Math.max(parseInt(this.queryString.page, 10) || 1, 1)
    const limit = Math.min(parseInt(this.queryString.limit, 10) || 20, 100)
    const skip = (page - 1) * limit
    this.query = this.query.skip(skip).limit(limit)
    this.pagination = { page, limit }
    return this
  }
}
