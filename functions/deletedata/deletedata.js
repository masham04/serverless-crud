var faunadb = require("faunadb"),
  q = faunadb.query;

exports.handler = async (event, context) => {
  try {
    const subject = JSON.parse(event.body)
    var adminClient = new faunadb.Client({
      secret: "fnAD_gH-5ZACCKVXAExuFihfbRsvYEdm3UkwpooH",
    });

    const result = await adminClient.query(
      q.Delete(
        q.Ref(q.Collection('messages'), subject.id)
      )
    );

    // const subject = event.queryStringParameters.name || 'World'
    return {
      statusCode: 200,
      body: JSON.stringify({message: 'Deleted successfully'}),
      
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
