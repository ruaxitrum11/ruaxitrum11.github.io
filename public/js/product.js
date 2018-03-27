
//hover add class
$(".product-thumb").hover(
	function () {
		$(this).addClass('product-thumb-hover');
	}, 
	function () {
		$(this).removeClass('product-thumb-hover');
	}
	);


//click change BgI
$('.product-thumb1').click(function(){
	$('.product-details-area').css({
		'background-image':'url(../img/product_headset/ab_1.jpg)'
	});
});
$('.product-thumb2').click(function(){
	$('.product-details-area').css({
		'background-image':'url(../img/product_headset/ab_2.jpg)'
	});
});
$('.product-thumb3').click(function(){
	$('.product-details-area').css({
		'background-image':'url(../img/product_headset/ab_3.jpg)'
	});
});
$('.product-thumb4').click(function(){
	$('.product-details-area').css({
		'background-image':'url(../img/product_headset/ab_4.jpg)'
	});
});
$('.product-thumb5').click(function(){
	$('.product-details-area').css({
		'background-image':'url(../img/product_headset/ab_5.png)'
	});
});
$('.product-thumb6').click(function(){
	$('.product-details-area').css({
		'background-image':'url(../img/product_headset/ab_6.jpg)'
	});
});
$('.product-thumb7').click(function(){
	$('.product-details-area').css({
		'background-image':'url(../img/product_headset/ab_7.png)'
	});
});
$('.product-thumb8').click(function(){
	$('.product-details-area').css({
		'background-image':'url(../img/product_headset/ab_8.png)'
	});
});
$('.product-thumb9').click(function(){
	$('.product-details-area').css({
		'background-image':'url(../img/product_headset/ab_9.jpg)'
	});
});
$('.product-thumb10').click(function(){
	$('.product-details-area').css({
		'background-image':'url(../img/product_headset/ab_10.png)'
	});
});
$('.product-thumb11').click(function(){
	$('.product-details-area').css({
		'background-image':'url(../img/product_headset/ab_11.png)'
	});
});



//click add class

$('.product-thumb').click(function(e) {
	e.preventDefault();
	$('.product-thumb').removeClass('product-thumb-active');
	$(this).addClass('product-thumb-active');
});

$('.product-color').click(function(e) {
	e.preventDefault();
	$('.product-color').removeClass('color-active');
	$(this).addClass('color-active');
});

//change image when click color
$('.product-thumb-color-red').hide();
$('.product-thumb-color-blue').hide();

$('.black').click(function(){
	$('.product-thumb-color-black').show();
	$('.product-thumb-color-red').hide();
	$('.product-thumb-color-blue').hide();
	$('.product-thumb1').click();
})
$('.red').click(function(){
	$('.product-thumb-color-red').show();
	$('.product-thumb-color-black').hide();
	$('.product-thumb-color-blue').hide();
	$('.product-thumb6').click();
})
$('.blue').click(function(){
	$('.product-thumb-color-blue').show();
	$('.product-thumb-color-red').hide();
	$('.product-thumb-color-black').hide();
	$('.product-thumb9').click();
})

//scroll fixed
$('.product-main-menu-fixed').hide();
$(document).scroll(function() {
	var y = $(this).scrollTop();
	if (y > 700) {
		$('.product-main-menu-fixed').show();
	} else {
		$('.product-main-menu-fixed').hide();
	}
});

//popup youtube
$(document).ready(function() {
	$('.popup-youtube').magnificPopup({
		type: 'iframe',
		iframe: {
			patterns: {
				youtube: {
			      index: 'youtube.com/', // String that detects type of video (in this case YouTube). Simply via url.indexOf(index).
			      id: 'v=',
			      src: 'https://www.youtube.com/embed/%id%?autoplay=1&rel=0' // URL that will be set as a source for iframe.
			  },
			}
		},
	});
});

//toggle
$('.specifications-item-toggle-content').hide();
$('.toggle-content1').show();
$('.toggle-compatibility').click(function(){
	$(this).toggleClass('specifications-item-toggle-title-active');
	$('.toggle-content1').toggle(100);
});
$('.toggle-speaker').click(function(){
	$(this).toggleClass('specifications-item-toggle-title-active');
	$('.toggle-content2').toggle(100);
});
$('.toggle-connection').click(function(){
	$(this).toggleClass('specifications-item-toggle-title-active');
	$('.toggle-content3').toggle(100);
});
$('.toggle-boxcontent').click(function(){
	$(this).toggleClass('specifications-item-toggle-title-active');
	$('.toggle-content4').toggle(100);
});
