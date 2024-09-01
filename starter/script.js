'use strict';
const account1 = {
  owner: 'Aron Pozsar',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1234,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const bntLogout = document.getElementById('logout-button');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
/////////////////
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements; // Slice method used to make a copy of the movements array, because we dont want to change the original array

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);

    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();

    const displayDate = `${day}/${month}/${year}`;

    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        
          <div class="movements__value">${mov.toLocaleString('en-DE')}€</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

///////////////////////////////////

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance.toLocaleString('en-DE')}€`;
};

////////////////////////

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toLocaleString('en-DE')}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toLocaleString('en-DE')}€`;

  const interest = acc.movements // INTEREST is calculated at 1.2% for every transaction. (For every number in the movements array)
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      //console.log(arr); // If the interest is less than 1€ on a transaction, there is no interest
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toLocaleString('en-DE')}€`;
};

/////////////////
// MAP method example
const createUsernames = function (accs) {
  // This function takes the first letter of each word of the name using MAP Method
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        // .map(name => name[0])
        return name[0];
      })
      .join('');
  });
};
createUsernames(accounts);
///////////////////////////////////////////////////
let currentAccount;

// Experimenting with internationalisation
const now = new Date();
const options = {
  hour: 'numeric',
  minute: 'numeric',
};

labelDate.textContent = new Intl.DateTimeFormat('en-GB', options).format(now);
// EVENT HANDLER
btnLogin.addEventListener('click', function (e) {
  // Prevents form from submitting
  e.preventDefault();
  //console.log('Login');

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // The QUESTION SIGN (?) is there to check if the currentAccount exists or not. If not then the if statement will NOT EXECUTE
    // Display UI and welcome message

    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    containerApp.style.display = 'grid';

    // Current Date

    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Clear input fields

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    startLogOutTimer();

    btnLogin.style.display = 'none';
    bntLogout.style.display = 'block';
    inputLoginUsername.style.display = 'none';
    inputLoginPin.style.display = 'none';

    updateUI(currentAccount);
  }
});

// bntLogout.addEventListener('click', function (e) {
//   //e.preventDefault();

//   btnLogin.style.display = 'block';
//   bntLogout.style.display = 'none';

//   inputLoginUsername.style.display = 'flex';
//   inputLoginPin.style.display = 'flex';
// });

const updateUI = function (acc) {
  // Display movements

  displayMovements(acc);

  // Display balance

  calcDisplayBalance(acc);
  // Display summary

  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  // Set time to 5min
  let time = 10;

  // Call the timer every second

  const timer = setInterval(() => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // Decrease one second
    time--; // time = time - 1
    // When 0, logout and stop timer
    if (time === 0) {
      clearInterval(timer);
      btnLogin.style.display = 'block';
      bntLogout.style.display = 'none';
      inputLoginUsername.style.display = 'block';
      inputLoginPin.style.display = 'block';

      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
      containerApp.style.display = 'grid';
    }
  }, 1000);
};
// FAKE ALWAYS LOGGED IN
let xxx;
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAcc.movementsDates.push(new Date().toISOString());
    // Function that updates the UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputLoanAmount.value;

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    setTimeout(function () {
      // Add the movement
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      // Update ui
      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    // Delete Account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (acc) {
  acc.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted; // This line changes from TRUE TO FALSE and FALSE TO TRUE
});

const accountMovements = accounts.map(acc => acc.movements);

const allMovements = accountMovements.flat();

const movementsSum = allMovements.reduce((acc, el) => acc + el, 0);

const overallBalance = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, el) => acc + el, 0);

///////////////////////

// Base 10 = 0 - 9
// Binary: base 2 = 0 - 1
/*
console.log(0.1 + 0.2); // 0.300000000004

// Convertion
console.log(+'23'); // Same as Number('23')

// Parsing
console.log(Number.parseInt('30px', 10)); // Number has to be on the front of the string!!! // parse INTEGERs. the 10 means base 10 system

console.log(Number.parseFloat('2.5rem')); // ParseFloat displays also the decimal points

console.log(Number.isNaN('20'));
console.log(Number.isNaN(20));
console.log(Number.isNaN(+'20x'));

console.log(Number.isNaN(23 / 0));

console.log(Number.isFinite('20')); // This is the best way to check if it is a number or not // false because its a string
*/

console.log(Math.sqrt(25)); // These two are the same
console.log(25 ** (1 / 2));
console.log(8 ** (1 / 3)); // Cubic root

// remainder operator

console.log(5 % 2); // Why does it print 1? Because 5/2 = 2, and it prints the REMAINING 1

// CHECKING IF A NUMBER IS EVEN

const isEven = n => n % 2 === 0;

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
    if (i % 3 === 0) row.style.backgroundColor = 'blue';
  });
});

const diameter = 287460000000;

const priceCents = 345_99; // The console prints without underscore, so we can use it to understant large numbers better
// console.log(priceCents);

// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);

// console.log(2379412783612985619827465912786459145617546n); // The 'n' changes a number to bigInt which is used for numbers bigger than max safe integer
// console.log(BigInt(8759384759745));

// console.log(10000n + 10000n);
// console.log(
//   23874902374927349263749263946723642798n *
//     20938740927384093724098712304971923471237491n
// );
// NOTE: CANNOT MIX BIGINT WITH NORMAL NUMBERS!!!
///////////////////////////////////////////////////////////////////

// Create a date

// console.log(new Date('December 24, 2015'));
// console.log(new Date(account1.movementsDates[0]));

const future = new Date(2023, 10, 11, 13, 53, 12);

console.log(Number(+future));

const calcDaysPassed = (date1, date2) => date2 - date1;

const days1 = calcDaysPassed(new Date(2023, 10, 11), new Date(2025, 2, 11));

console.log(days1);

// SETTING A TIMER

const ingridients = ['olives', 'spinach'];

// // SET TIMEOUT
// const pizzaTimer = setTimeout(
//   (ing1, ing2) => console.log(`Here is your Pizza with ${ing1} and ${ing2} 🍕`),
//   3000,
//   ...ingridients
// );
// if (ingridients.includes('spinach')) clearTimeout(pizzaTimer); // Clear timeout deletes timer

// SET INTERVAL
// setInterval(() => {
//   const now = new Date();
//   const year1 = now.getFullYear();
//   const month1 = now.getMonth();
//   const day1 = now.getDate();
//   console.log(
//     `${now.getHours()}:${now.getMinutes()}:${String(now.getSeconds()).padStart(
//       2,
//       '0'
//     )}`
//   );
// }, 1000);
