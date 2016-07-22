/**
 * Created by teymur on 24.08.2015.
 */
var setRadius = function(newRadius) {
    if(newRadius<minRad)
        newRadius = minRad;
    else if(newRadius>maxRad)
        newRadius = maxRad;
    radius = newRadius;
    context.lineWidth = radius*2;

    /** socket draw set color **/
    data = {
        x: '',
        y: '',
        color: '',
        radius: radius,
        draw: true
    };

    socket.emit('isdrawing', data);
    /** socket draw set color **/

    radSpan.innerHTML = radius;

}
var minRad = 0.5,
    maxRad = 100,
    defaultRad = 10,
    interval = 5,
    radSpan = document.getElementById('radval'),
    decRad = document.getElementById('decrad'),
    incRad = document.getElementById('incrad');

decRad.addEventListener('click',function(){
    setRadius(radius - interval);
});

incRad.addEventListener('click',function(){
    setRadius(radius + interval);
});

setRadius(defaultRad);