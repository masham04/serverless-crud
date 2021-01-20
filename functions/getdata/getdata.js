var faunadb = require("faunadb"),
  q = faunadb.query;

exports.handler = async (event, context) => {
  try {
    var adminClient = new faunadb.Client({
      secret: "fnAD_gH-5ZACCKVXAExuFihfbRsvYEdm3UkwpooH",
    });

    const result = await adminClient.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("messages"))),
        q.Lambda((x) => q.Get(x))
      )
    );

    // const subject = event.queryStringParameters.name || 'World'
    return {
      statusCode: 200,
      body: JSON.stringify(result.data),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
