$(document).ready(function(){
	$('.user-info-left ul li').click(function(){
		$('li').removeClass("user-info-left-active");
		$(this).addClass("user-info-left-active");
	});
});

$('.user-info-order').fadeOut();
$('.user-info-trophy').fadeOut();
$('.user-info-pass').fadeOut();

$('.user-info-left-profile').click(function(){
	$('.user-info-profile').fadeIn();
	$('.user-info-order').fadeOut();
	$('.user-info-trophy').fadeOut();
	$('.user-info-pass').fadeOut();
})
$('.user-info-left-order').click(function(){
	$('.user-info-order').fadeIn();
	$('.user-info-profile').fadeOut();
	$('.user-info-trophy').fadeOut();
	$('.user-info-pass').fadeOut();
})
$('.user-info-left-trophy').click(function(){
	$('.user-info-order').fadeOut();
	$('.user-info-profile').fadeOut();
	$('.user-info-trophy').fadeIn();
	$('.user-info-pass').fadeOut();
})
$('.user-info-left-pass').click(function(){
	$('.user-info-order').fadeOut();
	$('.user-info-profile').fadeOut();
	$('.user-info-trophy').fadeOut();
	$('.user-info-pass').fadeIn();
})

//modal toggle order-details-product 
$('.product-recieved').hide();
$('.order-details-toggle').click(function(){
	$('.product-recieved').toggle();
})