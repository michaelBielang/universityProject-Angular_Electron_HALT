/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { Injectable } from '@angular/core';

interface SearchObj {
  server;
  gender;
  id;
  email;
  faculty;
  subjectordegree;
}

@Injectable()
export class SearchService {
  searchHistory: SearchObj[] = [];
  searchObj: SearchObj = {
    server: '',
    gender: 0,
    id: '',
    email: '',
    faculty: '',
    subjectordegree: ''
  };

  constructor() { }

  updateSearchObj(obj: SearchObj) {
    this.searchObj = obj;
  }

  updateSearchHistory(histObjs: SearchObj[]) {
    this.searchHistory = histObjs;
  }

  getServerGroups(): Promise<any> {
    return new Promise((resolve, reject) => {
      // return mock data
      setTimeout(() => {
        resolve([
          'HS-Augsburg',
          'UNI Augsburg',
          'HS München'
        ]);

        reject(undefined);
      }, 250);
    });
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
            studysubjectObjs: [
            ]
          },
          {
            facultyname: 'Maschinenbau',
            studysubjectObjs: [
            ]
          },
          {
            facultyname: 'Architektur und Bau',
            studysubjectObjs: [
            ]
          },
          {
            facultyname: 'Elektrotechnik',
            studysubjectObjs: [
            ]
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
            server: '',
            gender: 0,
            id: 'Max Mustermann',
            email: '',
            faculty: '',
            subjectordegree: ''
          },
          {
            server: '',
            gender: 2,
            id: 'Mustermann Maria',
            email: '',
            faculty: '',
            subjectordegree: ''
          },
          {
            server: '',
            gender: 0,
            id: 'Anna',
            email: '',
            faculty: '',
            subjectordegree: ''
          },
          {
            server: 'HS-Augsburg',
            gender: 0,
            id: '',
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
      if (this.searchObj['id'] || this.searchObj['email']) {
        // return mock data
        resolve([
          {
            gender: 1,
            firstname: 'Max',
            lastname: 'Mustermann',
            emails: [ 'max.mustermann@hs-augsburg.de', 'max23@rz.fh-augsburg.de' ],
            studysubject: 'Informatik',
            faculty: 'Informatik',
            degree: 'Bachelor',
            university: 'HS-Augsburg',
            identity: 'max23'
          },
          {
            gender: 2,
            firstname: 'Maria',
            lastname: 'Mustermann',
            emails: [ 'maria.mustermann@hs-augsburg.de' ],
            studysubject: 'Wirtschaftsinformatik',
            faculty: 'Informatik',
            degree: 'Bachelor',
            university: 'HS-Augsburg',
            identity: 'marmu'
          },
          {
            gender: 2,
            firstname: 'Anna',
            lastname: 'Müller',
            emails: [ 'anna.mueller@hs-augsburg.de' ],
            studysubject: 'Interaktive Medien',
            faculty: 'Informatik',
            degree: 'Bachelor',
            university: 'HS-Augsburg',
            identity: 'muell'
          },
        ]);
      } else {
        reject('no search id input was given');
      }
    });
  }
}
