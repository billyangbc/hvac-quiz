module.exports = ({ env }) => ({
    email: {
      config: {
        provider: "nodemailer",
        providerOptions: {
          host: env("SMTP_HOST"),
          port: env("SMTP_PORT"),
          auth: {
            user: env("SMTP_USER"),
            pass: env("SMTP_PASS"),
          },
          // ... any custom nodemailer options
        },
        settings: {
          defaultFrom: env("SMTP_DEFAULT_FROM"),
          defaultReplyTo: env("SMTP_DEFAULT_REPLYTO"),
        },
      },
    },
//    // https://forum.strapi.io/t/user-permission-problem-with-v5/47190
//    "users-permissions": {
//      config: {
//        register: {
//          allowedFields: [ "role" ],
//        },
//      },
//    },
  });
  