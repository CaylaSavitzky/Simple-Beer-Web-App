$("body").html('<div id = "display">mow</div>');

$.ajax({
  url: "https://api.punkapi.com/v2/beers",
  data: {
  	food: "chicken"
  },
  success: function( result ) {
  	console.log(result);
    $( "body" ).html( "<strong>" + result + "</strong> degrees" );
  }
});


class People {
constructor(name) {
 this.name = name;
 }
 get Name() {
 return this.name;
 }
 set Name(name) {
 this.name = name + "lol"
 }
}
let person = new People("Jon Snow");
console.log(person.Name);
person.Name = "Dany";
console.log(person.Name);