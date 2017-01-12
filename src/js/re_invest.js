/*"EBL2016122600001"*/
import Api from './api.js';
const fontRate = (+Api.rootSize.replace("px",""))/75;
let leastATM;//起投金额
let canInvestATM;//可投金额
let useableMoney;//账户余额
let proNo = Api.GetQueryString("productNo");; //项目索引
let userTable; //用户信息

//初始化
!(function(){
	$("input").val("");
	//用户登录
	$.ajax({
		type : 'POST',
		dataType : 'json',
		url :'/yblapp/ws/wxuser/query_UserLoginVld',
		success(data){
			console.log(data);
			if(!data){
				return false;
				location.href = '/yblapp/mpbweb/html/security/login_step1.html';
			}else{
				userTable = data;
				projectShow(data);
				userInvest();
			}
		},
		error(){
			console.log("用户登录失败")
		}
	});
	//项目信息展示
	const projectShow = function(useInfo){
		$.ajax({
			type:"POST",
			url:"/yblapp/ws/invest/query_InvestProductDeatil",
			dataType:"json",
			data:{
				productNo: proNo
			},
			success(data){
				console.log(data);
				canInvestATM = data.PRO_RAISE_AMT - data.PRO_REAL_RAISE_AMT;//可投金额
				leastATM = data.PRO_LEAST_AMT;//起投金额
				triggleAllMoney(canInvestATM,null);
				if(canInvestATM > 0){
					$(".js-head-title").html(data.PRO_NAME);
					// const vipRate =
					$(".js-head-rate .old-rate").html(`${data.PRO_YEAR_RATE}%+${parseFloat(useInfo.vipRate)>0?useInfo.vipRate:"vip"}%`);
					$(".js-repay-time").html(data.PRO_REPAY_TIME.split(" ")[0]);
					$(".js-can-invest").html(Api.getDotNum(canInvestATM));
				}else{
					boxMsg("该项目已经募集成功");
				}
			},
			error(){
				console.log("请求项目信息失败")
			}
		});
	}
	let can = null,usa = null;
	const triggleAllMoney = function(canInvestATM,usableMoney){
		can = can || canInvestATM;
		usa = usa || usableMoney;
		if(can && usa){
			$(".js-insert-all-money").click(function(){
				allInvestMoney(can,usa);
			})
		}
	}
	//用户账户信息
	const userInvest = function(){
		$.ajax({
			type:"POST",
			url:"/yblapp/ws/member/query_InvestAccountInfoByUserId",
			dataType:"json",
			success(data){
				console.log(data);
				const useable_money = JSON.parse(data.resultData).usableMoney; //个人账户可用余额；
				useableMoney = +useable_money.split(",").join("");
				$(".js-useable-money").html(useable_money);
				triggleAllMoney(null,useableMoney)
			}
		});
		//加息券
		$.ajax({
			type:"POST",
			url:"/yblapp/ws/invest/query_TicketListByUserId",
			dataType:"json",
			data:{
				couponStat:"1",
				goodTypeItem:"C00070202",
				productNo:proNo,
				pageNo:1,
				pageSize:100
			},
			success(data){
				console.log(data);
				let str = "",headTickt = "",ticketLen=0;
				data.resultData.list.map( (value,index) => {
					if(value['GOODS_NO'] === 'EBL2016122600001'){
						headTickt += `
							<li class="head-ticket ticket-opacity js-ticket-item" data-id = "${value.COUPON_NO}">
								<span class="ticket-item-logo ticket-choose-gray"></span>
							</li>
						`;
					}else{
						str += `
							<li class="ticket-item ticket-opacity js-ticket-item ticket-${value.COUPON_RATE*10}" data-rate="${value.COUPON_RATE}" data-id = "${value.COUPON_NO}">
								<span class="ticket-item-logo ticket-choose-gray"></span>
							</li>
						`;
					}
					
					ticketLen += 1;
				});
				if(ticketLen > 0){
					$('.js-ticket-list').html(headTickt+str).css({
						"width": (fontRate*(50+202)*ticketLen - fontRate*50)+"px"
					});
					$(".jiaxi-num").html("有加息券可用");
					$(".js-jiaxi-box").click(function(){
						const ticketList = $('.js-ticket-list');
						if(ticketList.height()>0){
							ticketList.hide();
							$(".jiaxi-arrow").removeClass("arrow-position-y");
						}else{
							ticketList.show();
							$(".jiaxi-arrow").addClass("arrow-position-y");
						}
					});
				}else{
					$(".jiaxi-num").html("去获取加息券");
					$(".jiaxi-arrow").addClass("arrow-position-x");
					$(".js-jiaxi-box").click(function(){
						location.href = '/yblapp/mpbweb/html/elephant/elephant_shop.html';
					});
				}
			},
			error(){
				console.log("获取加息券失败")
			}
		});
	}
	//项目详情
	if(proNo !== null && proNo.toString().length > 0){
		$(".js-item-detail").click(function(){
			location.href = `/yblapp/mpbweb/html/invest/invest_details.html?productNo=${proNo}`;
		});
	}
	//全部投资
	const allInvestMoney = function(canInvest,userMoney){
		const money = canInvest < userMoney ? canInvest : userMoney;
		const _investInput = $(".js-invest-input");
		_investInput.val(money);
		inputActive(_investInput);
	}
	

})();

// canInvestATM;//可投金额
// useableMoney;//账户余额
//输入框验证
function inputActive(_investInput){
	let temVal = _investInput.val().trim().match(/\d+/);
	let inputVal = temVal && temVal[0];
	if(inputVal > 0){
		$(".js-invest-babel").hide();
		if(inputVal > +canInvestATM || inputVal > useableMoney){
			inputVal = parseInt(Math.min(+canInvestATM,useableMoney),10);
			console.log(+canInvestATM+"_"+useableMoney);
		}
		let result = Api.NoToChinese(inputVal);
		$(".js-bignum").show().html(result+"整");
		_investInput.val(inputVal);
		console.log(result);
	}else{
		if(inputVal == "0"){
			inputVal = "";
		}
		_investInput.val(inputVal);
		$(".js-invest-babel").show();
		$(".js-bignum").hide();
	}

	if(+inputVal >= +leastATM){
		$(".js-footer").addClass("selected").removeClass("unselected");
	}else{
		$(".js-footer").addClass("unselected").removeClass("selected");
	}
}

/*确认提醒消息框*/
function boxMsg(arg){
	$(".tips-msg").html(arg);
	$(".showMegCommon").removeClass("msgbox-hide");
}
//消息框隐藏
$(".js-msg-box-hide").click(function(){
	$(".msgBox").hide();
	$(".showMegCommon").addClass("msgbox-hide");
});


!(function(){
	let dataId; //加息券ID
	/*投资金额交互*/
	const _investInput = $(".js-invest-input");
	_investInput.on("input",function(){
		inputActive(_investInput);
	});
	//立即充值
	$(".js-recharge").click(function(){
		location.href = "/yblapp/mpbweb/html/user/recharge.html";
	});

	//选中加息券 这里和下面那个监听事件可以优化
	$(".js-ticket-list").on("click",".ticket-item",function(){
		const _itemLogo = $(this).children('.ticket-choosed');
		$('.js-ticket-item').addClass('ticket-opacity');
		if(_itemLogo.length > 0){
			dataId = "";
			_itemLogo.removeClass('ticket-choosed').addClass('ticket-choose-gray');
			$(".js-head-rate .vip-rate").html("");
		}else{
			$('.ticket-choosed').addClass('ticket-choose-gray').removeClass('ticket-choosed');
			$(this).removeClass('ticket-opacity');
			$(this).children('.ticket-item-logo').removeClass('ticket-choose-gray').addClass('ticket-choosed');
			const rate = $(this).data('rate');
			dataId = $(this).data("id");
			$(".js-head-rate .vip-rate").html(`+${rate}%`);
		}
	});
	$(".js-ticket-list").on("click",".head-ticket",function(){
		$('.js-ticket-item').addClass('ticket-opacity');
		if($(this).children(".ticket-choosed").length > 0){
			dataId = "";
			$(this).children(".ticket-choosed").removeClass('ticket-choosed').addClass('ticket-choose-gray');
			$(".js-head-rate .vip-rate").html("");
		}else{
			$('.ticket-choosed').addClass('ticket-choose-gray').removeClass('ticket-choosed');
			$(this).removeClass('ticket-opacity');
			$(this).children('.ticket-item-logo').removeClass('ticket-choose-gray').addClass('ticket-choosed');
			const rate = 0.5;
			dataId = $(this).data("id");
			$(".js-head-rate .vip-rate").html(`+${rate}%`);
		}
	});


	//提交js-msg-box-hide
	$(".invest-content").on("click",".selected",function(){
		$(".msgBox").show();
		$(".payment").removeClass("msgbox-hide");
		$(".payment-yzm-img").click();
	});
	$(".payment-yzm-img").click(function(){
		$(this).attr("src","/yblweb/ws/common/query_PicVcode?"+new Date().getTime()+"");
	});
	//确定投资
	console.log(Api.base64encode("a123456"));
	$(".js-sure-invert").click(function(){
		$(".payment").addClass("msgbox-hide");
		if(userTable.uCtype==1||userTable.uCtype==2){
			$.ajax({
				type:"POST",
				url:"/yblapp/ws/tradeConfirm/save_InvestTradeInfo",
				dataType:"json",
				data:{
					productNo:proNo,
					couponNo:dataId,
					tradeCostAmt:$('.js-invest-input').val(),
					payPassword:Api.base64encode($(".js-payment-insert").val().trim())
				},
				success(data){
					console.log(data);
					if(data.resultCode === "10001"){
						$(".payment-head").append(`<div class="tips-msg-yaoqing">邀请好友来投资，可领取更多大象金币</div>`);
						$(".js-msg-box-hide").unbind("click");
						$(".payment-foot-left").html("邀请好友").click(function(e){
							e.stopPropagation();
							location.href= "/yblapp/mpbweb/html/user/invite.html";
						});
						$(".payment-foot-right").html("我的投资记录").click(function(e){
							e.stopPropagation();
							location.href= "/yblapp/mpbweb/html/invest/project_invested_list.html?investState=1";
						});
						boxMsg("恭喜您，已成功投资");

					}else{
						boxMsg(data.resultInfo);
					}
				},
				error(){
					console.log("投资提交错误")
				}
			});
		}else{
			boxMsg("融资方不允许投资");
		}
	});
	//取消提交
	$(".js-cancel-invert").click(function(){
		$(".msgBox").hide();
		$(".js-payment-insert").val("");
		$(".payment-yzm-input").val("");
	});
})();




