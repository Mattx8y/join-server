const blessed = require('blessed');

const screen = blessed.screen({
  smartCSR: true,
  content: "test"
});

const box = blessed.box({
  border: "line",
  height: "80%"
});

const textbox = blessed.textbox({
  border: "line",
  top: "80%",
  height: "20%"
});

screen.key("C-c", function(ch, key) {
  return process.exit(0);
});

screen.append(box);
screen.append(textbox);

function handle(x, resp) {
  if (resp === "/disconnect") return process.exit(0);
  box.insertLine(0, resp);
  textbox.clearValue();
  textbox.readInput(handle);
  screen.render();
}

textbox.readInput(handle);

screen.render();