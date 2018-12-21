/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

// @ts-ignore
import * as Fuse from 'fuse.js/dist/fuse.js';
import ISearchObj from '../models/search-obj.model';

class Fuzzy {
  private maxRows: number = 10;

  constructor() {
  }


  private fuseOptions() {
    return {
      includeScore: true,
      threshold: 1.0, // smaller would require better match, 1.0 would match everything
      location: 0,
      distance: 100,
      minMatchCharLength: 3,
      maxPatternLength: 25,
      keys: [
        // RZ-Kennung
        {name: 'uid', weight: 0.2}, // example: chris87
        // Email Addresses
        {name: 'mail', weight: 0.1}, // example: Christoph.Bichlmeier@HS-Augsburg.DE
        {name: 'mailLocalAddress', weight: 0.05}, // example: chris87@RZ.FH-Augsburg.DE, Christoph.Bichlmeier@FH-Augsburg.DE
        {name: 'mailRoutingAddress', weight: 0.03}, // example: chris87@RZ.FH-Augsburg.DE
        {name: 'eduPersonPrincipalName', weight: 0.05}, // example: chris87@hs-augsburg.de
        // Names
        {name: 'givenName', weight: 0.15}, // example: Christoph
        {name: 'sn', weight: 0.15}, // example: Christoph
        // Faculty
        {name: 'ou', weight: 0.1}, // example: Elektrotechnik
        // StudySubject
        {name: 'dfnEduPersonFieldOfStudyString', weight: 0.13}, // example: Applied Research (Master)
        // Gender
        {name: 'schacGender', weight: 0.04}, // example: 1   (1 = male, 2 = female)
      ],
    };
  }


  private fuseSearch(ldapArr, searchObj: ISearchObj): Promise<any> {
    return new Promise((resolve, reject) => {
      if (searchObj) {
        const fuse = new Fuse(ldapArr, this.fuseOptions());
        const results = [];
        const keys = Object.keys(searchObj);
        for (const key of keys) {
          if (searchObj[key]) {
            results.push(...fuse.search(searchObj[key]));
          }
        }
        resolve(results);
      } else {
        reject(new Error('No searchObj provided'));
      }
    });
  }


  fuzzySearch(ldapArr, searchObj): Promise<any> {
    return new Promise((resolve, reject) => {
      this.fuseSearch(ldapArr, searchObj).then(results => {
        const retResults = [];
        for (const res of results) {
          const item = res['item'];
          item['fusescores'] = [1 - res['score']];
          let containsItem = false;
          for (const retRes of retResults) {
            if (retRes['uid'] === item['uid']) {
              containsItem = true;
              retRes['fusescores'].push(1 - res['score']);
              break;
            }
          }
          if (!containsItem) {
            retResults.push(item);
          }
        }
        for (const retRes of retResults) {
          let scoreSum = 0;
          for (const score of retRes['fusescores']) {
            scoreSum += score;
          }
          retRes['avgscore'] = scoreSum / retRes['fusescores'].length;
        }
        resolve(retResults.sort((a, b) =>
          (a['avgscore'] > b['avgscore'] ? -1 : a['avgscore'] < b['avgscore'] ? 1 : 0)).slice(0, this.maxRows));
      }).catch(err => {
        reject(err);
      });
    });
  }
}


export default new Fuzzy();
