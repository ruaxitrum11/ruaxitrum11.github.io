$('#mycarousel').carousel({
	interval: 5000 
});

new WOW().init();

$(document).ready(function(){
	$('.new-product-right ul li').click(function(){
		$('li').removeClass("product-active");
		$(this).addClass("product-active");
	});
});

$(".new-headset").hide();
$(".new-mice").hide();
$(".new-other").hide();

$("#new-headset").click(function(){
	$(".new-headset").show(1000);
	$(".new-keyboard").hide(1000);
	$(".new-mice").hide(1000);
	$(".new-other").hide(1000);
});
$("#new-mice").click(function(){
	$(".new-mice").show(1000);
	$(".new-keyboard").hide(1000);
	$(".new-headset").hide(1000);
	$(".new-other").hide(1000);
});
$("#new-other").click(function(){
	$(".new-other").show(1000);
	$(".new-keyboard").hide(1000);
	$(".new-mice").hide(1000);
	$(".new-headset").hide(1000);
});
$("#new-keyboard").click(function(){
	$(".new-keyboard").show(1000);
	$(".new-headset").hide(1000);
	$(".new-mice").hide(1000);
	$(".new-other").hide(1000);
});

