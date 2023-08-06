class APIFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    filter() {
      const queryObj = { ...this.queryString };
      const excludedFields = ["page", "sort", "limit", "fields"];
      excludedFields.forEach(el => delete queryObj[el]);
  
      // adding query filters, with special mongoose methods (helps with quick test data)
      // const tours = await Tour.find()
      //   .where("duration")
      //   .equals(5)
      //   .where("difficulty")
      //   .equals("easy");
  
      // 1B) ADVANCED FILTERING
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); // regular expression, to match the exact words
  
      this.query = this.query.find(JSON.parse(queryStr));
      // used so we can chain the methods (this is the entire object)
      // instead of returning nothing, we return the entire object again
      return this;
    }
  
    sort() {
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(",").join(" ");
        this.query = this.query.sort(sortBy);
      } else {
        // a default query, in case user doesn't add any
        this.query = this.query.sort("-createdAt");
      }
  
      return this;
    }
  
    limitFields() {
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(",").join(" ");
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select("-__v"); // with - we exclude this field
      }
  
      return this;
    }
  
    paginate() {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;
  
      // ex: page=3&limit=10  pg1: 1-10, pg2: 11-20
      // if user wants page 3, we need to skip first page(20 results)
      this.query = this.query.skip(skip).limit(limit);
  
      return this;
    }
  }
  
  module.exports = APIFeatures;
  