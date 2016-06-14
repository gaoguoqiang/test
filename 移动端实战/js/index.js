// JavaScript Document
function id(obj) {
    return document.getElementById(obj);
}
function bind(obj, ev, fn) { 
    if (obj.addEventListener) {
        obj.addEventListener(ev, fn, false);
    } else {
        obj.attachEvent('on' + ev, function() {
            fn.call(obj);
        });
    }
}
function view() {
    return {
        w: document.documentElement.clientWidth,
        h: document.documentElement.clientHeight
    };
}
function addClass(obj, sClass) { 
    var aClass = obj.className.split(' ');
    if (!obj.className) {
        obj.className = sClass;
        return;
    }
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) return;
    }
    obj.className += ' ' + sClass;
}

function removeClass(obj, sClass) { 
    var aClass = obj.className.split(' ');
    if (!obj.className) return;
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) {
            aClass.splice(i, 1);
            obj.className = aClass.join(' ');
            break;
        }
    }
}

function fnLoad() {
	/*
	1：判断开场动画是否完成，以及之后页面的图片是否加载完成
	2：也可以给一个固定时间，时间到了之后跳转到下一页面（不推荐）
	a：页面加载完成后获取一个时间：iTime；
	b：开定时器判断当前所用时间；如果超过动画完成所需的时间；bTime = true;(bTime是确定动画是否完成的开关)；
	c：bImgLoad是判断图片是否加载完成的开关；
	d：当开场动画和图片加载完成之后，跳转页面
	 */
	var iTime = new Date().getTime();
	var oW = id('welcome');
	var arr = [];
	var bImgLoad = true;
	var bTime = false;
	var timer = null;
	bind(oW,'transitionend',end);
	bind(oW,'WebkitTransitionEnd',end);

	timer = setInterval(function(){
		if(new Date().getTime()-iTime >= 5000){
			bTime = true;
		}
		if(bImgLoad&&bTime){
			clearInterval(timer);
			oW.style.opacity = 0;
		}
	},1000);
	function end(){
		removeClass(oW,'page_show');
		fnTab();
	}


	// for(var i=0;i<arr.length;i++){
	// 	var oImg = new Image();
	// 	oImg.src = arr[i];
	// 	oImg.onload = function(){

	// 	}
	// }
}

//阻止默认touchmove事件

function fnTab(){
	var oTab = id('tab_pic');
	var oList = id('pic_list');
	var aNav = oTab.getElementsByTagName('nav')[0].children;
	var iNow = 0;
	var iX = 0;
	var iW = view().w;
	var timer = null;
	var iStartTouchX = 0;
	var iStartX = 0;
	
	
	bind(oTab,'touchstart',fnStart);
	bind(oTab,'touchmove',fnMove);
	bind(oTab,'touchend',fnEnd);
	auto();
	if(!window.bfnScore){
		fnScore();
		window.bfnScore = true;
	}
	
	function auto(){
		timer = setInterval(function(){
			iNow++;
			iNow = iNow%aNav.length;
			tab();
		},3000);
	}
	
	function fnStart(ev){
		oList.style.transition = 'none';
		ev = ev.changedTouches[0];
		iStartTouchX = ev.pageX;
		iStartX = iX;
		
		clearInterval(timer);
	}
	function fnMove(ev){
		ev = ev.changedTouches[0];
		var iDis = ev.pageX - iStartTouchX;
		iX = iStartX + iDis;
		oList.style.WebkitTransform = oList.style.transform = 'translateX('+iX+'px)';
	}
	function fnEnd(){
		//iNow = Math.abs(iX/iW);
		iNow = iX/iW;
		iNow = -Math.round(iNow);
		if(iNow<0){
			iNow = 0;
		}
		if(iNow>aNav.length-1){
			iNow = aNav.length-1;
		}
		tab();
		auto();
	}
	function tab(){
		iX=-iNow*iW;
		oList.style.transition = '1s';
		oList.style.WebkitTransform = oList.style.transform = 'translateX('+iX+'px)';
		for(var i=0;i<aNav.length;i++){
			removeClass(aNav[i],'active');
		}
		addClass(aNav[iNow],'active');
	}
}

function fnScore(){
	var oScore = id('score');
	var aLi = oScore.getElementsByTagName('li');
	var arr = ['很差','较差','一般','良好','优秀'];

	for(var i=0;i<aLi.length;i++){
		fn(aLi[i]);
	}
	function fn(oLi){
		var aNav = oLi.getElementsByTagName('a');
		var oInput = oLi.getElementsByTagName('input')[0];
		for( var i=0;i<aNav.length;i++){
			aNav[i].index = i;
			bind(aNav[i],'touchstart',function(){
				for(var i=0;i<aNav.length;i++){
					if(i<=this.index){
						addClass(aNav[i],'active');
					}else{
						removeClass(aNav[i],'active');
					}
				}
				oInput.value = arr[this.index];
			})
		}
	}
	if(!window.bfnIndex){
		fnIndex();
		window.bfnIndex = true;
	}
	
}
function fnInfo(oInfo,sInfo){
	oInfo.innerHTML = sInfo;
	oInfo.style.WebkitTransform = oInfo.style.transform = "scale(1)";
	oInfo.style.opacity = 1;
	setTimeout(function(){
		oInfo.style.WebkitTransform = oInfo.style.transform = "scale(0)";
		oInfo.style.opacity = 0;
	},1000)
}
function fnIndex(){
	var oIndex = id('index');
	var oBtn = oIndex.getElementsByClassName('btn')[0];
	var oInfo = oIndex.getElementsByClassName('info')[0];
	var bScore=false;
	bind(oBtn,'touchend',fnEnd);
	function fnEnd(){
		bScore = fnScoreChecked();
		if(bScore){
			if(bTag()){
				fnIndexOut();
			}else{
				fnInfo(oInfo,'请给景区添加标签');	
			}
		}else{
			fnInfo(oInfo,'请给景区评分');
		}
	}
	function fnScoreChecked(){
		var oScore = id('score');
		var aInput = oScore.getElementsByTagName('input');
		for( var i=0;i<aInput.length;i++){
			if(aInput[i].value == 0){
				return false;
			}
		}
		return true;
	}
	function bTag(){
		var oTag = id('index_tag');
		var aInput = oTag.getElementsByTagName('input');
		for( var i=0;i<aInput.length;i++){
			if(aInput[i].checked){
				return true;
			}
		}
		return false;
	}
}
function fnIndexOut(){
	var oMask = id('mask');
	var oIndex = id('index');
	var oNews = id('news');
	addClass(oMask,'page_show');
	addClass(oNews,'page_show');
	if(!window.bfnNews){
		fnNews();
		window.bfnNews = true;
	}
	
	setTimeout(function(){
		oMask.style.opacity = 1;
		oIndex.style.WebkitFilter = oIndex.style.filter = 'blur(5px)';
	},20)
	setTimeout(function(){
		oNews.style.transition = '0.5s';
		oMask.style.opacity = 0;
		oIndex.style.WebkitFilter = oIndex.style.filter = 'blur(0px)';
		oNews.style.opacity = 1;
		removeClass(oMask,'page_show');

	},3000)
	
}

function fnNews(){
	var oNews = id('news');
	var oInfo = oNews.getElementsByClassName('info')[0];
	var aInput = oNews.getElementsByTagName('input');
	aInput[0].onchange = function(){
		if(this.files[0].type.split('/')[0] == 'video'){
			fnNewsOut();
			this.value = '';
		}else{
			fnInfo(oInfo,'请上传视频格式的文件')
		}
	}
	aInput[1].onchange = function(){
		if(this.files[0].type.split('/')[0] == 'image'){
			fnNewsOut();
			this.value = '';
		}else{
			fnInfo(oInfo,'请上传图片格式的文件')
		}
	}
}
function fnNewsOut(){
	var oNews = id('news');
	var oForm = id('form');
	addClass(oForm,'page_show');
	oNews.style.cssText = '';
	removeClass(oNews,'page_show');
	if(!window.bformIn){
		formIn();
		window.bformIn = true;
	}
	

}

function formIn(){
	var oForm = id('form');
	var oOver = id('over');
	var aFormTag = id('form_tag').getElementsByTagName('label');
	var oBtn = oForm.getElementsByClassName('btn')[0];
	var onOff = false;

	for(var i=0;i<aFormTag.length;i++){
		bind(aFormTag[i],'touchend',function(){
			onOff = true;
			addClass(oBtn,'submit');
		})
	}
	bind(oBtn,'touchend',function(){
		if(onOff){
			for(var i=0;i<aFormTag.length;i++){
				aFormTag[i].getElementsByTagName('input')[0].checked = false;
			}
			onOff = false;
			addClass(oOver,'page_show');
			removeClass(oForm,'page_show');
			removeClass(oBtn,'submit');
			if(!window.bover){
				over();
				window.bover = true;
			}
			
		}
	})
}

function over(){
	var oOver = id('over');
	var oBtn = oOver.getElementsByClassName('btn')[0];
	bind(oBtn,'touchend',function(){
		removeClass(oOver,'page_show');
	})
	
}














