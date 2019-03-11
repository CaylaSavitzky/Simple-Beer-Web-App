var results = [];

$.ajax({
  url: "https://api.punkapi.com/v2/beers",
  data: {
  	food: "chicken"
  },
  success: function( result ) {
  	console.log(result);
  	result.forEach(function(item){
  		results.push(item);})
  	let n = 0;
  	results.forEach(function(item){
  		n = n+1;
  		let opening = "<div class = 'card'>";
  		let image = "<div class = 'card_image_holder'><img class = 'card_image' src = "+ item.image_url + "></div>";
  		let fav_icon = "<input type='checkbox' class = 'favorite_checkbox' id = 'checkbox"+n+"'/><label class = 'favorite_icon' for = 'checkbox"+n+"''></label>"
  		let description = "<p class = 'card_description'>" + item.description + "</p>"

	  	$( "#content" ).append( opening + image + "<div class = card_text_holder> "+ fav_icon + description+"</div></div>" );
	  });
  }
});


