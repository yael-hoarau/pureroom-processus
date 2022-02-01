$('#ON').click(function(){
    console.log('button clicked');
    $.ajax({url: '/ON', success:function(res){
        console.log('server response is', res);
    }});
});

$('#OFF').click(function(){
    console.log('button clicked');
    $.ajax({url: '/ON', success:function(res){
        console.log('server response is', res);
    }});
});