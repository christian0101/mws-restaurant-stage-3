/**
 * bearerAuth Policy
 *
 * Policy for authorizing API requests. The request is authenticated if the
 * it contains the accessToken in header, body or as a query param.
 * Unlike other strategies bearer doesn't require a session.
 * Add this policy (in config/policies.js) to controller actions which are not
 * accessed through a session. For example: API request from another client
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */

module.exports = function (req, res, next) {
  passport.authenticate('bearer', {session: false}, function(err, user, info) {
      if (err) return next(err);
      if (user) return next();

      return res.forbidden("You are not permitted to perform this action.");
  })(req, res);
};
