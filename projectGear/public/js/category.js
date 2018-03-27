var x = $(".fixed-product-category-area").offset();
$(window).bind('scroll', function () {
	if ($(window).scrollTop() > x.top) {
		$('.fixed-product-category-area').addClass('fixed');
	} else {
		$('.fixed-product-category-area').removeClass('fixed');
	}
});


