require("dotenv").config();

const mineflayer = require("mineflayer");
const chalk = require("chalk");
const blessed = require("blessed");

function parseMessage(msg) {
  let fmsg = "";
  function append(m) {
    let fn = chalk;
    if (m.bold) fn = fn.bold;
    if (m.italic) fn = fn.italic;
    if (m.underlined) fn = fn.underline;
    if (m.strikethrough) fn = fn.strikethrough;
    if (m.obfuscated) fn = fn.hidden;
    if (m.color) switch (m.color.toLowerCase()) {
      case "black":
        fn = fn.rgb(0, 0, 0);
        break;
      case "dark_blue":
        fn = fn.rgb(0, 0, 170);
        break;
      case "dark_green":
        fn = fn.rgb(0, 170, 0);
        break;
      case "dark_aqua":
        fn = fn.rgb(0, 170, 170);
        break;
      case "dark_red":
        fn = fn.rgb(170, 0, 0);
        break;
      case "dark_purple":
        fn = fn.rgb(170, 0, 170);
        break;
      case "gold":
        fn = fn.rgb(255, 170, 0);
        break;
      case "gray":
        fn = fn.rgb(170, 170, 170);
        break;
      case "dark_gray":
        fn = fn.rgb(85, 85, 85);
        break;
      case "blue":
        fn = fn.rgb(85, 85, 255);
        break;
      case "green":
        fn = fn.rgb(85, 255, 85);
        break;
      case "aqua":
        fn = fn.rgb(85, 255, 255);
        break;
      case "red":
        fn = fn.rgb(255, 85, 85);
        break;
      case "light_purple":
        fn = fn.rgb(255, 85, 255);
        break;
      case "yellow":
        fn = fn.rgb(255, 255, 85);
        break;
      case "white":
        fn = fn.rgb(255, 255, 255);
        break;
    }
    if (typeof m.text === "string") for (let i = 0; i < m.text.length; i++) {
      let char = m.text.charAt(i);
      if (char === "§") continue;
      if (m.text.charAt(i - 1) === "§") {
        switch (char) {
          case "0":
            fn = fn.rgb(0, 0, 0);
            break;
          case "1":
            fn = fn.rgb(0, 0, 170);
            break;
          case "2":
            fn = fn.rgb(0, 170, 0);
            break;
          case "3":
            fn = fn.rgb(0, 170, 170);
            break;
          case "4":
            fn = fn.rgb(170, 0, 0);
            break;
          case "5":
            fn = fn.rgb(170, 0, 170);
            break;
          case "6":
            fn = fn.rgb(255, 170, 0);
            break;
          case "7":
            fn = fn.rgb(170, 170, 170);
            break;
          case "8":
            fn = fn.rgb(85, 85, 85);
            break;
          case "9":
            fn = fn.rgb(85, 85, 255);
            break;
          case "a":
            fn = fn.rgb(85, 255, 85);
            break;
          case "b":
            fn = fn.rgb(85, 255, 255);
            break;
          case "c":
            fn = fn.rgb(255, 85, 85);
            break;
          case "d":
            fn = fn.rgb(255, 85, 255);
            break;
          case "e":
            fn = fn.rgb(255, 255, 85);
            break;
          case "f":
            fn = fn.rgb(255, 255, 255);
            break;
          case "k":
            fn = fn.hidden;
            break;
          case "l":
            fn = fn.bold;
            break;
          case "m":
            fn = fn.strikethrough;
            break;
          case "n":
            fn = fn.underline;
            break;
          case "o":
            fn = fn.italic;
            break;
          case "r":
            fn = chalk;
            break;
        }
        continue;
      }
      fmsg += fn(char);
    }
    if (m.extra) for (let i = 0; i < m.extra.length; i++) append(m.extra[i]);
  }
  append(msg);
  return fmsg;
}

function connect(username, password, ip) {
  const user = mineflayer.createBot({
    host: ip.split(":")[0],
    port: ip.split(":")[1] || 25565,
    username,
    password,
    version: false,
    auth: "mojang"
  });

  const screen = blessed.screen({
    smartCSR: true
  });

  screen.key("C-c", function() {
    return process.exit(0);
  });

  const box = blessed.box({
    border: "line",
    height: "80%",
    scrollable: true,
    valign: "bottom"
  });
  
  const textbox = blessed.textbox({
    border: "line",
    top: "80%",
    height: "20%"
  });
  
  screen.append(box);
  screen.append(textbox);

  function write(msg) {
    box.pushLine(msg);
    screen.render();
  }

  user.on("kicked", msg => write(`Kicked: ${parseMessage(JSON.parse(msg))}`));
  
  user.once("spawn", () => {
    write("Logged into " + ip + " at " + user.entity.position + "\n");
  });

  user.on("error", console.error);

  user.on("message", msg => write(parseMessage(msg)));

  function handle(err, msg) {
    if (err) throw err;
    if (msg === "/disconnect") return process.exit(0);
    user.chat(msg);
    textbox.clearValue();
    textbox.readInput(handle);
    screen.render();
  }

  textbox.readInput(handle);
}

connect(process.env.USER, process.env.PASS, process.env.SERVER);