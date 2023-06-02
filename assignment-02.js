const green_button = document.getElementById('green_circle');
const red_button = document.getElementById('red_circle');
const yellow_button = document.getElementById('yellow_circle');
const blue_button = document.getElementById('blue_circle');
const start_button = document.getElementById('start_button');
const current_score = document.getElementById('current_score');
const high_score = document.getElementById('high_score');

disableButtons(); //cannot click the buttons before starting the game

let comp_order = []; 
let player_order = [];
let flash = 0; //number of times the colors flashed
let turn; //current turn/round
let good; //whether the player guesses are correct or not
let comp_turn; //a boolean to check whether it's computer or player's turn
let intervalID;
var tracker; //to keep track of the 5sec rule between each button the player kicks
var count = 1;


start_button.addEventListener('click', (event) =>{
   document.getElementById('status_indicator').style.background = "green";
    setTimeout(play,3000);//starts the game 3sec after the user clicked the 'start' button
});

function originalColor(){
  document.getElementById('green_circle').style.backgroundColor = "green";
  document.getElementById('red_circle').style.backgroundColor = "red";
  document.getElementById('yellow_circle').style.backgroundColor = "yellow";
  document.getElementById('blue_circle').style.backgroundColor = "blue";
}

function flashColor(){
  document.getElementById('green_circle').style.backgroundColor = "lightgreen";
  document.getElementById('red_circle').style.backgroundColor = "pink";
  document.getElementById('yellow_circle').style.backgroundColor = "#ff7700";
  document.getElementById('blue_circle').style.backgroundColor = "lightblue";
}

function play(){
  //only for the first round or when the game is restarted, the play function is used.
  comp_order = [];
  player_order = [];
  count = 1;
  flash = 0; // 0 flashes so far
  turn = 1; //round
  current_score.innerHTML = 1;
  if(high_score.innerHTML != 00) console.log('');
  else high_score.innerHTML = 0;
  good = true; //player hasn't guessed anything incorrect yet
  comp_turn = true;
  intervalID = setInterval(game,1000); //runs the game function after 1sec
}
function game(){
  if(flash == turn){
    //if the number of flashes is equal to the current round, then the computer's turn is over.
    clearTimeout(intervalID);
    comp_turn = false;
    document.getElementById('turn').innerHTML = "Your Turn";
    tracker = setInterval(track_time,1000);
    enableButtons();//user can click the buttons once the computer finishes flashing all the colours
    originalColor();//clear if any colors are flashed
  }
  if(comp_turn){
    document.getElementById('turn').innerHTML = "Computer's Turn";
    disableButtons(); //user cannot click the buttons while the computer is flashing the colours.
    originalColor();
    comp_order.push(Math.floor((Math.random() * 4) + 1));
    setTimeout(() =>{
      if(comp_order[flash] == 1) green();
      if(comp_order[flash] == 2) red();
      if(comp_order[flash] == 3) yellow();
      if(comp_order[flash] == 4) blue();
      flash++;
    },200); //wait for 200 sec to change from original color to flashed color
  }
}
function track_time(){
  if(count == 5){
    clearInterval(tracker);
    end_game(); //ends the game if the players takes 5sec to guess between one signal and the next.
  }
  console.log(count++);
}
function disableButtons(){
  green_button.disabled = true;
  red_button.disabled = true;
  yellow_button.disabled = true;
  blue_button.disabled = true;
}
function enableButtons(){
  green_button.disabled = false;
  red_button.disabled = false;
  yellow_button.disabled = false;
  blue_button.disabled = false;
}
function green(){green_button.style.backgroundColor = "lightgreen";}
function red(){red_button.style.backgroundColor = "pink";}
function yellow(){yellow_button.style.backgroundColor = "#ff7700";}
function blue(){blue_button.style.backgroundColor = "lightblue";}

green_button.addEventListener('click', (event) =>{
  clearTimeout(tracker);
  count = 1;
  player_order.push(1);
  check();
  green();
  setTimeout(() =>{
    originalColor(); //returns to original colour after 300ms
  },300);
});
red_button.addEventListener('click', (event) =>{
  clearTimeout(tracker);
  count = 1;
  player_order.push(2);
  check();
  red();
  setTimeout(() =>{
    originalColor();
  },300);
});
yellow_button.addEventListener('click', (event) =>{
  clearTimeout(tracker); 
  count = 1;
  player_order.push(3);
  check();
  yellow();
  setTimeout(() =>{
    originalColor();
  },300);
});
blue_button.addEventListener('click', (event) =>{
  clearTimeout(tracker);
  count = 1;
  player_order.push(4);
  check();
  blue();
  setTimeout(() =>{
    originalColor();
  },300);
});

function check(){
  //checking if the player clicked the right color
  var cs = current_score.innerHTML;
  var hs = high_score.innerHTML;
  if(player_order[player_order.length-1] !== comp_order[player_order.length-1]){
    good = false;  //user clicked wrong color
  }
  if(good == false) end_game(); //end the game as the user clicked the wrong color
  if(turn == player_order.length && good){
    clearTimeout(tracker);//when the round is finished
    count = 1;
    turn++;
    player_order = [];
    comp_turn = true;
    flash = 0;
    var cs1 = parseInt(cs,10)+1; //10 represents base 10.
    current_score.innerHTML = cs1;
    //increases the speed depending on the number of turn/round the player is in.
    if(turn > 13) intervalID = setInterval(game,350);
    else if(turn > 9) intervalID = setInterval(game,500);
    else if(turn > 5) intervalID = setInterval(game,700);
    else intervalID = setInterval(game,1000);
    //runs the game again if the player guessed everything correctly
  }
  else tracker = setInterval(track_time,1000); 
  //the 5sec timer resets again when the player guesses one signal correctly
}
function end_game(){
  var cs = current_score.innerHTML;
  var hs = high_score.innerHTML;
  flashEnd(); //flashes all the colors 5 times indicating that the game has ended.
  document.getElementById('turn').innerHTML = "Oops! You Lost";
  disableButtons();
  setTimeout(() =>{
    if(parseInt(cs,10) > parseInt(hs,10)) high_score.innerHTML = cs;
    current_score.innerHTML = 0; //reset the current score back to 0
    document.getElementById('status_indicator').style.background = "red";
  },2500); //2.5sec because it takes 2sec to flash all the colors 5 times
}
function flashEnd(){
  const flashing = setInterval(()=>{
    flashColor();
    setTimeout(()=>{
      originalColor();
    },200); //returning to the original color after 0.2sec
  },400); //flashing all the 4 colors every 0.4sec
  setTimeout(() => clearInterval(flashing),2000); //clears the interval after 2sec. 0.4*5times = 2sec
}

//Rules
const modal = document.getElementById("myRules");
// Get the button that opens the modal
const btn = document.getElementById("rule_button");
// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];
btn.addEventListener('click',() =>{
  modal.style.display = "block";
});
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}