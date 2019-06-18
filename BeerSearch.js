/*
*
*
*
Key Globals
*
*
*
*/

var food = "Beef"
var favorites = new Map();
favorites.set(food, new Set());
var results = new Map();
results.set(food,[]);
var past_searches=[food];
var page = 1;

/* reduce 20 chars for about 1 line
max height for card_text_holder ~= 320
*/
var max_height = 280



/*
*
*
*
Primairy Display Functions
*
*
*
*/


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
  	$(load_button)[0].style.display = 'block';
  	setTimeout(show,100);
}



var show_favorites = () =>{
	clear_page();
	favorites.forEach(function(value, key, map){
		console.log(value, key, map)
		value.forEach(function(number){
	  		let item = results.get(key)[number]
	  		let card = make_card(item, number, key);
		  	$( "#content" ).append(card);
		});
	})
	$(load_button)[0].style.display = 'none';
  	setTimeout(show,100);
  	setTimeout(height_check,300);
}

var clear_page = () => {
	$( "#content" ).html("")
}

var refresh = () =>{
	page = 1;
	$( "#content" ).html("")
}


/*
*
*
*
Beer Card Generation and Testing
*
*
*
*/


// takes a given food and item number, and generates the html to display the beer image and description as a card
var make_card = (item, n, card_food = food, char_in_description_max = 224) =>{
	let opening = "<div class = 'card' id = 'card_"+card_food+"_"+n+"'>";
	let favorited = "";
	if (favorites.get(card_food).has(parseInt(n)) ){favorited = "checked"}
	let fav_icon = "<input type='checkbox' class = 'favorite_checkbox'  " + favorited + " id = 'checkbox"+n+"'/><label class = 'favorite_icon' for = 'checkbox"+n+"' onclick = \"favorite(" + n +",  " + "'"+ card_food + "')\"></label>"
	let image = "<div class = 'card_image_holder'><img class = 'card_image' src = "+ item.image_url + " alt = 'Image Unavailable'></div>";
	let subcard = "<div class = 'subcard' onclick=short_to_long('" + card_food+"',"+ n + ")>"
	let title = item.name;
	if (title.indexOf('-') != -1 ){ 
		title = title.slice(0,title.indexOf('-'));}
	title = "<h2 class = 'card_title'>" + title + "</h2>"
	let description =  item.description.substr(0,char_in_description_max);
	if (description != item.description){
		description = description+"..."}
	description = "<p class = 'card_description'>" + description + "</p>";
	let card_text = "<div class = card_text_holder> "+ title+ description+"</div>";
	let closing = "</div></div>";
	let card = opening + fav_icon+ subcard +image + card_text+closing;
	return card;
} 

//makes a card that has the class long, and does not reduce the size of the card
var make_card_long = (item, n, card_food = food, char_in_description_max = 124) =>{
	let opening = "<div class = 'card long' id = 'card_"+card_food+"_"+n+"'>";
	let favorited = "";
	if (favorites.get(card_food).has(parseInt(n))){favorited = "checked"}
	let fav_icon = "<input type='checkbox' class = 'favorite_checkbox'  " + favorited + " id = 'checkbox"+n+"'/><label class = 'favorite_icon' for = 'checkbox"+n+"' onclick = \"favorite(" + n +",  " + "'"+ card_food + "')\"></label>"
	let image = "<div class = 'card_image_holder'><img class = 'card_image' src = "+ item.image_url + " alt = 'Image Unavailable'></div>";
	let subcard = "<div class = 'subcard' onclick=long_to_short('" +card_food+"',"+ n + ")>";
	let title = item.name;
	if (title.indexOf('-') != -1 ){ 
		title = title.slice(0,title.indexOf('-'));}
	title = "<h2 class = 'card_title'>" + title + "</h2>"

	let description =  item.description
	description = "<p class = 'card_description'>" + description + "</p>";
	let card_text = "<div class = card_text_holder> "+ title+ description+"</div>";
	let closing = "</div></div>";
	let card = opening + fav_icon+ subcard +image + card_text+closing;
	return card;
} 

//tests the height of all beer cards and confirms their descriptions are not overflowing
var height_check = () => {
	let cards = $(".card")
	let subcards = $(".subcard")
	let card_text_holders = $(".card_text_holder")
	for (let i = 0; i < card_text_holders.length; i++){
		let temploc = cards[i].id.lastIndexOf("_");
		let card_food = cards[i].id.substr(5,temploc-5);
		let card_num = cards[i].id.substr(temploc+1);
		height_check_single(card_num,card_food);
	}
}

//tests the height of one beer card and confirms their descriptions are not overflowing
var height_check_single = (i,card_food = food) => {
	console.log('test');
	let card = $("#card_"+card_food + "_"+i)
	let subcard = card.find(".subcard")
	let card_text_holder = card.find(".card_text_holder")
	if (card_text_holder.height() > subcard.height()){
		if(card[0].className.search("long") == -1){
			let card_description_text = card.find(".card_description")[0].innerHTML;
			card.find(".card_description").html(card_description_text.slice(0,card_description_text.length-20)+"...");
			height_check_single(i,card_food)
		}
	}
}

/*
*
*
*
Onclick Functions
*
*
*
*/

// Onclick function to give a fulltext description of a beer
var short_to_long =(card_food,i) =>{
	$($("#card_"+card_food+"_"+i)[0]).replaceWith(make_card_long(results.get(card_food)[i],i,card_food));
}

// Onclick function to reduce the fulltext description of a beer
var long_to_short =(card_food,i) =>{
	$($("#card_"+card_food+"_"+i)[0]).replaceWith(make_card(results.get(card_food)[i],i,card_food));
	height_check_single(i,card_food);
	setTimeout(function(){height_check_single(i,card_food)},80);
	setTimeout(function(){height_check_single(i,card_food)},120);
	setTimeout(function(){height_check_single(i,card_food)},160);
}

// Onclick function to favorite a beer
var favorite = (n, food) =>{
	box = $("#checkbox"+n)[0];
	if (box.checked == false){
		favorites.get(food).add(n);
	}
	if (box.checked == true){
		favorites.get(food).delete(n);
	}
}

// Onclick function for bottom-right corner button
var go_to_top = () =>{
	$("body")[0].scrollIntoView({behavior: "smooth", block: "start"});
}

// Onclick funtion for Load More button
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
	  	setTimeout(height_check,120);
	  	setTimeout(height_check,180);
	  	setTimeout(height_check,260);
	  	setTimeout(height_check,400);
	  	setTimeout(height_check,8000);
	  	setTimeout(height_check,3000);
	  	setTimeout(height_check,7000);
	  	setTimeout(height_check,12000);
	  	setTimeout(height_check,20000);
	  }
	});
}

// Onclick function for Search button
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


/*
*
*
*
Initializing Details
*
*
*
*/

//Onresize function for body
var screenResize = () =>{
	if(window.innerWidth < 755){
		if(max_height!=280)
		{
			max_height=290;
		}
	}
	else{
		if(max_height!=240)
		{
			max_height=240;
		}
	}
	height_check();
}


// Event Listener kept on the search bar to detect enter key-press events
var search_bar_input = $("#search_bar_input")[0];
search_bar_input.addEventListener("keyup", function(event){
	if (event.keyCode === 13) {
   event.preventDefault();
   search();
  }
});

screenResize()
load_new();