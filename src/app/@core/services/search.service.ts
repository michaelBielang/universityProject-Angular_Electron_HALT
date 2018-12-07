/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import {Injectable} from '@angular/core';

interface SearchObj {
  gender;
  id;
  name;
  email;
  faculty;
  subjectordegree;
}

@Injectable()
export class SearchService {
  searchHistory: SearchObj[] = [];
  searchObj: SearchObj = {
    gender: 0,
    id: '',
    name: '',
    email: '',
    faculty: '',
    subjectordegree: ''
  };

  constructor() {
  }

  updateSearchObj(obj: SearchObj) {
    this.searchObj = obj;
  }

  updateSearchHistory(histObjs: SearchObj[]) {
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
              {studysubjectname: 'Wirtschaftsinformatik (Bachelor)'},
              {studysubjectname: 'Informatik (Bachelor)'},
              {studysubjectname: 'Informatik (Master)'},
              {studysubjectname: 'Interaktive Medien (Bachelor)'},
              {studysubjectname: 'Interaktive Medien Systeme (Master)'},
            ]
          },
          {
            facultyname: 'Wirtschaft',
            studysubjectObjs: [
              {studysubjectname: 'Wirtschaftswissenschaften (Bachelor)'},
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
        // return mock data
        resolve([
          {
            gender: 1,
            firstname: 'Max',
            lastname: 'Mustermann',
            emails: ['max.mustermann@hs-augsburg.de', 'max23@rz.fh-augsburg.de'],
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
            emails: ['maria.mustermann@hs-augsburg.de'],
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
            emails: ['anna.mueller@hs-augsburg.de'],
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
