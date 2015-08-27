'use strict';

import {expect} from 'chai';

import JSONFormatter from '../index.js';

describe('rendering', ()=> {
  it('number', ()=> {
    const formatter = new JSONFormatter(42);
    expect(formatter.render()).to.contain('42');
  });
});