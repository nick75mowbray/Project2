var express = require("express");
const { sequelize } = require("../models");
var router = express.Router();

// load models eg db.Coffee
var db = require("../models");
var whereClause=''
var brand=[]
// Create all our routes and set up logic within those routes where required.
router.get("/", function(req, res) {

getAll(res, whereClause )

  })

  router.get("/reset", function(req, res) {
    whereClause=''
    getAll(res, whereClause )
    
      })

  router.post("/brand", function(req, res) {
    if (req.body.value==="pick brand"){
      whereClause=""
    }
    else 
    whereClause={brand: req.body.value}

    getAll(res, whereClause )
    
      })
    

 
// POST a new coffee
router.post("/api/coffee", function(req, res) {

  // create new coffee in db
  db.Coffee.create({
    blend_name:         req.body.name,
    brand:              req.body.brand,
    coffee_description: req.body.description,
    price:              req.body.price,
    weight_grams:       req.body.grams,
    img:                req.body.img

  }).then(function(dbCoffee){
    console.log(dbCoffee);
    res.sendStatus(200)
  });
});

router.post("/api/reviews", function(req, res) {
  // check if the username already exists
  db.User.findOne({where: 
                      { user_name: req.body.user_name }
                    })
                    .then(function(returnedUser){
                      console.log(`returned user: ${returnedUser}`);
                      // if there is not a user with the same name create new user
                      if (returnedUser==null){
                          console.log(`user name does not exist`);
                          // create new review in db
                            db.User.create({
                              user_name: req.body.user_name
                            }).then(function(newUser){
                              db.Review.create({
                              review_text:         req.body.review,
                              rating:              req.body.rating,
                              UserId:              newUser.id,
                              CoffeeId:            req.body.coffeeID
                              }).then(function(newReview){
                                console.log(newReview);
                              });
                            });
                      } else {
                        
                        // dont create a new user and use the id of the user returned from the db
                        db.Review.create({
                          review_text:         req.body.review,
                          rating:              req.body.rating,
                          UserId:              returnedUser.id,
                          CoffeeId:            req.body.coffeeID
                          }).then(function(newReview){
                            console.log(newReview);
                          });
                      }
                      res.sendStatus(200)
                    })
  
});



function getAll(res,whereClause) {
console.log("this is the wherwertwertwerteclause", whereClause)
  // get all coffees
  db.Coffee.findAll({where: whereClause,
      include: 
        [{
          model: db.Review,
          raw: true,
          include: 
            [{  model: db.User,
              }]
        }]
    })
    .then(function(dbcoffees){

      // map the data to an array in order to have reviews nested inside each coffee object
      let dbData = [];
      dbcoffees.map(function(coffee){
        dbData.push(coffee.dataValues);
      });

      // calculate the average rating for each coffee
      for (let i = 0; i < dbData.length; i++){
        let aveRating =0;
        let count = 0;
        for (let j = 0; j < dbData[i].Reviews.length; j++){
          aveRating += parseFloat(dbData[i].Reviews[j].rating);
          count++;
        }
        aveRating = aveRating/count;
        console.log(aveRating);
        // add average rating to each coffee
        dbData[i].rating = aveRating.toFixed(1);

      }
      // to get reviews:
      // data[index].Reviews[index].{{review property name eg review_text}}
      //console.log(dbData);

      // order coffees by highest rating
      dbData.sort(function (x, y){
        return y.rating - x.rating;
      });
      var i=0 
      if (i===0) {
      brand.push({value: `pick brand`})
      var hbsObject ={coffee: dbData};
      for (let i=0; i<hbsObject.coffee.length; i++){
        brand.push({value: hbsObject.coffee[i].brand})
      }

      const brand1= [...new Map(brand.map(item => [JSON.stringify(item), item])).values()];
      hbsObject.brand=brand1
    }
      
       
        //console.log("this is the object", hbsObject.brand)
      res.render("index", hbsObject);
    });
}

// Export routes for server.js to use.
module.exports = router;


