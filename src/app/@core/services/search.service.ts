/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http } from '@angular/http';
import api from '../models/api-base-info.model';
import ISearchObj from '../models/search-obj.model';

@Injectable()
export class SearchService {
  searchHistory: ISearchObj[] = [];
  searchObj: ISearchObj = {
    gender: 0,
    id: '',
    name: '',
    email: '',
    faculty: '',
    subjectordegree: ''
  };
  maxHistoryCount = 5;

  constructor(
    private readonly authService: AuthService,
    private readonly http: Http,
  ) { }

  updateSearchObj(obj: ISearchObj) {
    this.searchObj = obj;
  }

  updateSearchHistory(histObjs: ISearchObj[]) {
    this.searchHistory = [];
    let count = 0;
    for (let i = histObjs.length - 1; i >= 0; --i) {
      if (count++ >= this.maxHistoryCount) {
        break;
      }
      this.searchHistory.push(histObjs[i]);
    }
  }

  getFacultiesWithStudysubjects(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(api.faculty, {
        headers: api.headers,
        withCredentials: true,
      }).subscribe(res => {
        resolve(res.json()['facultyObjs']);
      }, err => {
        reject(err);
      });
    });
  }

  getSearchHistory(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(api.history + '/' + this.authService.getUserID(), {
        headers: api.headers,
        withCredentials: true,
      }).subscribe(res => {
        resolve(res.json()['historyObjs']);
      }, err => {
        reject(err);
      });
    });
  }

  searchRequest(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.searchObj['id'] || this.searchObj['name'] || this.searchObj['email']) {
        this.http.post(api.search + '/' + this.authService.getUserID(), this.searchObj, {
          headers: api.headers,
          withCredentials: true,
        }).subscribe(res => {
          resolve(res.json()['data']);
        }, err => {
          reject(err);
        });
      } else {
        reject('no search identifier input was given');
      }
    });
  }
}
