const AWS = require("aws-sdk");
const csv = require("csv-parser");

module.exports.importProductsFile = async (event) => {
  try {
    const s3 = new AWS.S3({ region: "us-east-1" });
    const { name } = event.queryStringParameters;
    const catalogPath = `uploaded/${name}`;

    const params = {
      Bucket: "import-service-uploaded",
      Key: catalogPath,
      Expires: 60,
      ContentType: "text/csv",
    };

    const url = await s3.getSignedUrlPromise("putObject", params);

    return {
      statusCode: 200,
      body: url,
    };
  } catch (err) {
    console.error(err);

    return {
      statusCode: 500,
      body: err,
    };
  }
};

module.exports.importFileParser = (event) => {
  try {
    const s3 = new AWS.S3({ region: "us-east-1" });

    event.Records.forEach((record) => {
      const bucket = record.s3.bucket.name;
      const s3Stream = s3
        .getObject({
          Bucket: bucket,
          Key: record.s3.object.key,
        })
        .createReadStream();

      s3Stream
        .pipe(csv())
        .on("data", (data) => {
          console.log(data);
        })
        .on("end", async () => {
          console.log(`Copy from ${bucket}/${record.s3.object.key}`);

          await s3
            .copyObject({
              Bucket: bucket,
              CopySource: `${bucket}/${record.s3.object.key}`,
              Key: record.s3.object.key.replace("uploaded", "parsed"),
            })
            .promise();

          console.log(
            `Copied into ${bucket}/${record.s3.object.key.replace(
              "uploaded",
              "parsed"
            )}`
          );

          s3.deleteObject({
            Bucket: bucket,
            Key: record.s3.object.key,
          }).promise();
        });
    });
  } catch (err) {
    console.error("Error:", err);
  }
};
