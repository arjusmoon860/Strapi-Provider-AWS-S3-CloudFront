# AWS S3 + CloudFront Upload

Using AWS S3 in combination with Amazon CloudFront offers several benefits over using an S3 bucket as a public content repository. You can get it working in under 2 minutes in your application. EASY!

# Features

- Official AWS SDK integration
- Use **PRIVATE** AWS Bucket
- Adds security by creating a private bucket over a public one.
- Highly secure

# Installation

```bash
# using npm
npm install @strapi/provider-upload-aws-s3
```

# Activate the Plugin

Add the folling lines of code in the file: `config/plugins.js`

```js
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "provider-upload-aws-s3-cf",
      providerOptions: {
        s3Options: {
          accessKeyId: env("AWS_ACCESS_KEY_ID"),
          secretAccessKey: env("AWS_ACCESS_SECRET"),
          region: env("AWS_REGION"),
          params: {
            signedUrlExpires: env("AWS_SIGNED_URL_EXPIRES", 15 * 60),
            Bucket: env("AWS_BUCKET"),
          },
          cdn: env("AWS_CDN"),
        },
      },
    },
  },
});
```

# Configure the Strapi Security

Add the folling lines of code in the file: `config/middlewares.js`. You can comment out or remove the existing `strapi::security` from the middleware array.

```js
{
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        directives: {
          "script-src": ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
          "img-src": [
            "'self'",
            "data:",
            "blob:",
            "cdn.jsdelivr.net",
            "strapi.io",
            `${env("AWS_BUCKET")}.s3.${env("AWS_REGION")}.amazonaws.com`,
            `${env("AWS_CDN")}`,
          ],
        },
      },
    },
}
```

# Update .env

```
AWS_ACCESS_KEY_ID=<>
AWS_ACCESS_SECRET=<>
AWS_REGION=<>
AWS_BUCKET=<>
AWS_CDN=<>
```

# Report Bugs/

Any bugs/issues you may face can be submitted as issues in the Github repo.
