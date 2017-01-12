'use strict';
import 'babel-polyfill';
import Api from '../src/js/api';
import chai from 'chai';

let expect = chai.expect;

describe('投资金额变为中文数字大写',function(){
	it('12345',function(){
		expect(Api.NoToChinese(12345)).to.be.equal('壹万贰仟叁佰肆拾伍')
	});
	it('0',function(){
		expect(Api.NoToChinese(10)).to.be.equal('壹拾')
	});
});

describe('数字进行三位数分割',function(){
	it('12345应该分割为12,345',function(){
		expect(Api.getDotNum(12345)).to.be.equal('12,345');
	});
	it('100应该分割为100',function(){
		expect(Api.getDotNum(100)).to.be.equal(100);
	});
});

describe('base64加密',function(){
	it('12345678',function(){
		expect(Api.base64encode('12345678')).to.be.a('string');
	});
});
