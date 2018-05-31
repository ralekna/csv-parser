const {expect} = require('chai');
const {generateTable} = require('../src/transformer');

describe('[CSV transformer]', () => {

  it('should create a single row table from array', () => {
    expect(generateTable([['1', '2', '3']])).to.be.equal(`<table><tr><td>1</td><td>2</td><td>3</td></tr></table>`);
  });

  it('should create a single two row table from array', () => {
    expect(generateTable([['1', '2', '3'], ['4', '5', '6']])).to.be.equal(`<table><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr></table>`);
  });

});