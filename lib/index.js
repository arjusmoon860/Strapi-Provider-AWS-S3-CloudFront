"use strict";
/**
 * Module dependencies
 */

/* eslint-disable no-unused-vars */
// Public node modules.
const _ = require("lodash");
const AWS = require("aws-sdk");

module.exports = {
  provider: "cloudfront",
  init(config) {
    if (config.s3Options) {
      config = config.s3Options;
    }
    const S3 = new AWS.S3({
      apiVersion: "2006-03-01",
      ...config,
    });

    function removeTrailingSlash(url) {
      // Use a regular expression to remove a trailing slash if it exists
      return url.replace(/\/$/, "");
    }

    const upload = (file, customParams = {}) =>
      new Promise((resolve, reject) => {
        // upload file on S3 bucket
        const path = file.path ? `${file.path}/` : "";
        S3.upload(
          {
            Key: `${path}${file.hash}${file.ext}`,
            Body: file.stream || Buffer.from(file.buffer, "binary"),
            ContentType: file.mime,
            ...customParams,
          },
          (err, data) => {
            if (err) {
              return reject(err);
            }

            // Set the file url
            if (config.cdn) {
              let cdnURL = removeTrailingSlash(config.cdn);
              file.url = `${cdnURL}/${data.Key}`;
            } else {
              file.url = data.Location;
            }

            resolve();
          }
        );
      });

    return {
      uploadStream(file, customParams = {}) {
        return upload(file, customParams);
      },
      upload(file, customParams = {}) {
        return upload(file, customParams);
      },
      delete(file, customParams = {}) {
        return new Promise((resolve, reject) => {
          // delete file on S3 bucket
          const path = file.path ? `${file.path}/` : "";
          S3.deleteObject(
            {
              Key: `${path}${file.hash}${file.ext}`,
              ...customParams,
            },
            (err, data) => {
              if (err) {
                return reject(err);
              }

              resolve();
            }
          );
        });
      },
    };
  },
};
