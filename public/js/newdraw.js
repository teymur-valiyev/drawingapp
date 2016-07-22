/**
 * Created by teymur on 27.08.2015.
 */

//
//this.canvas = canvas;
//this.context = this.canvas.getContext("2d");
//var _this = this;
//var setDim = function() {
//    _this.w = _this.canvas.clientWidth;
//    _this.h = _this.canvas.clientHeight;
//    _this.canvas.width = _this.w;
//    _this.canvas.height = _this.h;
//    _this.dimChanged = true;
//    _this.draw();
//};
//setDim();
//$(window).resize(setDim);

//$("#something").click(function(e){
//    var parentOffset = $(this).parent().offset();
//    //or $(this).offset(); if you really just want the current element's offset
//    var relX = e.pageX - parentOffset.left;
//    var relY = e.pageY - parentOffset.top;
//});


var el = document.getElementById('c');
var ctx = el.getContext('2d');
var isDrawing;

el.width = 1000;
el.height = 500;

el.onmousedown = function(e) {

    var parentOffset = $(this).parent().offset();
    var relX = e.pageX - parentOffset.left;
    var relY = e.pageY - parentOffset.top

    isDrawing = true;
    ctx.lineWidth = 10;
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.moveTo(relX, relY);
};
el.onmousemove = function(e) {

    //var parentOffset = $(this).psrent().offset();
    var parentOffset = $('#c').offset();
    var relX = e.pageX - parentOffset.left;
    var relY = e.pageY - parentOffset.top

    if (isDrawing) {
        ctx.lineTo(relX, relY);
        ctx.stroke();
    }
};
el.onmouseup = function() {
    isDrawing = false;
};
el.onmouseout =function() {
    isDrawing = false;
}