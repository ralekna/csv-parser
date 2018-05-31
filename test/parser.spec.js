const {expect} = require('chai');
const parse = require('../src/parser');

describe('[CSV parser and transformer]', () => {

  it('should parse single comma separated line', () => {
    expect(parse(`aaa,bbb,ccc`)).to.be.deep.equal([['aaa', 'bbb', 'ccc']]);

  });

});
