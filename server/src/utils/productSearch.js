class ProductSearch {
    constructor(data, queryString) {
        this.data = data;
        this.queryString = queryString;
    }

    search() {
        const keyword = this.queryString.keyword
            ? {
                name: {
                    $regex: this.queryString.keyword,
                    $options: "i",
                },
            }
            : {};

        this.data = this.data.find({ ...keyword });

        return this;
    }

    filter() {
        const queryStringCopy = { ...this.queryString };

        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key) => delete queryStringCopy[key]);

        let queryObj = {};
        for (const key in queryStringCopy) {
            if (typeof queryStringCopy[key] === 'object') {
                for (const operator in queryStringCopy[key]) {
                    if (!queryObj[key]) queryObj[key] = {};
                    queryObj[key][`$${operator}`] = queryStringCopy[key][operator];
                }
            } else {
                queryObj[key] = queryStringCopy[key];
            }
        }

        this.data = this.data.find(queryObj);

        return this;
    }

    pagination(resultPerPage) {
        const CurrentPage = Number(this.queryString.page) || 1;
        const skip = resultPerPage * (CurrentPage - 1);

        this.data = this.data.limit(resultPerPage).skip(skip);

        return this;
    }

    async execute() {
        return await this.data;
    }
}

export default ProductSearch;
