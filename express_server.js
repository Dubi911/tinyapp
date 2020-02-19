const express = require("express");
const app = express();
const cookie = require('cookie-parser')

const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}


function generateRandomString() {
  let charArray = [];
  
  let i = 48 
  while(i < 58){ // generate digits
    charArray.push(String.fromCharCode(i));
    i++;
  }
  i = 65;
  while(i < 91){ // generate uppercase
    charArray.push(String.fromCharCode(i));
    i++;
  }
  i = 97;
  while(i < 123){ // generate lowercase
    charArray.push(String.fromCharCode(i));
    i++;
  }
  
  i = 0 
  let randStr = ''
  while(i < 6){
    //charArray.length is 62
    randStr += charArray[Math.floor(Math.random() * 62)];
    i++;
  }
  return randStr;
}

// --useless  code--
/* app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
}); */

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookie())

// render templateVars to urls_index
app.get("/urls", (req, res) => {
  const cookie = req.cookies.username
  let templateVars = { urls: urlDatabase, cookie};
  res.render("urls_index", templateVars);
});

app.get('/register', (req, res) => {
  res.render('urls_form',users);
  
})

app.post('/register', (req, res) => {
  const randUserId = `${generateRandomString()}${generateRandomString()}`;
  users[randUserId] = {
    id: randUserId,
    email: req.body.email, 
    password: req.body.password
  }
  res.cookie('user_id', randUserId);
  res.redirect('http://localhost:8080/urls')
})

app.post("/login", (req, res)=> {
  res.cookie('username',req.body.username); 
  res.redirect('http://localhost:8080/urls')
});

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect(`http://localhost:8080/urls`);
});

// when you click urls new in header
app.get("/urls/new", (req, res) => {
  const shortURL = generateRandomString()
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`http://localhost:8080/urls/${shortURL}`);
});

app.get("/urls/:shortURL", (req, res) => {
  const cookie = req.cookies.username;
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], cookie};
  res.render("urls_show", templateVars);
});


// redirect to longurl when you click short url
app.get("/u/:shortURL", (req, res) => {
  let longURL =  urlDatabase[req.params.shortURL];
  if(!longURL){
    res.send(404,'Short URL does not lead to a site\n')
  }
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString()
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`http://localhost:8080/urls`);
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = req.body.longURL;
  const cookie = req.cookies.username;
  urlDatabase[shortURL] = longURL;
  res.render("urls_show",{longURL, shortURL, cookie})
});



app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL
  delete urlDatabase[shortURL];
  res.redirect(`http://localhost:8080/urls`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
