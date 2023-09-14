const express = require("express");
const session = require("express-session");
const path = require("path");
var md5 = require("md5");
const mysql2 = require("mysql2");
const { body, validationResult } = require("express-validator");

const {
  authValidate,
  addProductValidate,
  deleteProductValidate,
  updateProductValidate,
} = require("./validations");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
//app.use(express.static(path.join(__dirname, "static")));

const connection = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "trade",
});

app.post("/auth", ...authValidate(), function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { username, password } = req.body;

  const md5Password = md5(password);

  connection.query(
    "SELECT * FROM accounts WHERE username = ? AND password = ?",
    [username, md5Password],
    function (error, results, fields) {
      if (error)
        res.status(200).json({
          status: "error",
          description: "db sorgusu atilirken beklenmedik bir hata olustu",
        });

      if (results.length > 0)
        res.status(200).json({
          status: 200,
          auth: true,
          description: "Kullanici girisi basarili",
        });
      else
        res.status(200).json({
          status: 400,
          auth: false,
          description: "Kullanici veya sifre hatali",
        });
    }
  );
});

//ürün çekme
app.get("/products", function (req, res) {
  connection.query("SELECT * FROM products", function (error, results, fields) {
    if (error) {
      res.status(500).json({
        status: 500,
        description: "Ürünler alınırken hata oluştu",
      });
    } else {
      res.status(200).json(results);
    }
  });
});

//ürün ekleme
app.post("/product", ...addProductValidate(), function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { Name, Type, Price, Contents, Description } = req.body;

  connection.query(
    "INSERT INTO products (Name, Type, Price, Contents, Description) VALUES (?, ?, ?, ?, ?)",
    [Name, Type, Price, Contents, Description],
    function (error) {
      if (error) {
        res.status(500).json({
          status: 500,
          description: "Ürün eklerken hata oluştu.",
        });
      } else {
        res.status(200).json({
          status: 200,
          description: "Ürün başarıyla eklendi.",
        });
      }
    }
  );
});

//ürün silme
app.delete("/product/:Id", ...deleteProductValidate(), function (req, res) {
  const { Id } = req.params;

  connection.query("DELETE FROM products WHERE Id = ?", [Id], function (error) {
    if (error) {
      res.status(500).json({
        status: 500,
        description: "Ürün silinirken hata oluştu.",
      });
    } else {
      res.status(200).json({
        status: 200,
        description: "Ürün başarıyla silindi.",
      });
    }
  });
});

//Ürün güncelleme
app.put("/product/:Id", ...updateProductValidate(), function (req, res) {
  const { Id } = req.params;

  const { Name, Type, Price, Contents, Description } = req.body;

  connection.query(
    "UPDATE products set Name = ?, Type = ?, Price = ?, Contents=?, Description=? WHERE Id = ?",
    [Name, Type, Price, Contents, Description, Id],
    function (error) {
      if (error) {
        res.status(500).json({
          status: 500,
          description: "Ürün güncellenirken bir hata oluştu",
        });
      } else {
        res.status(200).json({
          status: 200,
          description: "Ürün bilgileri başarıyla güncellendi",
        });
      }
    }
  );
});

app.listen(5000, () => {
  console.log("Server çalışıyor!");
});
