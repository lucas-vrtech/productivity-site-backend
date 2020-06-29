const bcrypt = require('bcrypt');
let pswrd = bcrypt.hashSync("password", 9);
console.log(pswrd);