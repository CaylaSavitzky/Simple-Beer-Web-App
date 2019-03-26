var food = "chicken"
var favorites = new Map();
favorites.set(food, new Set());
var results = new Map();
results.set(food,[]);
var past_searches=[food];
var page = 1;
var char_in_description_max = 134;


var show = () =>{
	$( "#content" ).append("<style> .card{opacity:1;}</style>");
}

var show_all = () =>{
	clear_page();
	let n = 0;
  	results.get(food).forEach(function(item){
  		let card = make_card(item, n);
	  	$( "#content" ).append(card);
	  	n = n+1;
	  });
  	setTimeout(show,100);
}



var show_favorites = () =>{
	clear_page();
	favorites.forEach(function(value, key, map){
		value.forEach(function(number){
	  		let item = results.get(key)[number]
	  		let card = make_card(item, number, key);
		  	$( "#content" ).append(card);
		});
	})
  	
  	setTimeout(show,100);
}

var clear_page = () => {
	$( "#content" ).html("")
}

var refresh = () =>{
	page = 1;
	$( "#content" ).html("")
}

var make_card = (item, n, card_food = food) =>{
	let opening = "<div class = 'card'>";
	let image = "<div class = 'card_image_holder'><img class = 'card_image' src = "+ item.image_url + "></div>";
	let favorited = "";
	if (favorites.get(card_food).has(n)){favorited = "checked"}
	let fav_icon = "<input type='checkbox' class = 'favorite_checkbox'  " + favorited + " id = 'checkbox"+n+"'/><label class = 'favorite_icon' for = 'checkbox"+n+"' onclick = \"favorite(" + n +",  " + "'"+ card_food + "')\"></label>"
	let title = item.name;
	if (title.indexOf('-') != -1 ){ 
		title = title.slice(0,title.indexOf('-'));}
	title = "<h2 class = 'card_title'>" + title + "</h2>"
	let description =  item.description.substr(0,char_in_description_max);
	if (description != item.description){
		let n = 0;
		/*
		while (description.substr(-1).search('[a-zA-Z]') == -1){
			console.log(description);
			description = description.slice(0,-1);
			if (n > 50){break;}
		}
		*/
		description = description+"..."}
	description = "<p class = 'card_description'>" + description + "</p>";
	let card_text = "<div class = card_text_holder> "+ fav_icon + title+ description+"</div>";
	let closing = "</div>";
	return opening + image + card_text+closing;
} 

var favorite = (n, food) =>{
	box = $(".favorite_checkbox")[n];
	if (box.checked == false){favorites.get(food).add(n);}
	if (box.checked == true){favorites.get(food).delete(n);}
}

var go_to_top = () =>{
	$("body")[0].scrollIntoView({behavior: "smooth", block: "start"});
}


var load_new = () =>{
	$.ajax({
	  url: "https://api.punkapi.com/v2/beers",
	  data: {
	  	food: food,
	  	page: page
	  },
	  success: function( result ) {
	  	page = page+1;
	  	let n = results.get(food).length;
	  	result.forEach(function(item){
	  		results.get(food).push(item);})
	  	result.forEach(function(item){
	  		let card = make_card(item, n);
		  	$( "#content" ).append(card);
		  	n = n+1;
		  });
	  	setTimeout(show,100);
	  }
	});
}
load_new();



var search = () =>{
	let tempfood = $("#search_bar_input")[0].value
	if( tempfood != false){
		food = tempfood;
		tempfood = '';
		for (i = 0; i < food.length; i++){
			let letter = food[i];
			if(letter != " "){
				tempfood = tempfood+letter;
			}
			else if (letter == " "){
				tempfood = tempfood+"_";
			}
		}
		food = tempfood;
		$('#all_tab_checkbox')[0].checked = true;
		if (results.get(food) == undefined){
			results.set(food,[]);
			favorites.set(food, new Set());
			refresh();
			load_new();
		}
		else{
			refresh();
			show_all();
		}

	}	
}