/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { Headers } from '@angular/http';

const jsonHeader = new Headers({
  'Content-Type': 'application/json'
});

const apiBaseUrl = 'http://localhost:8787';
const apiHealthCheckUrl = apiBaseUrl + '/api/healthcheck';
const apiUsersUrl = apiBaseUrl + '/api/users';
const apiAuthUrl = apiBaseUrl + '/api/auth';
const apiSearchUrl = apiBaseUrl + '/api/search';
const apiFacultyUrl = apiBaseUrl + '/api/faculties';
const apiHistoryUrl = apiBaseUrl + '/api/searchhistories';

export default {
  headers: jsonHeader,
  base: apiBaseUrl,
  healthcheck: apiHealthCheckUrl,
  users: apiUsersUrl,
  auth: apiAuthUrl,
  search: apiSearchUrl,
  faculty: apiFacultyUrl,
  history: apiHistoryUrl,
}
