/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

 /**
  * if express api is still up and running
  * Route: /api/healthcheck
  * @param req
  * @param res
  * @param next
  */
export function healthcheck_state(req, res, next) {
  res.status(200).json({});
}
