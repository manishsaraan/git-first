/**
 * XSlide
 * @version 1.1.0
 * @update 2019/06/05
 * https://github.com/aiv367/jquery.xslider
 */
class XSlider {

	constructor(opts) {

		let that = this;

		//保存实例，防止重复对一个dom实例化
		let thisInstance = $(opts.el).data('xslider-instance');
		if(thisInstance){
			thisInstance.setOptions(opts);
			return thisInstance;
		}
		$(opts.el).data('xslider-instance', this);

		this.opts = $.extend(true, {
			
			el: '',							// 设置组件实例化dom
			min: 0,							// 最小值
			max: 0,							// 最大值
			value: 0,						// 当前值
			step: 1,						// 移动步长
			width: '',						// 宽度，默认自适应 el dom 容器宽度
			height: '',						// 宽度，默认自适应 el dom 容器高度
			className: '',					// 用户自定义样式, 内置了一个 mobile 样式

			isVertical: false,				// 是否是垂直

			handleAutoSize: true,			// 滑块尺寸随数据量自动变化
			handleAutoSizeMin: 10,			// 滑块最小尺寸，仅在 handleAutoSize = true 时有效
			handleWidth: 10,				// 滑块宽度
			handleHeight: 10,				// 滑块高度
			handleWrapperSideStart: 0,		// 滑块容器起始距离
			handleWrapperSideEnd: 0,		// 滑块容器结束距离
			bgSideStart: 0,					// 背景容器起始距离
			bgSideEnd: 0,					// 背景容器结束距离

			clickToChange: true,			// 单击滑道改变值

			tooltip: true,					// 是否显示tooltip
			tooltipOffset: 3,				// tooltip 显示偏移量
			tooltipDirection: '',			// tooltip 方向. top bottom left right

			//格式化输出 tooltip
			tooltipFormat(value){
				return value.toFixed(that.precision) + '/' + that.opts.max.toFixed(that.precision);
			},

			autoScroll: true,				// 滑块自动滚动到准确位置
			autoScrollDelayTime: 250,		// 滑块自动滚动时间(ms),仅在 autoScroll = true 时有效

			initRunOnChange: true,			// 初始化时执行 onChange
			isStopEvent: false,				// 是否阻止事件冒泡

			onChange(val) {},				// 值变化过程事件回调
			onChangeEnd(val){},				// 值变化结束事件回调

		}, opts);

		if(this.opts.tooltipDirection === ''){
			this.opts.tooltipDirection = this.opts.isVertical ? 'right': 'top'
		}

		this.stepNums = 0;//刻度数量
		this.precision = 0;//素值精度
		this.isDrag = false;
		this.disabled = false;

		this.$bg = undefined;
		this.$handleWrapper = undefined;
		this.$handle = undefined;
		this.$body = $('body');
		this.$root = $(window);

		this._initElement();
		this._initEvent();
		this.setOptions(this.opts);

		//为了在初始化值时，不要动画效果
		setTimeout(() => this.$handle.attr('data-isdrag', 'false'), 100);

	}

	_initElement() {

		this.$el = $(this.opts.el);

		this.$wrapper = $(`
			<div class="xslide">
				<div class="xslide-bg"></div>
				<div class="xslide-handle-wrapper">
					<div class="xslide-handle" data-isdrag="none"></div>
				</div>
			</div>
		`);

		this.$bg = this.$wrapper.find('.xslide-bg');
		this.$handleWrapper = this.$wrapper.find('.xslide-handle-wrapper');
		this.$handle = this.$wrapper.find('.xslide-handle');

		this.$el.append(this.$wrapper);
		this.$body.append(this.$tooltip);

	}

	_initEvent() {

		let that = this;

		this.$root.on('resize', function(){
			that.resize();
		});

		//handle 滑块拖拽
		this.$handle.on('touchstart mousedown', function(evt){

			evt.preventDefault();

			if(that.opts.min === that.opts.max || that.disabled){
				return;
			}

			let $this = $(this);
			let dragEvent = evt.type === "touchstart" ? evt.touches[0] : evt;
			let handleOffset = $this.offset();

			//偏移数据
			let positionStart = {
				left: dragEvent.pageX - handleOffset.left,
				top: dragEvent.pageY - handleOffset.top
			};

			//设置当前位拖拽中标记
			$this.attr('data-isdrag', 'true');
			that.isDrag = true;

			function drawMove(evt){

				let dragEvent = evt.type === "touchmove" ? evt.touches[0] : evt;
				let position = {
					left: dragEvent.pageX - positionStart.left - that.$handleWrapper.offset().left,
					top: dragEvent.pageY - positionStart.top - that.$handleWrapper.offset().top
				};

				//坐标越界处理
				if(position.left < 0){
					position.left = 0;
				}else if(position.left + $this.width() > that.$handleWrapper.width()){
					position.left = that.$handleWrapper.width() - $this.outerWidth();
				}

				if(position.top < 0){
					position.top = 0;
				}else if(position.top + $this.height() > that.$handleWrapper.height()){
					position.top = that.$handleWrapper.height() - $this.outerHeight();
				}

				//设置 handle 位置
				if(!that.opts.isVertical){
					$this.css('left', position.left);
				}else{
					$this.css('top', position.top);
				}

				//设置值
				that.setValue(that._getHandlePositionValue(position.left, position.top), false);

				//tooltip
				if(that.opts.tooltip){
					let tooltipPosition = that._getTooltipPositionForHandle();
					that._tooltip(true, tooltipPosition.left, tooltipPosition.top, that.opts.tooltipFormat(that.opts.value));
				}

			}

			function drawEnd(evt){

				$this.attr('data-isdrag', 'false');
				that.isDrag = false;
				that.$root.off('touchmove mousemove', drawMove);
				that.$root.off('touchend mouseup', drawEnd);

				//如果鼠标不再内部，就取消tooltip显示
				if(that.opts.tooltip) {
					if (evt.touches || !$(evt.target).closest(that.$wrapper).length) {
						that._tooltip(false);
					}
				}

				//自动滚动到标准位置
				if(that.opts.autoScroll){
					if(evt.touches || !$(evt.target).closest(that.$wrapper).length){
						that._handleScrollToValuePosition();
					}
				}

				that.opts.onChangeEnd(that.opts.value);

			}

			that.$root.on('touchmove mousemove', drawMove);
			that.$root.on('touchend mouseup', drawEnd);

			if(that.opts.isStopEvent){
				evt.stopPropagation();
			}

		});

		//滑道单击
		this.$handleWrapper
			.on('touchstart mousedown', function (evt) {

				if(!that.opts.clickToChange || that.disabled){
					return;
				}

				let dragEvent = evt.touches ? evt.touches[0] : evt;
				let handleWrapperOffset = that.$handleWrapper.offset();
				let handlePosition = that.$handle.position();
				
				//position 相对父级坐标（相对坐标）
				let position = {
					left: dragEvent.pageX - handleWrapperOffset.left,
					top: dragEvent.pageY - handleWrapperOffset.top,
					handleLeft: dragEvent.pageX - handleWrapperOffset.left - that.$handle.width()/2,
					handleTop: dragEvent.pageY - handleWrapperOffset.top - that.$handle.height()/2,
				};

				//检测单击区域是不是在handle范围内，如果范围内，就不继续执行
				if (!that.opts.isVertical) {
					if(position.left > handlePosition.left && position.left < handlePosition.left + that.$handle.width()){
						return;
					}
				} else {
					if(position.top > handlePosition.top && position.top < handlePosition.top + that.$handle.height()){
						return;
					}
				}

				//坐标越界修正
				if(position.handleLeft < 0){
					position.handleLeft = 0;
				}else if(position.handleLeft + that.$handle.width() > that.$handleWrapper.width()){
					position.handleLeft = that.$handleWrapper.width() - that.$handle.width();
				}

				if(position.handleTop < 0){
					position.handleTop = 0;
				}else if(position.handleTop + that.$handle.height() > that.$handleWrapper.height()){
					position.handleTop = that.$handleWrapper.height() - that.$handle.height();
				}

				//根据鼠标/手指操作的点的相对坐标获得该点的value值
				let pointValue = that._getHandleWrapperPointValue(position.left, position.top);

				//设置值
				that.setValue(pointValue, false);

				if (!that.opts.isVertical) {
					that.$handle.css('left', position.handleLeft);
				} else {
					that.$handle.css('top', position.handleTop);
				}

				that.opts.onChangeEnd(that.opts.value);

			})
			.on('mouseenter', function (evt) {
				clearTimeout(that._timer);
			})
			.on('mouseleave', function(evt){

				//自动滚动到准确位置
				if(that.opts.autoScroll){
					// if(evt.touches || !that.isDrag){
					if(!that.isDrag){
						that._handleScrollToValuePosition();
					}
				}

			});

		//tooltip(鼠标专属事件)
		this.opts.tooltip && this.$handleWrapper
			.on('mousemove', function (evt) {

				let handlePosition = that.$handle.offset();

				//相对坐标
				let evtPosition = {
					left: evt.pageX - that.$handleWrapper.offset().left,
					top: evt.pageY - that.$handleWrapper.offset().top
				};

				if(!that.opts.isVertical){


					if(evt.pageX >= handlePosition.left && evt.pageX <= handlePosition.left + that.$handle.width()){

						//handle 区域移动
						if(!that.isDrag){
							let tooltipPosition = that._getTooltipPositionForHandle();
							that._tooltip(true, tooltipPosition.left, tooltipPosition.top, that.opts.tooltipFormat(that.opts.value));
						}

					}else{

						//handle 区域外移动
						let tooltipPosition = that._getTooltipPositionForHandleWrapper(evt.pageX, evt.pageY);
						let pointValue = that._getHandleWrapperPointValue(evtPosition.left, evtPosition.top);
						that._tooltip(true, tooltipPosition.left, tooltipPosition.top, that.opts.tooltipFormat(pointValue));

					}

				}else{

					if(evt.pageY >= handlePosition.top && evt.pageY <= handlePosition.top + that.$handle.height()){

						//handle 区域移动
						if(!that.isDrag){
							let tooltipPosition = that._getTooltipPositionForHandle();
							that._tooltip(true, tooltipPosition.left, tooltipPosition.top, that.opts.tooltipFormat(that.opts.value));
						}

					}else{

						//handle 区域外移动
						let tooltipPosition = that._getTooltipPositionForHandleWrapper(evt.pageX, evt.pageY);
						let pointValue = that._getHandleWrapperPointValue(evtPosition.left, evtPosition.top);
						that._tooltip(true, tooltipPosition.left, tooltipPosition.top, that.opts.tooltipFormat(pointValue));

					}

				}

			})
			.on('mouseleave', function (evt) {

				//tome: bug it! tooltip 有闪烁问题
				//tome: 滑道再手机端，单击后，tooltip 不消失
				if(!that.isDrag && evt.relatedTarget !== that.$tooltip[0]){
					that._tooltip(false);
				}

			});

	}

	setOptions(opts){

		//保存数据
		this.opts = $.extend(true, this.opts, opts);

		//设置方向
		if(opts.isVertical !== undefined){
			this.$wrapper.attr('data-direction', opts.isVertical ? 'vertical' : 'horizontal');
		}

		//设置尺寸
		opts.width && this.$wrapper.width(opts.width);
		opts.height && this.$wrapper.height(opts.height);
		
		//自定义样式
		if(opts.className){
			this.$wrapper.addClass(opts.className);
		}

		//设置 handle
		opts.handleWidth && this.$handle.width(opts.handleWidth);
		opts.handleHeight && this.$handle.height(opts.handleHeight);
		((opts.min !== undefined || opts.max !== undefined) && this.opts.min === this.opts.max) ? this.$handle.css('visibility','hidden') : this.$handle.css('visibility','');

		if(opts.handleAutoSize || (this.opts.handleAutoSize && (opts.min || opts.max || opts.step))){
			this._autoHandleSize();
			this.opts.autoScroll && this._handleScrollToValuePosition();
		}

		// 设置 handleWrapper 容器边距
		if(opts.handleWrapperSideStart !== undefined){
			!this.opts.isVertical ? this.$handleWrapper.css('left', opts.handleWrapperSideStart) : this.$handleWrapper.css('top', opts.handleWrapperSideStart);
		}

		if(opts.handleWrapperSideEnd !== undefined){
			!this.opts.isVertical ? this.$handleWrapper.css('right', opts.handleWrapperSideEnd) : this.$handleWrapper.css('bottom', opts.handleWrapperSideEnd);
		}

		// 设置 bg 容器边距
		if(opts.bgSideStart !== undefined){
			!this.opts.isVertical ? this.$bg.css('left', opts.bgSideStart) : this.$bg.css('top', opts.bgSideStart);
		}

		if(opts.bgSideEnd !== undefined){
			!this.opts.isVertical ? this.$bg.css('right', opts.bgSideEnd) : this.$bg.css('bottom', opts.bgSideEnd);
		}

		//计算刻度数
		if(opts.min !== undefined || opts.max !== undefined || opts.step !== undefined){
			this.stepNums = (this.opts.max - this.opts.min) / this.opts.step;
		}

		//计算小数位长度
		if(opts.min !== undefined || opts.max !== undefined || opts.step !== undefined){

			let precision = this.precision;//默认精度 0 小数位

			if(opts.min !== undefined){
				let tmp = this.opts.min.toString().split('.');
				let _precision = tmp[1] ? tmp[1].length : 0;
				if(_precision> precision){
					precision = _precision;
				}
			}

			if(opts.max !== undefined){
				let tmp = this.opts.max.toString().split('.');
				let _precision = tmp[1] ? tmp[1].length : 0;
				if(_precision> precision){
					precision = _precision;
				}
			}

			if(opts.step !== undefined){
				let tmp = this.opts.step.toString().split('.');
				let _precision = tmp[1] ? tmp[1].length : 0;
				if(_precision> precision){
					precision = _precision;
				}
			}

			this.precision  = precision;

		}

		//设置值
		if(opts.value !== undefined){

			if(this.opts.value < this.opts.min){
				this.opts.value = this.opts.min;
			}

			if(this.opts.value > this.opts.max){
				this.opts.value = this.opts.max;
			}

			this.setValue(this.opts.value);

		}

	}

	setValue(value, toScroll = true){

		//越界检测
		if(value < this.opts.min || value > this.opts.max){
			return;
		}

		if(value !== this.opts.value){
			this.opts.onChange(value, this.opts.value);
		}

		this.opts.value = value;

		if(!this.isDrag && toScroll && (this.opts.autoScroll || this._getHandleValue() !== value)){
			this._setHandlePositionByValue(value);
		}

	}

	getValue(){
		return this.opts.value;
	}

	resize(){
		
		this.opts.handleAutoSize && this._autoHandleSize();
		this._setHandlePositionByValue(this.opts.value);
	}

	enable(){
		this.disabled = false;
		this.$wrapper.attr('data-disabled', 'false');
	}

	disable(){
		this.disabled = true;
		this.$wrapper.attr('data-disabled', 'true');
	}

	/**
	 * 自动设置 handle 尺寸 
	 * @DateTime    2018/12/20 9:30
	 * @Author      wangbing
	*/
	_autoHandleSize(){

		let handleSize;

		if(!this.opts.isVertical){
			handleSize = this.$wrapper.width() / ((this.opts.max - this.opts.min) / this.opts.step + 1);
		}else{
			handleSize = this.$wrapper.height() / ((this.opts.max - this.opts.min) / this.opts.step + 1);
		}

		if(handleSize < this.opts.handleAutoSizeMin){
			handleSize = this.opts.handleAutoSizeMin;
		}

		if(!this.opts.isVertical){
			this.$handle.width(handleSize).height(this.opts.handleHeight);
		}else{
			this.$handle.width(this.opts.handleWidth).height(handleSize);
		}

	}

	_value(value){
		return Number(value.toFixed(this.precision));
	}
	
	/**
	 * 显示tooltip
	 * @DateTime    2018/12/26 15:23
	 * @Author      wangbing
	 * @param       {Boolean}   isShow	显示/隐藏
	 * @param		{Number}	left	水平坐标
	 * @param		{Number}	top		垂直坐标
	 * @param		{String}	text	内容
	*/
	_tooltip(isShow, pageX = 0, pageY = 0, text = ""){

		let that = this;

		if(isShow){

			if(!this.$tooltip){

				this.$tooltip = $('<div class="xslide-tooltip ' + this.opts.tooltipDirection + '">' + text + '</div>');

				//这个是为了修正鼠标移动到tooltip上时，不流畅滑动问题
				this.$tooltip
					.on('mousemove', function(evt){

						let handleWrapperPosition = that.$handleWrapper.offset();

						if(evt.pageX < handleWrapperPosition.left){
							evt.pageX = handleWrapperPosition.left;
						}else if(evt.pageX > handleWrapperPosition.left + that.$handleWrapper.width()){
							evt.pageX = handleWrapperPosition.left + that.$handleWrapper.width();
						}

						if(evt.pageY < handleWrapperPosition.top){
							evt.pageY = handleWrapperPosition.top;
						}else if(evt.pageY > handleWrapperPosition.top + that.$handleWrapper.height()){
							evt.pageY = handleWrapperPosition.top + that.$handleWrapper.height();
						}

						that.$handleWrapper.trigger(evt);

					})
					.on('mouseleave', function(){
						that.$tooltip.hide();
					});

				this.$body.append(this.$tooltip);
			}

			this.$tooltip.html(text).css({left: pageX, top: pageY}).show();

		}else{

			if(this.$tooltip){
				this.$tooltip.hide();
			}

		}
	}

	/**
	 * 得到handle位置的value值
	 * @DateTime    2018/12/20 15:59
	 * @Author      wangbing
	 * @param       {Number}    positionLeft  水平相对坐标
	 * @param       {Number}    positionTop  垂直坐标
	 * @return      {Number}    实际值
	 */
	_getHandlePositionValue(positionLeft, positionTop){

		let value;
		let stepPix; //每一个刻度的像素尺寸

		if (!this.opts.isVertical) {
			stepPix = (this.$handleWrapper.width() - this.$handle.outerWidth()) / this.stepNums;
			value = parseInt((positionLeft + stepPix/2) / stepPix) * this.opts.step + parseFloat(this.opts.min);
		} else {
			stepPix = (this.$handleWrapper.height() - this.$handle.outerHeight()) / this.stepNums;
			value = parseInt((positionTop + stepPix/2) / stepPix) * this.opts.step + parseFloat(this.opts.min);
		}

		return this._value(value);

	}

	/**
	 * 得到 handel 当前位置的对应的 value
	 */
	_getHandleValue(){
		let handlePosition = this.$handle.offset();
		let handleWrapperPosition = this.$handleWrapper.offset();

		let left = handlePosition.left - handleWrapperPosition.left;
		let top = handlePosition.top - handleWrapperPosition.top;
		return this._getHandlePositionValue(left, top);
	}

	/**
	 * 得到handleWrapper 对应点的 value
	 * @DateTime    2018/12/21 13:48
	 * @Author      wangbing
	 * @param       {Number}    positionLeft  水平相对坐标
	 * @param       {Number}    positionTop  垂直相对坐标
	 * @return      {Number}    实际值
	 */
	_getHandleWrapperPointValue(positionLeft, positionTop){

		let value;
		let stepPix; //每一个刻度的像素尺寸

		if (!this.opts.isVertical) {
			
			if(this.stepNums){
				stepPix = this.$handleWrapper.width() / this.stepNums;
				value = parseInt((positionLeft + stepPix/2) / stepPix) * this.opts.step + parseFloat(this.opts.min);
			}else{
				value = this.opts.min;
			}

		} else {

			if(this.stepNums){
				stepPix = this.$handleWrapper.height() / this.stepNums;
				value = parseInt((positionTop + stepPix/2) / stepPix) * this.opts.step + parseFloat(this.opts.min);
			}else{
				value = this.opts.min;
			}

		}

		return this._value(value);

	}

	/**
	 * 根据value值设置handle的位置
	 * @DateTime    2018/12/21 14:13
	 * @Author      wangbing
	 * @param       {Number}    value	实际值
	 */
	_setHandlePositionByValue(value){

		let stepPix; //每一个刻度的像素尺寸
		
		if (!this.opts.isVertical) {
			
			if(this.stepNums){
				stepPix = (this.$handleWrapper.width() - this.$handle.outerWidth()) / this.stepNums;
				this.$handle.css('left', ((value - this.opts.min) / this.opts.step) * stepPix);
			}else{
				this.$handle.css('left', 0);
			}


		} else {

			if(this.stepNums){
				stepPix = (this.$handleWrapper.height() - this.$handle.outerHeight()) / this.stepNums;
				this.$handle.css('top', ((value - this.opts.min) / this.opts.step) * stepPix);
			}else{
				this.$handle.css('top', 0);
			}

		}

	}

	_getTooltipPositionForHandle(){

		let position;

		let handleOffset = this.$handle.offset();

		switch (this.opts.tooltipDirection) {
			case 'top':
				position = {
					left: handleOffset.left + this.$handle.outerWidth() / 2,
					top: handleOffset.top - this.opts.tooltipOffset
				};
				break;

			case 'bottom':
				position = {
					left: handleOffset.left + this.$handle.outerWidth() / 2,
					top: handleOffset.top + this.$handle.outerHeight() + this.opts.tooltipOffset
				};
				break;
			case 'left':
				position = {
					left: handleOffset.left - this.opts.tooltipOffset,
					top: handleOffset.top + this.$handle.outerHeight()/2
				};
				break;
			case 'right':
				position = {
					left: handleOffset.left + this.$handle.outerWidth() + this.opts.tooltipOffset,
					top: handleOffset.top + this.$handle.outerHeight()/2
				};
				break;
		}
		return position;
	}

	_getTooltipPositionForHandleWrapper(left, top){

		let position;
		let handleOffset = this.$handle.offset();

		switch (this.opts.tooltipDirection) {
			case 'top':
				position = {
					left: left,
					top: handleOffset.top - this.opts.tooltipOffset
				};
				break;

			case 'bottom':
				position = {
					left: left,
					top: handleOffset.top + this.$handle.outerHeight() + this.opts.tooltipOffset
				};
				break;
			case 'left':
				position = {
					left: handleOffset.left - this.opts.tooltipOffset,
					top: top
				};
				break;
			case 'right':
				position = {
					left: handleOffset.left + this.$handle.outerWidth() + this.opts.tooltipOffset,
					top: top
				};
				break;
		}

		return position;
	}

	/**
	 * handle 滚动到精确位置
	 * @DateTime    2018/12/28 11:11
	 * @Author      wangbing
	*/
	_handleScrollToValuePosition() {

		clearTimeout(this._timer);
		this._timer = setTimeout(() => {
			this._setHandlePositionByValue(this.opts.value);
		}, this.opts.autoScrollDelayTime);

	}

}

(function($){

	$.fn.XSlider = function (opts) {

		let $this = $(this);
	
		if ($this.length > 1) {
			$this.each((index, el) => {
				$this.XSlide(opts);
			});
	
		} else {
			opts.el = $this;
			return new XSlider(opts);
	
		}
	};
	
})(window.jQuery);