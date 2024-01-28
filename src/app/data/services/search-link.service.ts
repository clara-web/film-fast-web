import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, map, catchError} from 'rxjs';
import {SearchResult} from 'app/data/models/search_result';
import {SearchResultItem} from 'app/data/models/search_result_item';

@Injectable({
  providedIn: 'root',
})
export class SearchLinkService {
  private baseUrl =
    'https://www.googleapis.com/customsearch/v1?key=AIzaSyDrQoYphLoyLUHL_7o9C2tV7f5Zhit0XkI&cx=77cb986d502384315';

  constructor(private http: HttpClient) {
  }

  search(q: string, cx: string): Observable<SearchResult> {
    let cacheKey = `${cx}_${q}`;
    return this.fromCache(cacheKey).pipe(
      catchError(() => {
          return this.http
            .get<SearchResult>(`${this.baseUrl}&cx=${cx}&q=${q}`)
            .pipe(map((e) => {
              const s = new SearchResult();
              s.items = [];
              if (e.items != undefined) {
                e.items.forEach(item => {
                  const searchResultItem = new SearchResultItem()
                  searchResultItem.title = item.title;
                  searchResultItem.link = item.link;
                  s.items.push(searchResultItem)
                })
              }
              s.totalResults = e["searchInformation"]["totalResults"]
              sessionStorage.setItem(cacheKey, JSON.stringify(s))
              return s
            }));
        }
      ));
  }

  private fromCache(cacheKey: string): Observable<SearchResult> {
    return new Observable<SearchResult>(subscriber => {
      let json = sessionStorage.getItem(cacheKey)
      if (json != null) {
        subscriber.next(JSON.parse(json))
      } else {
        subscriber.error()
      }
      subscriber.complete()
    })
  }
}
