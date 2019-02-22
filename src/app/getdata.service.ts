import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GetDataService {
  dataUrl = 'https://api.github.com/search/repositories?q=';
  constructor (private http: HttpClient) { }
  getData(keyWord) {
    return this.http.get(this.dataUrl + keyWord);
  }
}
