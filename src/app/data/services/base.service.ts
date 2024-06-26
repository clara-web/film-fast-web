import {ajax} from "rxjs/ajax";

export abstract class BaseService {
  protected requestApi(path: string) {
    return ajax({
      url: `https://api.themoviedb.org/3/${path}`,
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYzgyMWUxNzVjMDc2NDVhMTJkMDAzY2M4ZDQyZDQ1NCIsInN1YiI6IjVjNzUyZTUwYzNhMzY4NDg0NmQyZjNiMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._gwds5jGWvv1qm5Zolgq_nUbGrdjqrba1ETumUTdOnk',
      },
    });
  }

  protected parseImage(id: string, size: ImageSize) {
    if (id == null)
      return null;
    switch (size) {
      case ImageSize.SMALL:
        return `https://image.tmdb.org/t/p/w154${id}`
      case ImageSize.STANDARD:
        return `https://image.tmdb.org/t/p/w342${id}`
      case ImageSize.MEDIUM:
        return `https://image.tmdb.org/t/p/w500${id}`
      case ImageSize.LARGE:
        return `https://image.tmdb.org/t/p/w780${id}`
      case ImageSize.ORIGINAL:
        return `https://image.tmdb.org/t/p/original${id}`
    }
  }
}

export enum ImageSize {
  SMALL, MEDIUM, LARGE, STANDARD, ORIGINAL
}
