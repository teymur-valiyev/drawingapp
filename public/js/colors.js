/**
 * Created by teymur on 24.08.2015.
 */

var colors = ['black','grey','white','red','orange','yellow',
    'green','blue','indigo','violet'];

//var swatches = document.getElementsByClassName('swatch');
//for(var i = 0,n=swatches.length;i<n;i++) {
//    swatches[i].addEventListener('click',setSwatch);
//}

for(var i= 0,n=colors.length;i<n;i++) {
    var swatch = document.createElement('div');
    swatch.className = 'swatch';
    swatch.style.backgroundColor = colors[i];
    swatch.addEventListener('click',setSwatch);
    document.getElementById('colors').appendChild(swatch);
}

function setColor(color) {
    context.fillStyle = color;
    context.strokeStyle = color;

    /** socket draw set color **/
    data = {
        x: '',
        y: '',
        color: color,
        radius: '10',
        draw: true
    };

    socket.emit('isdrawing', data);
    /** socket draw set color **/
    var active = document.getElementsByClassName('active')[0];
    if(active) {
        active.className = 'swatch';
    }
}
function setSwatch(e) {
    var swatch = e.target; //hasi elementde olub event
    setColor(swatch.style.backgroundColor);
    swatch.className += ' active';
}
setSwatch({target: document.getElementsByClassName('swatch')[0]});