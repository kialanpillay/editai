const { default: Terra } = require("terra-api");

const terra = new Terra(
  process.env.DEV_ID,
  process.env.API_KEY,
  process.env.SIGNING_SECRET
);

export default async function handler(req, res) {
  terra
    .generateWidgetSession({
      referenceID: "1",
      providers: ["Apple"],
      showDisconnect: true,
      language: "EN",
    })
    .then((s) => {
      if (s.status === "success") {
        console.log(s.url);
        res.statusCode = 200;
        res.end(JSON.stringify({ url: s.url }));
      } else {
        res.statusCode = 500;
        res.end(JSON.stringify({ status: s.status }));
      }
    });
}
