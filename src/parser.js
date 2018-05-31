const ENCLOSING_QUOTE = {value: `"`,    type: 'ENCLOSING_QUOTE'};
const RECORD_BRAKE    = {value: '\r\n', type: 'RECORD_BRAKE'};

const CELL = (value) => ({value, type: 'CELL'});

function parse(csv) {
  let tokenizer = new Tokenizer(csv);
  return tokenizer
    .parse()
    .reduce((store, token, index, array) => {

    if (token.type === 'CELL') {
      store.currentRow = store.currentRow || [];
      store.currentRow.push(token.value);
    }

    if (token.type === 'RECORD_BRAKE') {
      store.rows.push(store.currentRow);
      store.currentRow = [];
    }

    if (index === array.length - 1) {
      store.rows.push(store.currentRow);
    }

      return store;
  }, {rows: [], currentRow: undefined}).rows;
}

class Tokenizer {
  constructor(source) {
    this.leftSource = source;
  }

  parse() {

    let tokens = [];

    while(this.hasNext()) {

      if (isFieldSeparator(this.getLeftSource())) {

        this.skipFieldSeparator();

      } else if (isRecordSeparator(this.getLeftSource())) {

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

      this.readNext(); // throwing away first quote

      while(this.current() && !isEnclosingQuote(this.getLeftSource())) {
        cellValue += this.readNext();
      }
      this.readNext(); // throwing away last quote

    } else {

      // cellValue += this.current();
      while(this.current() && !isFieldSeparator(this.getLeftSource()) && !isRecordSeparator(this.getLeftSource())) {
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

  getLeftSource() {
    return this.leftSource;
  }

  readNext() {
    let char = this.leftSource[0];
    this.leftSource = this.leftSource.slice(1);
    return char;
  }
}

function isBegginingOfCell(string) {
  return (/^["]|[^,]/).test(string);
}

function isEnclosingQuote(string) {
  return (/^"[^"]/).test(string) || (/^"$/).test(string);
}


function isFieldSeparator(char) {
  return (/^,/).test(char);
}

function isRecordSeparator(char) {
  return (/^\s*\r\n/).test(char);
}


module.exports = {
  parse
};