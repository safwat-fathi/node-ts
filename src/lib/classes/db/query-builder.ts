class Query {
  constructor(
    public pagination?: any,
    public sort?: any,
    public filter?: any,
    public projection?: any
  ) {}
}

interface QueryBuilder {
  setPagination(pagination: any): QueryBuilder;
  setSort(sort: any): QueryBuilder;
  setFilter(filter: any): QueryBuilder;
  setProjection(projection: any): QueryBuilder;
  build(): Query;
}

/**
 * ! this implementation is not meeting with below cases
 * it should be able to build search queries
 * it should be able to build delete queries
 * it should be able to build update queries
 * it should be able to build create queries
 */

class ProductQueryBuilder implements QueryBuilder {
  private _query!: Query;

  constructor() {
    this.clear();
  }

  setFilter(filter: any): QueryBuilder {
    return this;
  }

  setPagination(pagination: any): QueryBuilder {
    return this;
  }

  setProjection(projection: any): QueryBuilder {
    return this;
  }

  setSort(sort: any): QueryBuilder {
    return this;
  }

  build(): Query {
    const query = this._query;
    this.clear();
    return query;
  }

  clear() {
    this._query = new Query();
  }
}
