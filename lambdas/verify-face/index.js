const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })
const rekognition = new AWS.Rekognition()
const s3 = new AWS.S3({ params: { Bucket: "tcs-faces" } })

exports.handler = async (event) => {
  const parsedData = JSON.parse(event)
  const encodedImage = parsedData.Image
  const decodedImage = Buffer.from(encodedImage, 'base64')
  const filePath = "temp"

  const upload = {
    Body: decodedImage,
    Key: filePath,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg'
  }

  await s3.putObject(upload).promise()

  const register = {
    Image: { S3Object: { Bucket: "tcs-faces", Name: filePath } },
    CollectionId: "tcs-faces",
    FaceMatchThreshold: 85,
    MaxFaces: 5
  }

  const matches = await rekognition.searchFacesByImage(register).promise()

  const response = {
    statusCode: 200,
    body: JSON.stringify(matches)
  }
  return response
}
