/**
 * 
 */
(function() {
    window.Rotate = Rotate;
    function Rotate(pro) {
        this.pro = pro;
        this.dom = document.querySelector(pro.el);
        this.perX = 0;
        this.perY = 0;
        this.TimerOut = null;
        this.TimerInter = null;
        this.config = {
            levelX: [0, 6, 12, 16],
            levelY: [0, 7, 14, 18],
            setTimeouts: 500,
            setIntervals: 300,
            fps: 15
        };
        this.bind();
    }
    Rotate.prototype = {
        //绑定鼠标移入和移除
        bind: function() {
            var _this = this;
            this.dom.onmousemove = function(e) {
                clearTimeout(_this.TimerOut);
                clearInterval(_this.TimerInter);
                _this.handleOnmousemove(_this.dom.offsetWidth, _this.dom.offsetHeight, e.offsetX, e.offsetY);
            };
            this.dom.onmouseleave = function(e) {
                _this.handleOnmouseleave();
            };
        },

        //鼠标移入，计算和中心点偏移百分比
        handleOnmousemove: function(w, h, x, y) {
            this.perX = (x - w / 2) / (w / 2);
            this.perY = (y - h / 2) / (h / 2);
            this.setRotate();
        },

        //鼠标移除，设置还原偏移
        handleOnmouseleave: function() {
            var _this = this;
            this.TimerOut = setTimeout(function() {
                var speedX = Math.abs(_this.perX / (_this.config.setIntervals / _this.config.fps));
                var speedY = Math.abs(_this.perY / (_this.config.setIntervals / _this.config.fps));
                _this.TimerInter = setInterval(function() {
                    _this.perX > 0 ? (_this.perX -= speedX) : (_this.perX += speedX);
                    _this.perY > 0 ? (_this.perY -= speedY) : (_this.perY += speedY);
                    _this.setRotate();
                    if (Math.abs(_this.perX) >= 0 && Math.abs(_this.perX) <= 0.01) {
                        clearInterval(_this.TimerInter);
                    }
                }, _this.config.fps);
            }, _this.config.setTimeouts);
        },

        //设置偏移
        setRotate: function() {
            this.dom.style.transform = "rotateX(" + this.perY * this.config.levelY[this.pro.level] * -1 + "deg) rotateY(" + this.perX * this.config.levelX[this.pro.level] + "deg)";

            //子元素偏移
            if (this.pro.item && this.pro.item instanceof Array && this.pro.item.length > 0) {
                for (var i = 0; i < this.pro.item.length; i++) {
                    var degStr = "";
                    if (this.pro.item[i].x) {
                        degStr += "rotateX(" + this.perY * this.config.levelY[this.pro.item[i].x] * -1 + "deg)";
                    } else if (this.pro.item[i].y) {
                        degStr += "rotateY(" + this.perX * this.config.levelX[this.pro.item[i].y] * -1 + "deg)";
                    } else if (this.pro.item[i].level) {
                        degStr += "rotateX(" + this.perY * this.config.levelY[this.pro.item[i].level] * -1 + "deg) rotateY(" + this.perX * this.config.levelX[this.pro.item[i].level] + "deg)";
                    }
                    document.querySelector(this.pro.item[i].el).style.transform = degStr;
                }
            }
        }
    };
})();
