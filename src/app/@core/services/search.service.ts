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

  constructor(
    private readonly authService: AuthService,
    private readonly http: Http,
  ) { }

  updateSearchObj(obj: ISearchObj) {
    this.searchObj = obj;
  }

  updateSearchHistory(histObjs: ISearchObj[]) {
    this.searchHistory = histObjs;
  }

  getFacultiesWithStudysubjects(): Promise<any> {
    return new Promise((resolve, reject) => {
      // return mock data
      setTimeout(() => {
        resolve([
          {
            facultyname: 'Informatik',
            studysubjectObjs: [
              { studysubjectname: 'Wirtschaftsinformatik (Bachelor)' },
              { studysubjectname: 'Informatik (Bachelor)' },
              { studysubjectname: 'Informatik (Master)' },
              { studysubjectname: 'Interaktive Medien (Bachelor)' },
              { studysubjectname: 'Interaktive Medien Systeme (Master)' },
            ]
          },
          {
            facultyname: 'Wirtschaft',
            studysubjectObjs: [
              { studysubjectname: 'Wirtschaftswissenschaften (Bachelor)' },
            ]
          },
          {
            facultyname: 'Gestaltung',
            studysubjectObjs: []
          },
          {
            facultyname: 'Maschinenbau',
            studysubjectObjs: []
          },
          {
            facultyname: 'Architektur und Bau',
            studysubjectObjs: []
          },
          {
            facultyname: 'Elektrotechnik',
            studysubjectObjs: []
          }
        ]);

        reject(undefined);
      }, 250);
    });
  }

  getSearchHistory(): Promise<any> {
    return new Promise((resolve, reject) => {
      // return mock data
      setTimeout(() => {
        resolve([
          {
            gender: 0,
            id: '',
            name: 'Max Mustermann',
            email: '',
            faculty: '',
            subjectordegree: ''
          },
          {
            gender: 2,
            id: '',
            name: 'Mustermann Maria',
            email: '',
            faculty: '',
            subjectordegree: ''
          },
          {
            gender: 0,
            id: 'Anna',
            name: '',
            email: '',
            faculty: '',
            subjectordegree: ''
          },
          {
            gender: 0,
            id: '',
            name: '',
            email: 'anna.mueller@hs-augsburg.de',
            faculty: '',
            subjectordegree: ''
          },
        ]);
        reject(undefined);
      }, 250);
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
