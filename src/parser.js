const ENCLOSING_QUOTE = {value: `"`,    type: 'ENCLOSING_QUOTE'};
const RECORD_QUOTE    = {value: `""`,   type: 'RECORD_QUOTE'};
const RECORD_BRAKE    = {value: '\r\n', type: 'RECORD_BRAKE'};
const STRING_BRAKE    = {value: '\r\n', type: 'STRING_BRAKE'};
const COMMA = {value: ',', type: 'COMMA'};

const CELL = (value) => ({value, type: 'CELL'});

function parse(csv) {
  let tokenizer = new Tokenizer(csv);
  tokenizer.parse();
}

class Tokenizer {
  constructor(source) {
    this.currentChar = 0;
    this.leftSource = source;
  }

  parse() {

    let tokens = [];

    while(this.hasNext()) {

      if (isFieldSeparator(this.getLeftSource())) {
        this.skipFieldSeparator();
      } else if (isRecordSeparator()) {
        this.readRecordBrake();
        tokens.push(RECORD_BRAKE);
      } else if (isBegginingOfCell(this.getLeftSource())) {
        tokens.push(this.readCell());
      }
    }

    return tokens;
  }

  readCell() {
    let cellValue = "";
    if (this.current() === ENCLOSING_QUOTE.value) {
      while(this.hasNext() && !isEnclosingQuote(this.getNext(2))) {
        cellValue += this.readNext();
      }

    } else {
      while(this.hasNext() && !isFieldSeparator(this.getNext())) {
        cellValue += this.readNext();
      }
    }
    return CELL(cellValue);
  }

  skipFieldSeparator() {
    return this.leftSource = this.leftSource.replace(',','');
  }

  readRecordBrake() {
    this.leftSource = this.leftSource.replace(/^\s*\r\n/, '')
  }

  current() {
    return this.leftSource[0];
  }

  hasNext() {
    return this.leftSource[1] !== undefined;
  }

  getNext() {
    if (this.hasNext()) {
      return this.leftSource = this.leftSource.slice(1);
    }
    return undefined;
  }

  getLeftSource() {
    return this.leftSource;
  }

  readNext() {
    return (this.leftSource = this.leftSource.slice(1))[0];
  }
}

function isBegginingOfCell(string) {
  return (/^["\w]/).text(string);
}

function isEnclosingQuote(string) {
  return (/^"[^"]/).test(string);
}


function isFieldSeparator(char) {
  return (/,/).test(char);
}

function isRecordSeparator(char) {
  return (/^\s*\r\n/).test(char);
}


module.export = {
  parse
};