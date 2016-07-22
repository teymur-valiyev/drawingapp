/**
 * Created by teymur on 23.08.2015.
 */
var canvas = document.getElementById('c');
var context = canvas.getContext('2d');

var radius = 10;
var dragable = false;

canvas.width = 1000;
canvas.height = 500;

context.lineWidth = radius*2;

var  putPoint = function(e) {

    var parentOffset = $('#c').offset();
    var  relX = e.pageX - parentOffset.left;
    var relY = e.pageY - parentOffset.top
    
    if(dragable) {
        context.lineTo(relX, relY);
        context.stroke();
        context.beginPath();
        context.arc(relX, relY,radius,0,Math.PI+2);;
        context.fill();
        context.beginPath();
        context.moveTo(relX, relY);
        data = {
            x: relX,
            y: relY,
            color: '',
            radius: '10',
            draw: true
        };
        socket.emit('isdrawing', data);

    }
}
var engage = function(e){
    dragable = true;

    var parentOffset = $('#c').offset();
    var  relX = e.pageX - parentOffset.left;
    var relY = e.pageY - parentOffset.top

    data = {
        x: relX,
        y: relY,
        color: '',
        radius: '10',
        draw: true
    };
    socket.emit('isdrawing', data);
    context.moveTo(relX, relY);
    putPoint(e);
};

var disengage = function(e){
    dragable = false;
};

var disablenotinpath = function(e){
    dragable = false;
}
canvas.addEventListener('mousedown',engage);
canvas.addEventListener('mouseup',disengage)
canvas.addEventListener('mousemove',putPoint);
canvas.addEventListener('mouseout',disablenotinpath);



