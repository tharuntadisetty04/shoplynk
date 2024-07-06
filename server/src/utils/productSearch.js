class ProductSearch {
    constructor(data, queryString) {
        this.data = data;
        this.queryString = queryString;
    }

    search() {
        const keyword = this.queryString.keyword ? {
            name: {
                $regex: this.queryString.keyword,
                $options: "i",
            }
        } : {}

        this.data = this.data.find({ ...keyword })
        return this;
    }

    filter() {
        const queryStringCopy = { ...this.queryString }

        const removeFields = ["keyword", "page", "limit"]
        removeFields.forEach((key) => delete queryStringCopy[key])

        let queryString = JSON.stringify(queryStringCopy)
        queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

        this.data = this.data.find(JSON.parse(queryString))

        return this;
    }

    pagination(resultPerPage) {
        const CurrentPage = Number(this.queryString.page) || 1;
        const skip = resultPerPage * (CurrentPage - 1);

        this.data = this.data.limit(resultPerPage).skip(skip);

        return this;
    }
}

export default ProductSearch;   