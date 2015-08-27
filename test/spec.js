'use strict';

import {expect} from 'chai';

import JSONFormatter from '../index.js';

describe('rendering', ()=> {
  it('number', ()=> {
    const formatter = new JSONFormatter(42);
    const html = formatter.render();

    expect(html).to.be.a.string;
    expect(html).to.contain('42');
  });
});