export class ResultPage<T> {
  page: number;
  results: Array<T>;
  totalPages: number;
  totalResults: number;

  constructor(page: number, results: T[], totalPages: number, totalResults: number) {
    this.page = page;
    this.results = results;
    this.totalPages = totalPages;
    this.totalResults = totalResults;
  }
}
