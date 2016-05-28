
window.onload = function(){
	mv.app.toTip();
	mv.app.banner();
	mv.app.pullDown();
	mv.app.scorllPic();
}

var mv = {};  //命名空间

mv.ui = {};

//焦点事件
mv.ui.textChange = function(obj,str){
	obj.onfocus = function(){
		if(this.value == str){
			this.value = '';
		}
	}
	obj.onblur = function(){
		if(this.value == ''){
			this.value = str;
		}
	}
}
//淡入
mv.ui.fadeIn = function(obj){
	var iCou = mv.tools.getStyle(obj,'opacity');
	if(iCou == 1){
		return false;
	}
	var alpha = 0;
	var iSpeed = 5;
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		
		if(alpha == 100){
			clearInterval(obj.timer);
		}else{
			alpha+=iSpeed;
			obj.style.opacity = alpha/100;
			obj.style.filter = 'alpha(opacity='+alpha+')';
		}		
	},30)
}
//淡出
mv.ui.fadeOut = function(obj){
	var iCou = mv.tools.getStyle(obj,'opacity');
	if(iCou == 0){
		return false;
	}
	var alpha = 100;
	var iSpeed = -5;
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		
		if(alpha == 0){
			clearInterval(obj.timer);
		}else{
			alpha+=iSpeed;
			obj.style.opacity = alpha/100;
		obj.style.filter = 'alpha(opacity='+alpha+')';
		}
	},30)
}
//图片滚动
mv.ui.scrollPhoto = function(obj,now,target){
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		var iSpeed = (target-now)/10;
		iSpeed = iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);
		if(target == now){
			clearInterval(obj.timer);
		}else{
			now += iSpeed;
			obj.style.marginLeft = now + 'px';
		}
	},30)
}

mv.tools = {};
//获取class
mv.tools.getByClass = function(parent,sClass){
	var aEls = parent.getElementsByTagName('*');
	var arr = [];
	for(var i=0;i<aEls.length;i++){
		if(aEls[i].className == sClass){
			arr.push(aEls[i])
		}
	}
	return arr;
}
//获取样式
mv.tools.getStyle = function(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}else{
		return getComputedStyle(obj)[attr];
	}
}

mv.app = {};

//搜索框焦点事件
mv.app.toTip = function(){
	var oText1 = document.getElementById('text1');
	var oText2 = document.getElementById('text2');

	mv.ui.textChange(oText1,'Search website');
	mv.ui.textChange(oText2,'Search website');

}
//banner效果
mv.app.banner = function(){
	var oAd = document.getElementById('ad');
	var aLi = oAd.getElementsByTagName('li');

	var oPrey = mv.tools.getByClass(oAd,'prey')[0];
	var oNext = mv.tools.getByClass(oAd,'next')[0];
	var oPreyBg = mv.tools.getByClass(oAd,'prey_bg')[0];
	var oNextBg = mv.tools.getByClass(oAd,'next_bg')[0];

	var iNow = 0;
	var timer = setInterval(auto,3000);
	function auto(){
		for(var i=0;i<aLi.length;i++){
			mv.ui.fadeOut(aLi[i]);
		}
		if(iNow == aLi.length-1){
			iNow = 0;
		}else{
			iNow ++ ;
		}
		mv.ui.fadeIn(aLi[iNow]);
	}
	function autoPrey(){
		for(var i=0;i<aLi.length;i++){
			mv.ui.fadeOut(aLi[i]);
		}
		if(iNow == 0){
			iNow = aLi.length-1;
		}else{
			iNow -- ;
		}
		mv.ui.fadeIn(aLi[iNow]);
	}

	oPreyBg.onmouseover = oPrey.onmouseover = function(){
		oPrey.style.display = 'block';
		clearInterval(timer);
	}
	oNextBg.onmouseover = oNext.onmouseover = function(){
		oNext.style.display = 'block';
		clearInterval(timer);
	}
	oPreyBg.onmouseout = oPrey.onmouseout = function(){
		oPrey.style.display = 'none';
		timer = setInterval(auto,3000);
	}
	oNextBg.onmouseout = oNext.onmouseout = function(){
		oNext.style.display = 'none';
		timer = setInterval(auto,3000);
	}

	oPrey.onclick = function(){
		autoPrey();
	}
	oNext.onclick = function(){
		auto();
	}
}
//下拉菜单
mv.app.pullDown = function(){
	var oPullDown = document.getElementById('pull_down');
	var aDd = oPullDown.getElementsByTagName('dd');
	var aUl = oPullDown.getElementsByTagName('ul');
	var aH2 = oPullDown.getElementsByTagName('h2');

	for(var i=0;i<aDd.length;i++){
		aDd[i].index = i;
		aDd[i].onclick = function(ev){
			var ev = ev || event;
			var This = this.index;
			for(var i=0;i<aUl.length;i++){
				aUl[i].style.display = 'none';
			}
			aUl[this.index].style.display = 'block';
			document.onclick = function(){
				aUl[This].style.display = 'none';
			}
			ev.cancelBubble = true;
		}
	}
	for(var i=0;i<aUl.length;i++){
		aUl[i].index = i;
		(function(ul){
			var aLi = ul.getElementsByTagName('li');
			for(var i=0;i<aLi.length;i++){
				aLi[i].onmouseover = function(){
					this.className = 'active';
				}
				aLi[i].onmouseout = function(){
					this.className = '';
				}
				aLi[i].onclick = function(ev){
					var ev = ev || event;
					aH2[this.parentNode.index].innerHTML = this.innerHTML;
					this.parentNode.style.display = 'none';
					ev.cancelBubble = true;
				}
			}
		})(aUl[i]);
	}
}
//图片无缝滚动
mv.app.scorllPic = function(){
	var oscorllPic = document.getElementById('scorll_pic');
	var oPrey = mv.tools.getByClass(oscorllPic,'prey')[0];
	var oNext = mv.tools.getByClass(oscorllPic,'next')[0];
	var oUl = oscorllPic.getElementsByTagName('ul')[0];
	var aLi = oUl.getElementsByTagName('li');

	var iNow = 0;

	oUl.innerHTML += oUl.innerHTML;
	oUl.style.width = aLi.length*aLi[0].offsetWidth+'px';
	oPrey.onclick = function(){
		if(iNow == 0){
			oUl.style.marginLeft = aLi.length/2+'px';
			iNow=aLi.length/2;
		}
		mv.ui.scrollPhoto(oUl,-iNow*aLi[0].offsetWidth,-(iNow-1)*aLi[0].offsetWidth);
		iNow--;
	}
	oNext.onclick = function(){
		if(iNow == aLi.length/2){
			oUl.style.marginLeft = 0;
			iNow=0;
		}
		mv.ui.scrollPhoto(oUl,-iNow*aLi[0].offsetWidth,-(iNow+1)*aLi[0].offsetWidth);
		iNow++;
	}

}












