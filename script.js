"use strict";

const account1 = {
  owner: "Harsh Trivedi",
  movements: [10000, -4500, -5000, 6000, 10000, -12000, 13000],
  interestRate: 1.2, //It will in percentages
  pin: 1111,
};
const account2 = {
  owner: "John Will",
  movements: [7000, -400, 9000, -6000, 80000, 2000, -3000],
  interestRate: 1.5, //It will in percentages
  pin: 2222,
};
const account3 = {
  owner: "Harry Potter",
  movements: [200000, -20000, 25000, 16000, -10000, 2000, 15000],
  interestRate: 0.7, //It will in percentages
  pin: 3333,
};
const account4 = {
  owner: "Rambo Steve",
  movements: [-20000, 40000, -15000, 6000, -25000, -12000, 50000],
  interestRate: 1, //It will in percentages
  pin: 4444,
};
const accounts = [account1, account2, account3, account4];
//Selecting all the html classes
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");


const startLogOutTimer = function () {
  // 3.
  // There is always this 1s delay after the app loads and the start of the timer. And also between logins. So let's export the timer callback into its own function, and run it right away
  const tick = function () {
    let minutes = String(parseInt(time / 60, 10)).padStart(2, '0');
    let seconds = String(parseInt(time % 60, 10)).padStart(2, '0');
    // console.log(minutes, seconds);

    // Displaying time in element and clock
    labelTimer.textContent = `${minutes}:${seconds}`;

    // Finish timer
    if (time === 0) {
      // We need to finish the timer, otherwise it will run forever
      clearInterval(timer);

      // We log out the user, which means to fade out the app
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }

    // Subtract 1 second from time for the next iteration
    time--;
  };

  // Setting time to 5 minutes in seconds
  let time = 10 * 60;
  // let time = 10;

  tick();
  const timer = setInterval(tick, 1000);

  // LATER
  return timer;
};



//Displaying movements of Harsh account
const displayMovements = function (movements , sort = false) {

  containerMovements.innerHTML = ""; //Removing the old data that are present in the HTML
  
const movs = sort ?  movements.slice().sort((a ,b) => a - b ):movements ;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
  <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}₹</div>
        </div> 
  `; //DOM manipulation
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// displayMovements(account1.movements); //print total amount of account

const calcDisplayBalance = function ( acc) {
  acc.balance  = acc.movements.reduce((acc, mov) => acc + mov, 0); //0 is the first value of accumulator

  labelBalance.textContent = `${acc.balance} ₹`;
};

// calcDisplayBalance(account1.movements);

//Display all the Deposits, withdrew, and interest
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter( mov => mov > 0 ).reduce((acc, mov) => acc + mov , 0);
    
     //Showing all the income value with chainning array method

  labelSumIn.textContent = `${incomes} ₹`;

  const out = acc.movements
    .filter( function (mov) { return mov <  0})
    .reduce((acc, mov) => acc + mov, 0); //Showing all the withdrew value with chainning array method
  labelSumOut.textContent = `${Math.abs(out)} ₹`;

  const interest = acc.movements
    .filter(function (mov) {return mov > 0})
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest} ₹`; //Showing all the interest
};

// calcDisplaySummary(account1.movements);

//Creating owner name as user name with the help of array method.
const createUsernames = function (accs) {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0]).join("");
     
  });
};
createUsernames(accounts);



//IMPLEMENTING LOGIN FEATURES WITH HELP OF EVENTLISTENER
let currentAccount;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault(); //Prevent form from submitting

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // console.log("LOGIN");
 
    labelWelcome.textContent = `Welcome , ${currentAccount.owner.split(" ")[0]}`;
    containerApp.style.opacity = 100;

    //Removing Pin and name of user
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();


       // UPDATE UI
       displayMovements(currentAccount.movements);
       //Display Balance
       calcDisplayBalance(currentAccount);
       //Display Summary
       calcDisplaySummary(currentAccount);
  }
});



//IMPLEMENTING TRANSFER MONEY FEATURES
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
   receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
          // UPDATE UI
          displayMovements(currentAccount.movements);
          //Display Balance
          calcDisplayBalance(currentAccount);
          //Display Summary
          calcDisplaySummary(currentAccount);
  }
});

//Loan Functionality
btnLoan.addEventListener('click' , function (e){
  e.preventDefault();

 const amount = Number(inputLoanAmount.value);

 if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
     //add the movement
     currentAccount.movements.push(amount);
     displayMovements(currentAccount.movements);
          //Display Balance
          calcDisplayBalance(currentAccount);
          //Display Summary
          calcDisplaySummary(currentAccount);
 }
 inputLoanAmount.value = '';
});


//Close account
btnClose.addEventListener('click' ,function(e){
  e.preventDefault();
  

if( inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin){
  const index = accounts.findIndex(acc => acc.username === currentAccount.username) ;

 accounts.splice(index , 1); //Delete account
 //Hide the User
 containerApp.style.opacity = 0;
}
inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false ;
btnSort.addEventListener('click' , function(e){
e.preventDefault();
displayMovements(currentAccount.movements , !sorted) ;
sorted = !sorted ;

});