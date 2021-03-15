//SERVER
var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var request = require("request");
var LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");
var sUrlDestino = "https://dare-nodejs-assessment.herokuapp.com/api";
app.use(express.static('public'));
//app.set('view engine', 'html'); 
const requestToken = (oClaves) => {
  
  request(
    {
      url: sUrlDestino + "/login",
      method: "POST",
      json: oClaves
    },
    function (error, response, body) {
      if (error) {
        return "ERROR";
      }

      return Promise.resolve().then(function () {
        localStorage.setItem("token", body.token);
      });
    }
  );
};
const asyncLocalStorage = {
  setItem: function(key, value) {
    return Promise.resolve().then(function() {
      localStorage.setItem(key, value);
    });
  },
  getItem: function(key) {
    return Promise.resolve().then(function() {
      localStorage.getItem(key);
    });
  }
};

app.get("/", (req, res, next) => {
  res.render('index')
});

app.post("/login", function(req, res) {
  var oClaves = {
    client_id: req.body.username,
    client_secret: req.body.password
  };

  asyncLocalStorage
    .setItem("client_id", oClaves.client_id)
    .then(function() {
      asyncLocalStorage.setItem("client_secret", oClaves.client_secret);
    })
    .then(() => {
      requestToken(oClaves);
    }).then(() => {
     // res.send("Welcome");
    });
    res.send("Welcome");
  
});

app.get("/clients", (req, res, next) => {
  var oClaves = {
    client_id: localStorage.getItem("client_id"),
    client_secret: localStorage.getItem("client_secret")
  };

  async function pedirToken() {
    await requestToken(oClaves);
  }
  pedirToken().then(function() {
    var authToken = "Bearer " + localStorage.getItem("token");

    var page = 1;
    var limite = req.query.limit || 10;
    var user = req.query.name || "all";

    var startIndex = (page - 1) * limite;
    var endIndex = page * limite;

    request(
      {
        url: sUrlDestino + "/clients",
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Authorization: authToken
        }
      },
      function(error, response, body) {
        if (error) {
          return "ERROR";
        }

        if (response.statusCode == 401) {
          resultado = "Invalid Token";
        }

        if (response.statusCode == 200) {
          body = JSON.parse(body);
          resultado = body.slice(startIndex, endIndex);

          if (user !== "all") {
            resultado = resultado.find(x => x.name === user);
          }
        }

        res.send(resultado);
      }
    );
  });
});

app.get("/clients/:id", (req, res, next) => {
  var oClaves = {
    client_id: localStorage.getItem("client_id"),
    client_secret: localStorage.getItem("client_secret")
  };

  async function pedirToken() {
    await requestToken(oClaves);
  }
  pedirToken().then(function() {
    var authToken = "Bearer " + localStorage.getItem("token");

    var page = 1;
    var limite = req.query.limit || 10;
    var user = req.query.name || "all";
    var idParam = req.params.id || "all";

    var startIndex = (page - 1) * limite;
    var endIndex = page * limite;

    request(
      {
        url: sUrlDestino + "/clients",
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Authorization: authToken
        }
      },
      function(error, response, body) {
        if (error) {
          return "ERROR";
        }

        if (response.statusCode == 401) {
          resultado = "Invalid Token";
        }

        if (response.statusCode == 200) {
          body = JSON.parse(body);
          resultado = body.slice(startIndex, endIndex);

          if (user !== "all") {
            resultado = resultado.find(x => x.name === user);
          } else if (idParam !== "all") {
            var resultadoFiltrado = resultado.find(x => x.id == idParam);
          }
          if (resultadoFiltrado) {
            resultado = resultadoFiltrado;
          }

          resultado = JSON.stringify(resultado);
        }

        res.send(resultado);
      }
    );
  });
});
app.get("/policies", (req, res, next) => {
  var oClaves = {
    client_id: localStorage.getItem("client_id"),
    client_secret: localStorage.getItem("client_secret")
  };
  async function pedirToken() {
    await requestToken(oClaves);
  }
  pedirToken().then(function() {
    var authToken = "Bearer " + localStorage.getItem("token");
    request(
      {
        url: sUrlDestino + "/policies",
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Authorization: authToken
        }
      },
      function(error, response, body) {
        if (error) {
          return "ERROR";
        }

        if (response.statusCode == 401) {
          resultado = "Invalid Token";
        }

        if (response.statusCode == 200) {
          resultado = body;
        }
        resultado = JSON.parse(resultado);
        res.send(resultado);
      }
    );
  });
});

app.get("/policies/:id", (req, res, next) => {
  var oClaves = {
    client_id: localStorage.getItem("client_id"),
    client_secret: localStorage.getItem("client_secret")
  };
  async function pedirToken() {
    await requestToken(oClaves);
  }
  pedirToken().then(function() {
    var authToken = "Bearer " + localStorage.getItem("token");

    var page = 1;
    var limite = req.query.limit || 10;
    var user = req.query.name || "all";
    var idParam = req.params.id || "all";

    var startIndex = (page - 1) * limite;
    var endIndex = page * limite;

    request(
      {
        url: sUrlDestino + "/policies",
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Authorization: authToken
        }
      },
      function(error, response, body) {
        if (error) {
          return "ERROR";
        }

        if (response.statusCode == 401) {
          resultado = "Invalid Token";
        }

        if (response.statusCode == 200) {
          body = JSON.parse(body);
          resultado = body.slice(startIndex, endIndex);

          if (user !== "all") {
            resultado = resultado.find(x => x.name === user);
          } else if (idParam !== "all") {
            var resultadoFiltrado = resultado.find(x => x.id == idParam);
          }
          if (resultadoFiltrado) {
            resultado = resultadoFiltrado;
          }

          resultado = JSON.stringify(resultado);
        }

        res.send(resultado);
      }
    );
  });
});

app.get("/clients/:id/policies", (req, res, next) => {
  var oClaves = {
    client_id: localStorage.getItem("client_id"),
    client_secret: localStorage.getItem("client_secret")
  };
  async function pedirToken() {
    await requestToken(oClaves);
  }
  pedirToken().then(function() {
    var authToken = "Bearer " + localStorage.getItem("token");

    var idParam = req.params.id || "all";

    request(
      {
        url: sUrlDestino + "/policies",
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Authorization: authToken
        }
      },
      function(error, response, body) {
        if (error) {
          return "ERROR";
        }

        if (response.statusCode == 401) {
          resultado = "Invalid Token";
        }

        if (response.statusCode == 200) {
          resultado = JSON.parse(body);

          if (idParam !== "all") {
            var resultadoFiltrado = resultado.find(x => x.clientId == idParam);
            resultado = resultadoFiltrado;
          }
        }

        res.send(resultado);
      }
    );
  });
});

http.createServer(app).listen(888, () => {
  console.log("Server started at http://localhost:888");
});

