/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { Injectable } from '@angular/core';


@Injectable()
export class ResultsService {
  resultObjs;

  constructor() { }

  hasResults() {
    return this.resultObjs != undefined && this.resultObjs.length;
  }
}
