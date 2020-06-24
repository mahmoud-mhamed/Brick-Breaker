/*main js*/
function test(data='',onother=''){
    if (data==''){
        alert('no data test success');
    } else if(onother!=''){
        alert('data = '+data+" and onther is = "+onother);
    }else {
        alert('data = '+data);
    }

}
/*end main js*/
/*start header and aside and main*/
$(function () {
   $('header button.navToggle').click(function () {
       if ($('aside').css('left')[0]=='-'){
           $('aside,div.overlay').css({
               left:0
           });
       }else {
           $('aside,div.overlay').css({
               left:'-100%'
           });
       }
       $('header button[data-type="pause"]').trigger('click');
   });
   $('aside button[data-type="start"],div.overlay').click(function () {
       $('header button.navToggle').trigger('click');
   });
    $('aside button[data-type="start"]').click(function () {
        $('header button[data-type="start"]').trigger('click');
    });
});
/*start canvas*/
$(function () {

    $(window).resize(function () {
       $('#myCanvas').attr({
           height:$('main>div').height(),
           width:$('main>div').width()
       });
    });

   $('#myCanvas').attr({
       height:$('main>div').height(),
       width:$('main>div').width()
   });
   /*change volume value*/
    function setVolum(value) {
        $('#playSound')[0].volume=value;
        $('#playSound')[0].play();
        if (value<.6){
            $('#audio')[0].volume=value - - .4;
        } else
        $('#audio')[0].volume=value - - .1;
    }
    setVolum("."+ $('aside input[type="range"]').val());
    $('aside input[type="range"]').change(function () {
        setVolum("."+$(this).val());
    });

    /*random background*/
    var background=Math.trunc(Math.random()*10);
    $('#myCanvas').css({
        backgroundImage:"url('img/bg"+background+".jpg')"
    });

    /*enter full screen*/
    $('aside button[data-type="full"]').click(function () {
        $('#myCanvas').enterFullscreen();
        $('aside button[data-type="start"]').trigger('click');
    });
    $('header button[data-type="full"]').click(function () {
        $('#myCanvas').enterFullscreen();
        getData();
        play();
    });
    $('header button[data-type="start"]').click(function () {
        getData();
        play();
        $(this).css('display','none').html('Continue').removeClass('btn-primary').addClass('btn-success');
        $('button[data-type="pause"]').css('display','inline');
    });
    $('button[data-type="pause"]').click(function () {
        clearInterval(intervalPlay);
        $(this).css('display','none');
        $('header button[data-type="start"]').css('display','inline');
    });
});