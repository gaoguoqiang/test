//获取元素样式
function getStyle(obj,attr){
	return getComputedStyle(obj)?getComputedStyle(obj)[attr]:obj.currentStyle[attr]
}
//图片轮播效果或者动态改变元素样式
function doMove(obj,attr,dir,target,endFn){
	//obj是控制的对象；
	//attr是改变什么样式；
	//dir是改变的速度；
	//target是改变的目标；
	//endFn是停止后执行的函数
	//控制方向，如果当前位置小于目标位置是正数，反之是负数
	dir = parseInt(getStyle(obj,attr))<target?dir:-dir;
	clearInterval(obj.timer);//先清除定时器，以防多次点击重复开启定时器
	//alert(parseInt(getStyle(aImg,'top')))~~去除获取到的样式的单位（px）
	obj.timer = setInterval(function(){
		var speed = parseInt(getStyle(obj,attr)) + dir;
		if(speed>target&&dir>0||speed<target&&dir<0){
			speed = target;
		}
		obj.style[attr] = speed + 'px';
		if(speed==target){
			clearInterval(obj.timer);
			endFn&&endFn();
		}
	},50)
}
//抖动（上下左右，距离为固定的20px）
function shake(obj,arrt,endFn){
	//obj是操作的元素，arrt是抖动的方向（left/top），endFn是抖完后执行的函数，可以为无
	//开关用来控制不能重复点击，因为重复点击会导致获取到元素没有停下来时的位置，导致元素位置发生移动，
	obj.onOff = true;
	//pos是用来获取操作的元素的样式（当前位置）
	var pos = parseInt(getStyle(obj,arrt));
	//arr是用来存放抖动频率的数组[20，-20,18，-18......0]
	var arr = [];
	//num是用来获取样式的下标
	var num = 0;
	for(var i=20;i>0;i-=2){
		arr.push(i,-i);
	}
	arr.push(0);
	//执行定时器前先清除，以防多次点击重复开启定时器
	clearInterval(obj.shake);
	//obj.shake是一个自定义属性，用来管理定时器
	obj.shake = setInterval(function(){
		obj.style[arrt] = pos+arr[num]+'px';
		num++;
		if(num===arr.length){
			obj.onOff=false;
			clearInterval(obj.shake);
			endFn&&endFn();
		}
	},50)
}
//透明度函数封装
function opacity(obj,attr,target,endFn){
	/*
	obj是操作的元素；
	attr是速度，控制透明度以怎样的速度变化
	target是目标，控制透明度到达什么数值停止
	endFn是执行完毕后将要执行的函数
	 */
	//获取元素当前的透明度，如果当前透明度大于目标透明度，速度为负，反之为正
	attr = parseFloat(getStyle(obj,'opacity'))<target?attr:-attr;
	clearInterval(obj.opacity);
	obj.opacity = setInterval(function(){
		var opc = parseFloat(getStyle(obj,'opacity'));
		if(opc>=0&&opc<target||opc>=0&&opc>target){
			obj.style.opacity = opc+attr;
		}else if(opc===target){
			clearInterval(obj.opacity);
			endFn&&endFn();
		}
	},100)
}
//检测内容是不是纯数字，不可有字母，标点符号，空格
function deteNum(val){
	var n=0
	for(var i=0;i<val.length;i++){
		n=val.charCodeAt(i)
		if(n<48||n>57){
			return false;
		}
	}
	return true;
}