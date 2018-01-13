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

