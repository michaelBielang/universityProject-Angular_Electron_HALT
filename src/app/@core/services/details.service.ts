/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { Injectable } from '@angular/core';


@Injectable()
export class DetailsService {
  detailsObj;

  constructor() { }

  hasDetails() {
    return this.detailsObj != undefined;
  }

  updateDetailsObj(obj) {
    this.detailsObj = obj;
  }
}
