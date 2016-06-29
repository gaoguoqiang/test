//获取元素样式
function getStyle(obj,attr){
	return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj)[attr]
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
	
	有兼容问题，ie无法使用
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
			//obj.style.filter = 'alpha(opacity='+opc+attr*100+')';
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
//拖拽
function drag(obj){

	obj.onmousedown = function(ev){
		var ev = ev || event;
		//鼠标的实时位置-操作对象距离窗口的位置
		var disX = ev.clientX - this.offsetLeft;
		var disY = ev.clientY - this.offsetTop;
		//设置全局捕获~~~非标准ie解决办法
		//全局捕获：任何事件都会被捕获到设置全局捕获的对象身上
		if(obj.setCapture){
			obj.setCapture()
		}
		document.onmousemove = function(ev){
			var ev = ev || event;
			//操作对象的位置=鼠标的实时位置-鼠标距离操作对象的边缘位置
			obj.style.left = ev.clientX - disX + 'px';
			obj.style.top = ev.clientY - disY + 'px';
		}
		document.onmouseup = function(){
			document.onmousemove = null;
			//释放全局捕获
			if(obj.releaseCapture){
				obj.releaseCapture();
			}
		}
		//阻止窗口的默认拖拽事件
		return false;
	}
}

function startMove(obj,json,endFn){
	//obj是控制的对象；
	//attr是改变什么样式；
	//target是改变的目标；
	//endFn是停止后执行的函数
	//先清除定时器，以防多次点击重复开启定时器
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		//onoff是开关，用来检测是否所有的运动都已完成，初始值为true
		var onOff = true;
		//遍历json：attr是json的“下标”，也就是要改变的样式{width：200}//////{attr：json[attr]}
		for(var attr in json){
			var curn = 0;
			//获取元素属性
			if(attr == 'opacity'){
				//透明度的值在标准下是0~1的小数，ie下是0~100的整数，而此处获取到的值为小数，所以*100，变为0~100的整数
				//为了处理小数带来的bug，所以转型为整数
				curn = parseInt(parseFloat(getStyle(obj,attr))*100);
			}else{
				curn = parseInt(getStyle(obj,attr));
			}
			//获取速度：(目标值-当前值)/8，得到一个越靠近目标点，越小的值
			var speed = (json[attr]-curn)/8;
			//小数会带来不能精确地bug，所以要取整
			//当速度为正的时候，向上取整，反之向下取整
			speed = speed>0?Math.ceil(speed):Math.floor(speed);
			//检测是否所有的运动都已完成，如果其中一个没有完成，开关的值为false
			if(curn!=json[attr]){
				onOff = false;
			}
			if(attr == 'opacity'){
				obj.style.opacity = (curn + speed)/100;
				obj.style.filter = 'alpha(opacity='+(curn + speed)+')';
			}else{
				obj.style[attr] = curn + speed + 'px';
			}
		}
		if(onOff){
			clearInterval(obj.timer);
			endFn&&endFn();
		}
		
	},30)
}





















