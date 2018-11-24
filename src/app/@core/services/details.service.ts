/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { Injectable } from '@angular/core';


@Injectable()
export class DetailsService {
  detailObj;

  constructor() { }

  hasDetails() {
    return this.detailObj != undefined;
  }
}
