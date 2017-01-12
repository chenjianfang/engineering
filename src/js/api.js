/*投资金额变中文数字大写*/
function NoToChinese(num) {
	if (!/^\d*(\.\d*)?$/.test(num)) {return false; }
	var AA = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); 
	var BB = new Array("", "拾", "佰", "仟", "万", "亿", "点", ""); 
	var a = ("" + num).replace(/(^0*)/g, "").split("."), k = 0, re = ""; 
	for (var i = a[0].length - 1; i >= 0; i--) { 
	switch (k) { 
	case 0: re = BB[7] + re; break; 
	case 4: if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0])) 
	re = BB[4] + re; break; 
	case 8: re = BB[5] + re; BB[7] = BB[5]; k = 0; break; 
	} 
	if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re; 
	if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re; k++; 
	} 

	if (a.length > 1) //加上小数部分(如果有小数部分) 
	{ 
	re += BB[6]; 
	for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)]; 
	} 
	return re; 
}

/*获取URL参数*/
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

/*数字按三位切割*/
function getDotNum(num){
	const temp = String(num).split(".")[0];
	const cout = 3, arr = [];
	const len = temp.length;
	if(len - 3 <= 0){
		return num;
	}
	for(let i = -3; i > -len; i-=3){
		arr.push(temp.substr(i,3));
	}
	if(arr.length*3 !== len){
		arr.push(temp.slice(0,len-arr.length*3));
	}
	return arr.reverse().join(",");
}

//图片验证码
function getCaptchaImg(captcha,cb){
	var result =null;
	$.ajax({
		type : 'GET',
		dataType : 'json',
		data :{captcha:captcha},
		url :"/yblweb/ws/common/check_PicVcode",
		success : function(data)
		{
			cb(data)
		},
		error(){
			console.log("图片验证码请求错误")
		}
	});
}

//base64加密
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
function base64encode(str){
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
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}


/*html font-size*/
function rootSize(){
	return document.querySelector("html").style.fontSize;
}

export default {
	/*prop*/
	

	/*method*/
	NoToChinese,
	GetQueryString,
	getDotNum,
	getCaptchaImg,
	base64encode,
	rootSize,
}



