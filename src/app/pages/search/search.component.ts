/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { Component, OnInit } from '@angular/core';
import { TabSelectionService } from '../../@core/services/tab-selection.service';
import { FormControl, FormGroup } from '@angular/forms';
import { SearchCustomValidators, validationMessagesEN } from './search.validators';
import { MyErrorStateMatcher } from '../../@core/models/error-state-matcher.model';
import { NotificationService } from '../../@core/services/notification.service';
import { SearchService } from '../../@core/services/search.service';
import { ResultsService } from '../../@core/services/results.service';
import route from '../../@core/enums/route.enum';

@Component({
  selector: 'app-search',
  styleUrls: ['./search.component.scss'],
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  getFacultiesWithStudysubjects: any = [];
  faculties: any = [];
  filteredfaculties: any = [];
  studysubjects: any = [];
  filteredstudysubjects: any = [];
  readonly customValidators = new SearchCustomValidators();
  readonly errorMessages = validationMessagesEN();
  readonly matcher = new MyErrorStateMatcher();

  searchTimeout: any;
  facultyChangeTimeout: any;
  subjectChangeTimeout: any;

  constructor(
    private readonly tabSelectionService: TabSelectionService,
    private readonly notificationService: NotificationService,
    public readonly searchService: SearchService,
    private readonly resultsService: ResultsService,
  ) { }

  async ngOnInit() {
    this.initForm();
    this.tabSelectionService.loadingEvent.next(true);
    await this.searchService.getFacultiesWithStudysubjects()
      .then(result => {
        this.getFacultiesWithStudysubjects = result;
        this.faculties = [];
        this.studysubjects = [];
        result.forEach(entry => {
          this.faculties.push(entry['facultyname']);
          if (entry['studysubjectObjs'] && entry['studysubjectObjs'].length) {
            entry['studysubjectObjs'].forEach(subject => {
              this.studysubjects.push(subject['studysubjectname']);
            });
          }
        });
        this.filteredfaculties = this.faculties;
        this.filteredstudysubjects = this.studysubjects;
      }).catch(err => {
        this.errHandling(err);
      });
      await this.searchService.getSearchHistory()
      .then(result => {
        this.searchService.updateSearchHistory(result);
      }).catch(err => {
        this.errHandling(err);
      });
    this.tabSelectionService.loadingEvent.next(false);
  }

  initForm() {
    this.searchForm = new FormGroup({
      'gender': new FormControl(this.searchService.searchObj['gender'], []),
      'id': new FormControl(this.searchService.searchObj['id'], []),
      'name': new FormControl(this.searchService.searchObj['name'], []),
      'email': new FormControl(this.searchService.searchObj['email'], []),
      'faculty': new FormControl(this.searchService.searchObj['faculty'], []),
      'subjectordegree': new FormControl(this.searchService.searchObj['subjectordegree'], []),
    }, {
      validators: [
        this.customValidators.idOrEmailRequired.bind(this),
      ],
    });
  }

  onSearchBtnClick() {
    this.tabSelectionService.loadingEvent.next(true);
    this.searchService.updateSearchObj({
      gender: this.searchForm.get('gender')['value'],
      id: this.searchForm.get('id')['value'],
      name: this.searchForm.get('name')['value'],
      email: this.searchForm.get('email')['value'],
      faculty: this.searchForm.get('faculty')['value'],
      subjectordegree: this.searchForm.get('subjectordegree')['value']
    });

    this.searchService.searchRequest()
      .then(results => {
        this.resultsService.setResultsObjs(results);
        this.resultsService.setCurrentSearchObj(this.searchService.searchObj);
        if (this.searchTimeout) clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
          this.tabSelectionService.tabSwitchEvent.next(route.RESULTS);
          this.tabSelectionService.loadingEvent.next(false);
          this.notificationService.showNotification(
            'success',
            null,
            'search executed',
          );
        }, 250);
      }).catch(err => {
        this.errHandling(err);
      });
  }

  onFacultyChange() {
    if (this.facultyChangeTimeout) clearTimeout(this.facultyChangeTimeout);
    this.facultyChangeTimeout = setTimeout(() => {
      this.filteredfaculties = this.faculties.filter(fac => {
        return fac.indexOf(this.searchForm.get('faculty')['value']) !== -1;
      });
      this.studysubjects = [];
      this.getFacultiesWithStudysubjects.forEach(facStud => {
        const facIndex = this.filteredfaculties.indexOf(facStud['facultyname']);
        if (facIndex !== -1) {
          facStud['studysubjectObjs'].forEach(subj => {
            this.studysubjects.push(subj['studysubjectname']);
          });
        }
      });
      this.filteredstudysubjects = this.studysubjects;
    }, 20);
  }

  onSubjectChange() {
    if (this.subjectChangeTimeout) clearTimeout(this.subjectChangeTimeout);
    this.subjectChangeTimeout = setTimeout(() => {
      this.filteredstudysubjects = this.studysubjects.filter(sub => {
        return sub.indexOf(this.searchForm.get('subjectordegree')['value']) !== -1;
      });
    }, 20);
  }

  onHistoryClick(index) {
    const hist = this.searchService.searchHistory[index];
    this.searchService.updateSearchObj({
      gender: hist['gender'],
      id: hist['id'],
      name: hist['name'],
      email: hist['email'],
      faculty: hist['faculty'],
      subjectordegree: hist['subjectordegree']
    });
    this.initForm();
  }

  ObjKeys(input) {
    // Make Object.keys() available to DOM
    if (input && input !== 'undefined' && typeof input === 'object') {
      return Object.keys(input);
    }
    return undefined;
  }

  errHandling(err) {
    console.error(err['message']);
    this.notificationService.showNotification(
      'error',
      null,
      err['message'],
    );
    this.tabSelectionService.loadingEvent.next(false);
  }
}
