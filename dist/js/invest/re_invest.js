/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _api = __webpack_require__(2);

	var _api2 = _interopRequireDefault(_api);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var fontRate = +_api2.default.rootSize.replace("px", "") / 75; /*"EBL2016122600001"*/

	var leastATM = void 0; //起投金额
	var canInvestATM = void 0; //可投金额
	var useableMoney = void 0; //账户余额
	var proNo = _api2.default.GetQueryString("productNo");; //项目索引
	var userTable = void 0; //用户信息

	//初始化
	!function () {
		$("input").val("");
		//用户登录
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: '/yblapp/ws/wxuser/query_UserLoginVld',
			success: function success(data) {
				console.log(data);
				if (!data) {
					return false;
					location.href = '/yblapp/mpbweb/html/security/login_step1.html';
				} else {
					userTable = data;
					projectShow(data);
					userInvest();
				}
			},
			error: function error() {
				console.log("用户登录失败");
			}
		});
		//项目信息展示
		var projectShow = function projectShow(useInfo) {
			$.ajax({
				type: "POST",
				url: "/yblapp/ws/invest/query_InvestProductDeatil",
				dataType: "json",
				data: {
					productNo: proNo
				},
				success: function success(data) {
					console.log(data);
					canInvestATM = data.PRO_RAISE_AMT - data.PRO_REAL_RAISE_AMT; //可投金额
					leastATM = data.PRO_LEAST_AMT; //起投金额
					triggleAllMoney(canInvestATM, null);
					if (canInvestATM > 0) {
						$(".js-head-title").html(data.PRO_NAME);
						// const vipRate =
						$(".js-head-rate .old-rate").html(data.PRO_YEAR_RATE + "%+" + (parseFloat(useInfo.vipRate) > 0 ? useInfo.vipRate : "vip") + "%");
						$(".js-repay-time").html(data.PRO_REPAY_TIME.split(" ")[0]);
						$(".js-can-invest").html(_api2.default.getDotNum(canInvestATM));
					} else {
						boxMsg("该项目已经募集成功");
					}
				},
				error: function error() {
					console.log("请求项目信息失败");
				}
			});
		};
		var can = null,
		    usa = null;
		var triggleAllMoney = function triggleAllMoney(canInvestATM, usableMoney) {
			can = can || canInvestATM;
			usa = usa || usableMoney;
			if (can && usa) {
				$(".js-insert-all-money").click(function () {
					allInvestMoney(can, usa);
				});
			}
		};
		//用户账户信息
		var userInvest = function userInvest() {
			$.ajax({
				type: "POST",
				url: "/yblapp/ws/member/query_InvestAccountInfoByUserId",
				dataType: "json",
				success: function success(data) {
					console.log(data);
					var useable_money = JSON.parse(data.resultData).usableMoney; //个人账户可用余额；
					useableMoney = +useable_money.split(",").join("");
					$(".js-useable-money").html(useable_money);
					triggleAllMoney(null, useableMoney);
				}
			});
			//加息券
			$.ajax({
				type: "POST",
				url: "/yblapp/ws/invest/query_TicketListByUserId",
				dataType: "json",
				data: {
					couponStat: "1",
					goodTypeItem: "C00070202",
					productNo: proNo,
					pageNo: 1,
					pageSize: 100
				},
				success: function success(data) {
					console.log(data);
					var str = "",
					    headTickt = "",
					    ticketLen = 0;
					data.resultData.list.map(function (value, index) {
						if (value['GOODS_NO'] === 'EBL2016122600001') {
							headTickt += "\n\t\t\t\t\t\t\t<li class=\"head-ticket ticket-opacity js-ticket-item\" data-id = \"" + value.COUPON_NO + "\">\n\t\t\t\t\t\t\t\t<span class=\"ticket-item-logo ticket-choose-gray\"></span>\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t";
						} else {
							str += "\n\t\t\t\t\t\t\t<li class=\"ticket-item ticket-opacity js-ticket-item ticket-" + value.COUPON_RATE * 10 + "\" data-rate=\"" + value.COUPON_RATE + "\" data-id = \"" + value.COUPON_NO + "\">\n\t\t\t\t\t\t\t\t<span class=\"ticket-item-logo ticket-choose-gray\"></span>\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t";
						}

						ticketLen += 1;
					});
					if (ticketLen > 0) {
						$('.js-ticket-list').html(headTickt + str).css({
							"width": fontRate * (50 + 202) * ticketLen - fontRate * 50 + "px"
						});
						$(".jiaxi-num").html("有加息券可用");
						$(".js-jiaxi-box").click(function () {
							var ticketList = $('.js-ticket-list');
							if (ticketList.height() > 0) {
								ticketList.hide();
								$(".jiaxi-arrow").removeClass("arrow-position-y");
							} else {
								ticketList.show();
								$(".jiaxi-arrow").addClass("arrow-position-y");
							}
						});
					} else {
						$(".jiaxi-num").html("去获取加息券");
						$(".jiaxi-arrow").addClass("arrow-position-x");
						$(".js-jiaxi-box").click(function () {
							location.href = '/yblapp/mpbweb/html/elephant/elephant_shop.html';
						});
					}
				},
				error: function error() {
					console.log("获取加息券失败");
				}
			});
		};
		//项目详情
		if (proNo !== null && proNo.toString().length > 0) {
			$(".js-item-detail").click(function () {
				location.href = "/yblapp/mpbweb/html/invest/invest_details.html?productNo=" + proNo;
			});
		}
		//全部投资
		var allInvestMoney = function allInvestMoney(canInvest, userMoney) {
			var money = canInvest < userMoney ? canInvest : userMoney;
			var _investInput = $(".js-invest-input");
			_investInput.val(money);
			inputActive(_investInput);
		};
	}();

	// canInvestATM;//可投金额
	// useableMoney;//账户余额
	//输入框验证
	function inputActive(_investInput) {
		var temVal = _investInput.val().trim().match(/\d+/);
		var inputVal = temVal && temVal[0];
		if (inputVal > 0) {
			$(".js-invest-babel").hide();
			if (inputVal > +canInvestATM || inputVal > useableMoney) {
				inputVal = parseInt(Math.min(+canInvestATM, useableMoney), 10);
				console.log(+canInvestATM + "_" + useableMoney);
			}
			var result = _api2.default.NoToChinese(inputVal);
			$(".js-bignum").show().html(result + "整");
			_investInput.val(inputVal);
			console.log(result);
		} else {
			if (inputVal == "0") {
				inputVal = "";
			}
			_investInput.val(inputVal);
			$(".js-invest-babel").show();
			$(".js-bignum").hide();
		}

		if (+inputVal >= +leastATM) {
			$(".js-footer").addClass("selected").removeClass("unselected");
		} else {
			$(".js-footer").addClass("unselected").removeClass("selected");
		}
	}

	/*确认提醒消息框*/
	function boxMsg(arg) {
		$(".tips-msg").html(arg);
		$(".showMegCommon").removeClass("msgbox-hide");
	}
	//消息框隐藏
	$(".js-msg-box-hide").click(function () {
		$(".msgBox").hide();
		$(".showMegCommon").addClass("msgbox-hide");
	});

	!function () {
		var dataId = void 0; //加息券ID
		/*投资金额交互*/
		var _investInput = $(".js-invest-input");
		_investInput.on("input", function () {
			inputActive(_investInput);
		});
		//立即充值
		$(".js-recharge").click(function () {
			location.href = "/yblapp/mpbweb/html/user/recharge.html";
		});

		//选中加息券 这里和下面那个监听事件可以优化
		$(".js-ticket-list").on("click", ".ticket-item", function () {
			var _itemLogo = $(this).children('.ticket-choosed');
			$('.js-ticket-item').addClass('ticket-opacity');
			if (_itemLogo.length > 0) {
				dataId = "";
				_itemLogo.removeClass('ticket-choosed').addClass('ticket-choose-gray');
				$(".js-head-rate .vip-rate").html("");
			} else {
				$('.ticket-choosed').addClass('ticket-choose-gray').removeClass('ticket-choosed');
				$(this).removeClass('ticket-opacity');
				$(this).children('.ticket-item-logo').removeClass('ticket-choose-gray').addClass('ticket-choosed');
				var rate = $(this).data('rate');
				dataId = $(this).data("id");
				$(".js-head-rate .vip-rate").html("+" + rate + "%");
			}
		});
		$(".js-ticket-list").on("click", ".head-ticket", function () {
			$('.js-ticket-item').addClass('ticket-opacity');
			if ($(this).children(".ticket-choosed").length > 0) {
				dataId = "";
				$(this).children(".ticket-choosed").removeClass('ticket-choosed').addClass('ticket-choose-gray');
				$(".js-head-rate .vip-rate").html("");
			} else {
				$('.ticket-choosed').addClass('ticket-choose-gray').removeClass('ticket-choosed');
				$(this).removeClass('ticket-opacity');
				$(this).children('.ticket-item-logo').removeClass('ticket-choose-gray').addClass('ticket-choosed');
				var rate = 0.5;
				dataId = $(this).data("id");
				$(".js-head-rate .vip-rate").html("+" + rate + "%");
			}
		});

		//提交js-msg-box-hide
		$(".invest-content").on("click", ".selected", function () {
			$(".msgBox").show();
			$(".payment").removeClass("msgbox-hide");
			$(".payment-yzm-img").click();
		});
		$(".payment-yzm-img").click(function () {
			$(this).attr("src", "/yblweb/ws/common/query_PicVcode?" + new Date().getTime() + "");
		});
		//确定投资
		console.log(_api2.default.base64encode("a123456"));
		$(".js-sure-invert").click(function () {
			$(".payment").addClass("msgbox-hide");
			if (userTable.uCtype == 1 || userTable.uCtype == 2) {
				$.ajax({
					type: "POST",
					url: "/yblapp/ws/tradeConfirm/save_InvestTradeInfo",
					dataType: "json",
					data: {
						productNo: proNo,
						couponNo: dataId,
						tradeCostAmt: $('.js-invest-input').val(),
						payPassword: _api2.default.base64encode($(".js-payment-insert").val().trim())
					},
					success: function success(data) {
						console.log(data);
						if (data.resultCode === "10001") {
							$(".payment-head").append("<div class=\"tips-msg-yaoqing\">\u9080\u8BF7\u597D\u53CB\u6765\u6295\u8D44\uFF0C\u53EF\u9886\u53D6\u66F4\u591A\u5927\u8C61\u91D1\u5E01</div>");
							$(".js-msg-box-hide").unbind("click");
							$(".payment-foot-left").html("邀请好友").click(function (e) {
								e.stopPropagation();
								location.href = "/yblapp/mpbweb/html/user/invite.html";
							});
							$(".payment-foot-right").html("我的投资记录").click(function (e) {
								e.stopPropagation();
								location.href = "/yblapp/mpbweb/html/invest/project_invested_list.html?investState=1";
							});
							boxMsg("恭喜您，已成功投资");
						} else {
							boxMsg(data.resultInfo);
						}
					},
					error: function error() {
						console.log("投资提交错误");
					}
				});
			} else {
				boxMsg("融资方不允许投资");
			}
		});
		//取消提交
		$(".js-cancel-invert").click(function () {
			$(".msgBox").hide();
			$(".js-payment-insert").val("");
			$(".payment-yzm-input").val("");
		});
	}();

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	/*投资金额变中文数字大写*/
	function NoToChinese(num) {
		if (!/^\d*(\.\d*)?$/.test(num)) {
			return false;
		}
		var AA = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖");
		var BB = new Array("", "拾", "佰", "仟", "万", "亿", "点", "");
		var a = ("" + num).replace(/(^0*)/g, "").split("."),
		    k = 0,
		    re = "";
		for (var i = a[0].length - 1; i >= 0; i--) {
			switch (k) {
				case 0:
					re = BB[7] + re;break;
				case 4:
					if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0])) re = BB[4] + re;break;
				case 8:
					re = BB[5] + re;BB[7] = BB[5];k = 0;break;
			}
			if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re;
			if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;k++;
		}

		if (a.length > 1) //加上小数部分(如果有小数部分) 
			{
				re += BB[6];
				for (var i = 0; i < a[1].length; i++) {
					re += AA[a[1].charAt(i)];
				}
			}
		return re;
	}

	/*获取URL参数*/
	function GetQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);return null;
	}

	/*数字按三位切割*/
	function getDotNum(num) {
		var temp = String(num).split(".")[0];
		var cout = 3,
		    arr = [];
		var len = temp.length;
		if (len - 3 <= 0) {
			return num;
		}
		for (var i = -3; i > -len; i -= 3) {
			arr.push(temp.substr(i, 3));
		}
		if (arr.length * 3 !== len) {
			arr.push(temp.slice(0, len - arr.length * 3));
		}
		return arr.reverse().join(",");
	}

	//图片验证码
	function getCaptchaImg(captcha, cb) {
		var result = null;
		$.ajax({
			type: 'GET',
			dataType: 'json',
			data: { captcha: captcha },
			url: "/yblweb/ws/common/check_PicVcode",
			success: function success(data) {
				cb(data);
			},
			error: function error() {
				console.log("图片验证码请求错误");
			}
		});
	}

	//base64加密
	var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
	function base64encode(str) {
		var out, i, len;
		var c1, c2, c3;
		len = str.length;
		i = 0;
		out = "";
		while (i < len) {
			c1 = str.charCodeAt(i++) & 0xff;
			if (i == len) {
				out += base64EncodeChars.charAt(c1 >> 2);
				out += base64EncodeChars.charAt((c1 & 0x3) << 4);
				out += "==";
				break;
			}
			c2 = str.charCodeAt(i++);
			if (i == len) {
				out += base64EncodeChars.charAt(c1 >> 2);
				out += base64EncodeChars.charAt((c1 & 0x3) << 4 | (c2 & 0xF0) >> 4);
				out += base64EncodeChars.charAt((c2 & 0xF) << 2);
				out += "=";
				break;
			}
			c3 = str.charCodeAt(i++);
			out += base64EncodeChars.charAt(c1 >> 2);
			out += base64EncodeChars.charAt((c1 & 0x3) << 4 | (c2 & 0xF0) >> 4);
			out += base64EncodeChars.charAt((c2 & 0xF) << 2 | (c3 & 0xC0) >> 6);
			out += base64EncodeChars.charAt(c3 & 0x3F);
		}
		return out;
	}

	/*html font-size*/
	function rootSize() {
		return document.querySelector("html").style.fontSize;
	}

	exports.default = {
		/*prop*/

		/*method*/
		NoToChinese: NoToChinese,
		GetQueryString: GetQueryString,
		getDotNum: getDotNum,
		getCaptchaImg: getCaptchaImg,
		base64encode: base64encode,
		rootSize: rootSize
	};

/***/ }
/******/ ]);