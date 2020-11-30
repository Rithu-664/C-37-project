var dog,dogImg,happyDog,happyDogImg,database,foodS,foodStock;
var milkImg;
var gameState = "hungry";
var fedTime,lastFed;
var food;
var feedPet,addFood;
var puppyName,submitName;
var foodObj;
var updateName,namy;
var puppy;
var state,getState;
var bedroom,garden,washRoom;
var currentTime;
var sadDogImg;

function preload()
{
  bedroom = loadImage("virtual pet images/Bed Room.png")
  garden = loadImage("virtual pet images/Garden.png");
  washRoom = loadImage("virtual pet images/Wash Room.png");
  dogImg = loadImage("virtual pet images/Dog.png");
  happyDogImg = loadImage("virtual pet images/Happy.png")
  milkImg = loadImage("virtual pet images/milk.png");
  sadDogImg = loadImage("virtual pet images/Dog.png");
}

function setup() {
  createCanvas(900, 500);
  
  database = firebase.database();
  console.log(database);
  
  foodStock = database.ref('food');
 foodStock.on("value",readStock);

  dog = createSprite(750,250,100,100)
  dog.addImage(dogImg)
  dog.scale = 0.2;

  feedPet = createButton("Feed the dog")
  feedPet.position(550,100)
  feedPet.mousePressed(feedDog)

  addFood = createButton("Add Food")
  addFood.position(400,100);
  addFood.mousePressed(addFoods)

  puppyName = createInput("");
  puppyName.position(700,400);

  submitName = createButton("Set Name");
  submitName.position(750,450);
  submitName.mousePressed(function(){
    submitName.hide();
    puppyName.hide();

    puppy = puppyName.value();

    database.ref('/').update({
      name: puppy
    })
  })

  foodObj = new Food();

  fedTime = database.ref('LastFeed');
  fedTime.on("value",function(data){
    lastFed=data.val();
  })

  getState = database.ref('gameState');
  getState.on("value",function(data){
    state = data.val();
  })
  
  updateName = database.ref('name');
  
  updateName.on("value",function(data){
    namy=data.val();
  })

}




function draw() {  
background(46,139,87)
fill("white")
textSize(15)
text(puppy,720,360);

 

if(gameState!="hungry"){
  feedPet.hide();
  addFood.hide();
  dog.remove();
}
 
  
  if(lastFed>=12){
    textSize(15)
    text("Last Feed : "+lastFed%12+"PM",230,60)
  }else if(lastFed===0){
    text("Last Feed : 12 AM",230,60)
  }else{
    text("Last Feed : "+lastFed+"AM",230,60)
  }

  currentTime=hour();
  if(currentTime==(lastFed+1)){
    update("Playing")
    foodObj.garden();
    puppyName.hide();
    submitName.hide();
    dog.remove();
    feedPet.hide();
  addFood.hide();
  }else if(currentTime==(lastFed+2)){
    update("sleeping")
    foodObj.bedroom();
    puppyName.hide();
    submitName.hide();
    dog.remove();
    feedPet.hide();
  addFood.hide();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing")
    foodObj.washroom();
    puppyName.hide();
    submitName.hide();
    dog.remove();
    feedPet.hide();
  addFood.hide();
  }else{
    update("Hungry");
    foodObj.display();
    puppyName.show();
    submitName.show();
    feedPet.show();
    addFood.show();
    dog.addImage(dogImg);
  }
  if(foodS>0){
    foodObj.display();
  }

  drawSprites();

}

function feedDog(){
  dog.addImage(happyDogImg)
 database.ref('/').update({
   food:foodS--
 })

 foodObj.updateFoodStock(foodObj.getFoodStock()-1)
 database.ref('/').update({
   food:foodObj.getFoodStock(),
   LastFeed:hour()
 })
  

 if(lastFed>=12){
  text("Last Feed : "+lastFed%12+"PM",350,50)
}else if(lastFed===0){
  text("Last Feed : 12 AM",350,50)
}else{
  text("Last Feed : "+lastFed+"AM",350,30)
}
}

function addFoods(){
  foodS++
  database.ref('/').update({
    food:foodS
  })
}

function readStock(data){
  foodS = data.val();
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}