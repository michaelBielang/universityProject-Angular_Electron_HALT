/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { Injectable } from '@angular/core';


@Injectable()
export class ResultsService {
  resultObjs = [];
  currentSearchObj;

  constructor() { }

  hasResults() {
    return this.resultObjs != undefined && this.resultObjs.length;
  }

  setResultsObjs(objs) {
    this.resultObjs = objs;
  }

  setCurrentSearchObj(obj) {
    this.currentSearchObj = obj;
  }
}
