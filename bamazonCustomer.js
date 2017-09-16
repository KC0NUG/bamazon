var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "chuck",

  // Your password
  password: "rush2112",
  database: "bamazonDB"
});

connection.connect(function(err) {
    if (err) throw err;
   
    runMenu();
  });

  
  function runMenu() {
    inquirer
      .prompt({
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
          // "Populate Products",
          "Display Products",
          "Buy a Product"
         ]
      })
      .then(function(answer) {
        switch (answer.action) {
          // case "Populate Products":
          //   populateProducts();
          //   break;
  
          case "Display Products":
            displayProducts();
            break;
  
          case "Buy a Product":
            buyProduct();
            break;
  
        }
      });
  }
  
  function populateProducts() {
    var query = "INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) ";
    query += "VALUES (1,'The Beatles, White Album, CD                 ','Music',       15.99,     99), ";
    query +=        "(2,'Ten Years After, A Space in Time, CD         ','Music',       7.99,      2), ";
    query +=        "(3,'Neil Young, Time Fades Away, Album           ','Music',       250.01,    1), ";
    query +=        "(4,'Chambers Brothers, Time Has Come Today, Album','Music',       375.99,    7), ";
    query +=        "(5,'1966 Ford Shelby GT-350 R Mustang            ','Automotive',  250000.00, 1), ";
    query +=        "(6,'1969 Ford F-250 PU 4X4                       ','Automotive',  7500.01,   1), ";
    query +=        "(7,'1965 Ford Shelby Cobra, 427 CC, Coup         ','Automotive',  2000000.99,1), ";
    query +=        "(8,'1969 Rolex Submanier                         ','Jewelry',     4000.59,   16), ";
    query +=        "(9,'Detroit, Michigan                            ','Real Estate', 0.01,      1), ";
    query +=        "(10,'ICOM 7000 HF/VHF/UHF All Mode Transceiver   ','Electronics', 850.65,    45)"; 
    connection.query(query, function(err, res) {
        // console.log(err);
        // console.log(res);
        // console.log("populateProducts");
              
    runMenu();
    });
  }

  
  function displayProducts() {
    console.log("\nBAMOZON Products:\n");
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products GROUP BY item_id";
    connection.query(query, function(err, res) {
      for (var i = 0; i < res.length; i++) {
        console.log(
          "Item ID: " +
          res[i].item_id +
          " || Product: " +
          res[i].product_name +
          " || Price: " +
          res[i].price +
          " || In Stock: " +
          res[i].stock_quantity);
      }
      console.log("\n");
      runMenu();
    });   
  }
 

  
  function buyProduct() {
    inquirer
      .prompt([
        {
          name: "item_id",
          type: "input",
          message: "Enter Item Number: ",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        {
          name: "quantity",
          type: "input",
          message: "Enter Quantity: ",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function(answer) {
        // console.log (answer.item_id);
        var query = "SELECT item_id, price, stock_quantity FROM products WHERE ?";
        connection.query(query, { item_id : answer.item_id }, function(err, res) {
          // console.log(res);
          // console.log(err);
          // console.log(res[0].item_id);
          // console.log(res[0].stock_quantity);
            // console.log(
            //   "Item_id: " +
            //     res[0].item_id +
            //     " || stock_quantity: " +
            //     res[0].stock_quantity
            //  );

             
             if (res[0].stock_quantity < answer.quantity) {
               console.log("\n");
               console.log("Sorry, we cannot complete the purchase due to Insufficient quantity!");
               console.log("\n");
             }
             else {
               var totalPurchase = answer.quantity * res[0].price;
               console.log("\n");
               console.log("Your purchase is complete for $" + totalPurchase);
               console.log("\n");

               var total = res[0].stock_quantity - answer.quantity;
               //  var item_id = answer.item_id;
               //  Update products

               var query = "UPDATE products SET ? WHERE ?";             
               connection.query(query, [ {stock_quantity: total}, { item_id : answer.item_id }], function(err, res) {
                // console.log(err);
               });
             }
         
          runMenu();
        });
      });
    }
  