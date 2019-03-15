/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import * as Fuse from 'fuse.js/dist/fuse.js';
import ISearchObj from '../models/search-obj.model';

import * as moment from 'moment';
import * as fs from 'fs';
import * as path from 'path';

class Fuzzy {
  private maxRows: number = 10;

  /**
   * To prepare all required settings for fuzzy search module
   * @returns {}
   */
  private fuseOptions() {
    return {
      includeScore: true,
      threshold: 1.0, // smaller would require better match, 1.0 would match everything
      location: 0,
      distance: 5000,
      minMatchCharLength: 25,
      maxPatternLength: 500,
      keys: [
        // RZ-Kennung
        { name: 'uid', weight: 0.2 }, // example: chris87
        // Email Addresses
        { name: 'mail', weight: 0.05 }, // example: Christoph.Bichlmeier@HS-Augsburg.DE
        { name: 'mailLocalAddress', weight: 0.01 }, // example: chris87@RZ.FH-Augsburg.DE, Christoph.Bichlmeier@FH-Augsburg.DE
        { name: 'mailRoutingAddress', weight: 0.01 }, // example: chris87@RZ.FH-Augsburg.DE
        { name: 'eduPersonPrincipalName', weight: 0.01 }, // example: chris87@hs-augsburg.de
        // Names
        // { name: 'givenName', weight: 0.09 }, // example: Christoph
        // { name: 'sn', weight: 0.615 }, // example: Bichlmeier
        { name: 'displayName', weight: 0.624 }, // example: Christoph Bichlmeier
        // Faculty
        { name: 'ou', weight: 0.005 }, // example: Elektrotechnik
        // StudySubject
        { name: 'dfnEduPersonFieldOfStudyString', weight: 0.005 }, // example: Applied Research (Master)
        // Gender
        { name: 'schacGender', weight: 0.005 }, // example: 1   (1 = male, 2 = female)
      ],
    };
  }

  /**
   * To calculate actual search result probabilities and simply appending them onto an unfiltered array
   * @param ldapArr
   * @param searchObj
   * @returns {Promise<any>}
   */
  private fuseSearch(ldapArr, searchObj: ISearchObj): Promise<any> {
    return new Promise((resolve, reject) => {
      if (searchObj) {
        // merge duplicates from ldapArr
        const distinctLdapArr = [];
        for (const entry of ldapArr) {
          let contains = false;
          for (const distEntry of distinctLdapArr) {
            if (entry['uid'] === distEntry['uid']) {
              contains = true;
              break;
            }
          }
          if (!contains) {
            distinctLdapArr.push(entry);
          }
        }
        // perform actual fuse.js search and weighting
        const fuse = new Fuse(distinctLdapArr, this.fuseOptions());
        const results = [];
        const keys = Object.keys(searchObj);
        for (const key of keys) {
          if (searchObj[key]) {
            if (key === 'name' && searchObj[key]) {
              const nameparts = searchObj[key].replace('.', ' ').split(' ');
              for (const name of nameparts) {
                results.push(...fuse.search(name));
              }
            } else {
              results.push(...fuse.search(searchObj[key]));
            }
          }
        }
        resolve(results);
      } else {
        reject(new Error('No searchObj provided'));
      }
    });
  }

  /**
   * Using fuseSearch function and filtering the returned array to get distinct results as well as an average search result score
   * @param ldapArr
   * @param searchObj
   * @returns {Promise<any>}
   */
  fuzzySearch(ldapArr, searchObj: ISearchObj): Promise<any> {
    Object.keys(searchObj).forEach(key => {
      searchObj[key] = String(searchObj[key]);
    });
    return new Promise((resolve, reject) => {
      this.fuseSearch(ldapArr, searchObj).then(results => {
        const retResults = [];
        for (const res of results) {
          const item = res['item'];

          let containsItem = false;
          for (const retRes of retResults) {
            if (retRes['uid'] === item['uid']) {
              containsItem = true;
              retRes['fusescores'].push(1 - res['score']);
              break;
            }
          }
          if (!containsItem) {
            item['fusescores'] = [1 - res['score']];
            retResults.push(item);
          }
        }
        for (const retRes of retResults) {
          let scoreSum = 0;
          for (const score of retRes['fusescores']) {
            if (retRes['highscore'] && retRes['highscore'] < score) {
              retRes['highscore'] = score;
            } else if (!retRes['highscore']) {
              retRes['highscore'] = score;
            }
            scoreSum += score;
          }
          retRes['avgscore'] = scoreSum / retRes['fusescores'].length;
        }

        const allSortedResults = retResults.sort((a, b) =>
          // (a['highscore'] > b['highscore'] ? -1 : a['highscore'] < b['highscore'] ? 1 : 0))
          (a['avgscore'] > b['avgscore'] ? -1 : a['avgscore'] < b['avgscore'] ? 1 : 0));

        this.dumpToFile(allSortedResults);
        resolve(allSortedResults.slice(0, this.maxRows));
      }).catch(err => {
        reject(err);
      });
    });
  }

  dumpToFile(results) {
    const timeStamp = moment().format("YYYY-MM-DD HH.MM.SS");
    if (results.length) {
      let fieldOfStudy = results[0]['dfnEduPersonFieldOfStudyString'];
      if (fieldOfStudy.indexOf("/") > -1) {
        fieldOfStudy = fieldOfStudy.split("(")[0].trim();
      }

      const fileName = path.join(__dirname, 'logging', fieldOfStudy + ' ' + timeStamp + '.txt');
      const filePath = path.dirname(fileName);
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
      }

      fs.writeFile(fileName, 'Name,Status,Email,Fakultaet,Studiengang,ShadowLastChange,SambaPwdLastSet\n', err => {
        if (err) console.error(err);
      });

      const dumper = fs.createWriteStream(fileName, {
        flags: 'a' // 'a' means appending (old data will be preserved)
      });

      setTimeout(() => {
        results.forEach(entry => {
          if (entry['cn'] && entry['eduPersonPrimaryAffiliation'] && entry['mail'] && entry['ou'] &&
            entry['dfnEduPersonFieldOfStudyString'] && entry['dfnEduPersonFieldOfStudyString'] &&
            entry['shadowLastChange'] && entry['sambaPwdLastSet']) {
            dumper.write(entry['cn'] + ',' + entry['eduPersonPrimaryAffiliation'] + ',' + entry['mail'] + ',' +
              entry['ou'] + ',' + entry['dfnEduPersonFieldOfStudyString'] + ',' +
              moment(parseInt(entry['shadowLastChange']) * 1000).format("YYYY-MM-DD") + ',' +
              moment(parseInt(entry['sambaPwdLastSet']) * 1000).format("YYYY-MM-DD") + '\n', err => {
                if (err) console.error(err);
              });
          }
        });
      }, 250);
    }
  }
}


export default new Fuzzy();
