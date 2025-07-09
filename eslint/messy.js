// This is a messy JavaScript file with lots of errors
const unused_variable = "never used";
let x = 1,
  y = 2,
  z = 3;
var old_var = "mixed quotes";

function badFunction(param1, param2, param3) {
  console.log("debugging statement");
  if (x == 1) {
    console.log("inconsistent quotes");
    return param1 + param2;
  } else {
    console.log("unreachable after return");
    return param3;
  }
  console.log("unreachable code");
}

const arr = [1, 2, 3, 4, 5];
for (let i = 0; i < arr.length; i++) {
  if (arr[i] % 2 == 0) {
    console.log(arr[i], "is even");
  } else {
    console.log(arr[i], "is odd");
  }
}

// Missing semicolons everywhere
let obj = {
  name: "test",
  value: 42,
  nested: {
    prop: "value",
  },
};

// Bad indentation and spacing
if (true) {
  console.log("bad indentation");
}

// Trailing commas and extra spaces
const config = {
  option1: true,
  option2: false,
  option3: "value",
};

// Double equals instead of triple
if (obj.value == 42) {
  console.log("loose equality");
}

// Missing final newline
