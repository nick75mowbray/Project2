/* THIS FILE IS FOR CLIENT_SIDE SCRIPTING, SUCH AS BUTTON AJAX CALLS AND FORMS */
//require('dotenv').load();
//var fs = require('fs');
//var cloudinary = require('cloudinary').v2;

var uploads = {};

// set your env variable CLOUDINARY_URL or set the following configuration
//   cloudinary.config({
//   cloud_name: 'dw7h2b2j3',
//   api_key: '726743923128258',
//   api_secret: '2I8mhasqCRST2C7le6sUl-5V6dg'
// }); 


$(document).ready(function() {
    
  // Submit a new coffee
    $("#coffeeSubmitBtn").click( function(event) {

      
      // Make sure to preventDefault on a submit event.
      event.preventDefault();
      // File upload (example for promise api)
      // cloudinary.uploader.upload('pizza.jpg', { tags: 'basic_sample' })
      //   .then(function (image) {
      //     console.log();
      //     console.log("** File Upload (Promise)");
      //     console.log("* public_id for the uploaded image is generated by Cloudinary's service.");
      //     console.log("* " + image.public_id);
      //     console.log("* " + image.url);
      //   })
      //   .catch(function (err) {
      //     console.log();
      //     console.log("** File Upload (Promise)");
      //     if (err) { console.warn(err); }
      //   });
      alert("hello")
        var data = {
            name: $(`#formNameInput`).val().trim(),
            brand:$(`#formBrandInput`).val().trim(),
            description:$(`#formDescriptionInput`).val().trim(),
            price:$(`#formPriceInput`).val().trim(),
            grams: $(`#formGramsInput`).val().trim(),
            //img: $(`#formImgInput`).files[0]
          };
      
      //send ajax call with the id, which will create this coffee at a new id
      $.ajax("/api/coffee", {
        type: "POST",
        data: data
      }).then(
        function(result) {
          console.log("created new id:", result);
    
          // Reload the page to get the updated list
          location.reload();

        });
});


  // Submit a review for a coffee
  // (trying an alternative format)
  $(".submitReviewBtn").click(function(event){
    event.preventDefault();
    // get relevant coffee id
    let coffeeID = event.target.id.substring(12);
    console.log(`Event target id is ${event.target.id}. Coffee id is ${coffeeID}`);
    // create data packet
    var newReview = {
      coffeeID: coffeeID,
      user_name: $(`#reviewInputUserName${coffeeID}`).val().trim(),
      review: $(`#reviewInputTextbox${coffeeID}`).val().trim(),
      rating: $(`#reviewInputRating${coffeeID}`).val()
    };
    // send ajax
    $.ajax(`/api/reviews`,{
      type: "POST",
      data: newReview
    }).then(function(result){
      console.log("Review submitted.");
      // refresh the page
      $('.submitReviewBtn').prop('disabled', true);
      location.reload();
    });
  });

  // for (var i=0; i<5; i++) {
  // $(`#${i}`).click( function(event) {
  //   var data = {
  //       name: $(`#name${this.id}`).val().trim(),
  //       review: $(`#review${this.id}`).val().trim()
  //     };
  //    //send ajax call with the id, which will pick out the reviews with the id of this.id
  //   const reviewId = this.id
  //   $.ajax("/coffee/add-review", {
  //     type: "POST",
  //     data: data
  //   }).then(
  //     function(result) {
  //       console.log("created new id:", result);


   //     }

  //       // Reload the page to get the updated list
  //       location.reload();
  //     }
  //   );
  // });
  // }


  

});
 

