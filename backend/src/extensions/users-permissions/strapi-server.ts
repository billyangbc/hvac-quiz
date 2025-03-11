// https://medium.com/@fabian.froeschl/add-updateme-route-to-strapi-4-0s-users-permissons-plugin-fc31798df295
// make sure you ticked "updateMe" in the admin panel (roles->authenticated->users-permissions)
// solution 1:
// PUT /api/users-permissions/users/me
module.exports = (plugin) => {
  plugin.controllers.user.updateMe = (ctx) => {
      ctx.params.id = ctx.state.user.id;
      return plugin.controllers.user.update(ctx);
  }

  plugin.routes['content-api'].routes.push({
      method: 'PUT',
      path: '/users/me',
      handler: 'user.updateMe'
  });

  return plugin;
}

// solution 2:
// PUT /api/user/me
//module.exports = (plugin) => {
//  plugin.controllers.user.updateMe = async (ctx) => {
//    try {
//      const user = ctx.state.user;
//      if (!user) {
//        return ctx.unauthorized( "You must be logged in to update your profile.");
//      }
//      const data = ctx.request.body;
//      const updatedUser = await strapi.documents("plugin::users-permissions.user").update({ documentId: user.documentId, data, });
//      return ctx.send(updatedUser);
//    } catch (err) {
//      console.error("Error updating user:", err);
//      return ctx.badRequest("Unable to update user.");
//    }
//  };
//
//  plugin.routes["content-api"].routes.push({
//      method: "PUT",
//      path: "/user/me",
//      handler: "user.updateMe",
//      config: {
//        prefix: "",
//        policies: [],
//      },
//  });
//
//  return plugin;
//};

//https://github.com/jpcmf/Strapi-custom-emailConfirmation-workflow
//const _ = require("lodash");
//const utils = require("@strapi/utils");
//const { getService } = require("@strapi/plugin-users-permissions/server/utils");
//const {
//  validateEmailConfirmationBody
//} = require("@strapi/plugin-users-permissions/server/controllers/validation/auth");
//
//const { ValidationError } = utils.errors;
//const { sanitize } = utils;
//const sanitizeUser = (user, ctx) => {
//  const { auth } = ctx.state;
//  const userSchema = strapi.getModel("plugin::users-permissions.user");
//
//  return sanitize.contentAPI.output(user, userSchema, { auth });
//};
//
//module.exports = plugin => {
//  plugin.controllers.auth.emailConfirmation = async (ctx, next, returnUser) => {
//    const { confirmation: confirmationToken } = await validateEmailConfirmationBody(ctx.query);
//
//    const userService = getService("user");
//    const jwtService = getService("jwt");
//
//    const [user] = await userService.fetchAll({
//      filters: { confirmationToken }
//    });
//
//    if (!user) {
//      throw new ValidationError("Invalid token");
//    }
//
//    await userService.edit(user.id, {
//      confirmed: true,
//      confirmationToken: null
//    });
//
//    if (returnUser) {
//      ctx.send({
//        jwt: jwtService.issue({ id: user.id }),
//        user: await sanitizeUser(user, ctx)
//      });
//    } else {
//      const settings = await strapi.store({ type: "plugin", name: "users-permissions", key: "advanced" }).get();
//
//      ctx.redirect(settings.email_confirmation_redirection + "?email=" + user.email || "/");
//    }
//  };
//
//  return plugin;
//};