
var faunadb = require('faunadb'),
  q = faunadb.query;
exports.handler = async (event, context) => {

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const subject = JSON.parse(event.body);
    var adminClient = new faunadb.Client({ secret: 'fnAD_gH-5ZACCKVXAExuFihfbRsvYEdm3UkwpooH' });

    const result = await adminClient.query(
      q.Update(q.Ref(q.Collection("messages"), subject.id), {
        data: { message: subject.message },
      })
    )

    // const subject = event.queryStringParameters.name || 'World'
    return {
      statusCode: 200,
      body: JSON.stringify({ message:  result.ref.id}),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
