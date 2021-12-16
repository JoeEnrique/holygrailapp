const express = require("express");
const redis = require("redis");

const PORT = 3671;
const app = express();

//TODO: create a redis client
const client = redis.createClient();
client.mset("header", 0, "left", 0, "article", 0, "right", 0, "footer", 0);
client.mget(
  ["header", "left", "article", "right", "footer"],
  function (err, value) {
    console.log(value);
    console.log(err);
  }
);

// serve static files from public directory
//app.use(express.static("public"));
app.use(express.static("public"));
app.use(express.json());

// TODO: initialize values for: header, left, right, article and footer using the redis client

// Get values for holy grail layout
const data = () => {
  // TODO: uses Promise to get the values for header, left, right, article and footer from Redis
  return new Promise((resolve, reject) => {
    client.mget(
      ["header", "left", "article", "right", "footer"],
      function (err, value) {
        const data = {
          header: Number(value[0]),
          left: Number(value[1]),
          article: Number(value[2]),
          right: Number(value[3]),
          footer: Number(value[4]),
        };
        err ? reject(null) : resolve(data);
      }
    );
  });
};

/*
app.get('/', (req, res) => {
  res.send('Hello World!');
});
*/
/*
app.get("/data", (req, res) => {
  data().then((data) => {
    res.send(data);
    console.log(data);
  });
});
*/

// plus
app.get("/update/:key/:value", function (req, res) {
  const key = req.params.key;
  let value = Number(req.params.value);

  //TODO: use the redis client to update the value associated with the given key
});

// get key data
app.get("/data", function (req, res) {
  data().then((data) => {
    console.log(data);
    res.send(data);
  });
});

app.post("/update/:section/:value", (req, res) => {
  const section = req.params.section;
  let value = Number(req.params.value);

  client.get(section, (err, reply) => {
    value = Number(reply) + value;
    client.set(section, value);
    data().then((data) => {
      res.send(data);
      console.log(data);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Running on: ${PORT}`);
});

process.on("exit", function () {
  client.quit();
});
