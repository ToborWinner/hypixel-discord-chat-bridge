function generate() {
  return generateIntegral(3);
}

function randInt(a, b) {
  return a + Math.floor(Math.random() * (b - a));
}

const integrationOptions = [
  () => {
    const num = randInt(1, 10);
    const sign = Math.random() <= 0.5 ? "+" : "-";
    const numToAdd = num == 1 ? "" : num;
    return [sign, num, numToAdd + "x"];
  },
  () => {
    const sign = Math.random() <= 0.5 ? "+" : "-";
    return [sign, "x", "x^2/2"];
  },
  () => {
    const num = randInt(2, 9);
    const sign = Math.random() <= 0.5 ? "+" : "-";
    return [sign, "x^" + num, "x^" + (num + 1) + "/" + (num + 1)];
  },
  () => {
    const num = randInt(1, 10);
    const sign = Math.random() <= 0.5 ? "+" : "-";
    const numToAdd = num == 1 ? "" : num;
    return [sign, numToAdd + "ln(x)", [[numToAdd + "x ln(x)"], [numToAdd + "x", true]]];
  },
  () => {
    const num = randInt(1, 10);
    const sign = Math.random() <= 0.5 ? "+" : "-";
    const numToAdd = num == 1 ? "" : num;
    return [sign, numToAdd + "sin(x)", numToAdd + "cos(x)", true];
  },
  () => {
    const num = randInt(1, 10);
    const sign = Math.random() <= 0.5 ? "+" : "-";
    const numToAdd = num == 1 ? "" : num;
    return [sign, numToAdd + "cos(x)", numToAdd + "sin(x)"];
  },
  () => {
    const num = randInt(1, 10);
    const sign = Math.random() <= 0.5 ? "+" : "-";
    const numToAdd = num == 1 ? "" : num;
    return [sign, numToAdd + "sec(x)sec(x)", numToAdd + "tan(x)"];
  },
  () => {
    const num = randInt(1, 10);
    const sign = Math.random() <= 0.5 ? "+" : "-";
    const numToAdd = num == 1 ? "" : num;
    return [sign, numToAdd + "e^x", numToAdd + "e^x"];
  },
  () => {
    const num = randInt(1, 10);
    const sign = Math.random() <= 0.5 ? "+" : "-";
    const numToAdd = num == 1 ? "" : num;
    return [sign, num + "/x", numToAdd + "ln|x|"];
  },
  () => {
    const num = randInt(2, 10);
    const sign = Math.random() <= 0.5 ? "+" : "-";
    return [sign, num + "^x", num + "^x/ln(" + num + ")"];
  }
];

function generateIntegral(amount) {
  const answer = [];
  let integral = "";
  const copy = integrationOptions.map((e) => e);
  for (let i = 0; i < amount; i++) {
    if (copy.length == 0) break;
    const randomIndex = Math.floor(Math.random() * copy.length);
    const element = copy[randomIndex]();
    if (typeof element[2] == "string") {
      let signToUse = element[0];
      if (element.length >= 4 && element[3]) {
        if (signToUse == "+") {
          signToUse = "-";
        } else {
          signToUse = "+";
        }
      }
      answer.push([signToUse, element[2]]);
    } else {
      for (const toAdd of element[2]) {
        let signToUse = element[0];
        if (toAdd.length >= 2 && toAdd[1]) {
          if (signToUse == "+") {
            signToUse = "-";
          } else {
            signToUse = "+";
          }
        }
        answer.push([signToUse, toAdd[0]]);
      }
    }
    if (integral) {
      integral += " " + element[0] + " ";
    } else if (element[0] == "-") {
      integral += "-";
    }
    integral += element[1];
    copy.splice(randomIndex, 1);
  }

  let indexesToRemove = [];
  let total = 0;
  for (const e of answer) {
    const sign = e[0];
    const element = e[1];
    if (element.length != 1 && element.length != 2) continue;
    if (element[element.length - 1] != "x") continue;
    let num = 1;
    if (element.length == 2) {
      num = parseInt(element[0]);
    }
    if (sign == "+") {
      total += num;
    } else {
      total -= num;
    }
    indexesToRemove.push(e);
  }

  if (indexesToRemove.length > 1) {
    for (const toRemove of indexesToRemove) {
      answer.splice(answer.indexOf(toRemove), 1);
    }

    const signToUse = total < 0 ? "-" : "+";
    if (total != 0) {
      let numToUse = Math.abs(total).toString();
      if (numToUse == "1") numToUse = "";
      answer.push([signToUse, numToUse + "x"]);
    }
  }

  answer.push(["+", "C"]);

  let answerString = "";
  for (const a of answer) {
    if (answerString) {
      answerString += " " + a[0] + " ";
    } else if (a[0] == "-") {
      answerString += a[0];
    }
    answerString += a[1];
  }

  return ["integral", integral, answerString];
}

module.exports = generate;
