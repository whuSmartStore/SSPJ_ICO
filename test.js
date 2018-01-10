const ignorePath = {
    "/public/404.html": true,
    "/public/logIn.html": true,
    "/public/register.html": true,
    "/": true
}

const url = "/public/404.html";

console.log(ignorePath[url]);