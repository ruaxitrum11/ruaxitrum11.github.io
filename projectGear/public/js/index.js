//carousel 
$('#mycarousel').carousel({
	interval: 5000
});

new WOW().init();

// ----- Header , Footer

$(".header-xs-details").hide();
$(".header-xs-search").hide();
$(".header-xs-cart").hide();
$(".header-xs-user").hide();
$(".header-xs-form-login").hide();
$(".header-xs-form-singin").hide();

$(".bar-item").click(function(){
	$(".header-xs-details").toggle(".header-xs-details-transition");
	$(".header-xs-search").hide(500);
	$(".header-xs-cart").hide(500);
	$(".header-xs-user").hide(500);
	$(".header-xs-form-singin").hide(500);
	$(".header-xs-form-login").hide(500);
});
$(".fa-search").click(function(){
	$(".header-xs-search").toggle(".header-xs-search-transition");
	$(".header-xs-details").hide(500);
	$(".header-xs-cart").hide(500);
	$(".header-xs-user").hide(500);
	$(".header-xs-form-singin").hide(500);
	$(".header-xs-form-login").hide(500);
});
$(".fa-shopping-cart").click(function(){
	$(".header-xs-cart").toggle(".header-xs-cart-transition");
	$(".header-xs-details").hide(500);
	$(".header-xs-search").hide(500);
	$(".header-xs-user").hide(500);
	$(".header-xs-form-singin").hide(500);
	$(".header-xs-form-login").hide(500);
})
$(".fa-user").click(function(){
	$(".header-xs-user").toggle(".header-xs-user-transition");
	$(".header-xs-details").hide(500);
	$(".header-xs-search").hide(500);
	$(".header-xs-cart").hide(500);
});
$(".header-xs-login").click(function(){
	$(".header-xs-form-login").toggle(".header-xs-form-login-transition");	
	$(".header-xs-form-singin").hide(500);
});
$(".header-xs-singin").click(function(){
	$(".header-xs-form-singin").toggle(".header-xs-form-singin-transition");	
	$(".header-xs-form-login").hide(500);
});

// ----- Homepage (index)

$(document).ready(function(){
	$('.new-product-right ul li').click(function(){
		$('li').removeClass("product-active");
		$(this).addClass("product-active");
	});
});

$(".new-keyboard").fadeOut();
$(".new-mice").fadeOut();
$(".new-other").fadeOut();

$("#new-headset").click(function(){
	$(".new-headset").fadeIn(1000);
	$(".new-keyboard").fadeOut();
	$(".new-mice").fadeOut();
	$(".new-other").fadeOut();
});
$("#new-mice").click(function(){
	$(".new-mice").fadeIn(1000);
	$(".new-keyboard").fadeOut();
	$(".new-headset").fadeOut();
	$(".new-other").fadeOut();
});
$("#new-other").click(function(){
	$(".new-other").fadeIn(1000);
	$(".new-keyboard").fadeOut();
	$(".new-mice").fadeOut();
	$(".new-headset").fadeOut();
});
$("#new-keyboard").click(function(){
	$(".new-keyboard").fadeIn(1000);
	$(".new-headset").fadeOut();
	$(".new-mice").fadeOut();
	$(".new-other").fadeOut();
});



//review 
$(document).ready(function(){
	var stt = 0;
	var sttUser = 0;

	startReview = parseInt($(".review-content:first").attr("stt"));
	endReview = parseInt($(".review-content:last").attr("stt"));

	startUserInfo = parseInt($(".review-user:first").attr("stt"));
	endReUserInfo = parseInt($(".review-user:last").attr("stt"));

	$('.review-user').each(function(){
		if($(this).is(':visible')){
			sttUser = parseInt($(this).attr("stt"));
		}
	});

	$('.review-content').each(function(){
		if($(this).is(':visible')){
			stt = parseInt($(this).attr("stt"));
		}
	});


	$('.review-next').click(function(){
		
		next = stt ;
		nextUser = sttUser;

		if(next == endReview) {
			stt =startReview-1;
			sttUser = startUserInfo-1;
		}
		next = ++stt ;
		nextUser = ++sttUser;

		$('.review-content').hide();
		$('.review-content').eq(next).show();

		$('.review-user').hide();
		$('.review-user').eq(nextUser).show();
		
	});
	$('.review-previous').click(function(){
		
		previous = stt;
		previousUser = sttUser;

		if(previous == startReview) {
			stt = endReview+1;
			sttUser = endReUserInfo + 1;
		}
		previous = --stt;

		previousUser = --sttUser;

		$('.review-content').hide();
		$('.review-content').eq(previous).show();

		$('.review-user').hide();
		$('.review-user').eq(previousUser).show();

	});
});

$(document).ready(function(){
	var sttImage = [
	"../img/homepage/user1.jpg",
	"../img/homepage/user2.jpg",
	"../img/homepage/user3.jpg",
	"../img/homepage/user4.jpg",
	"../img/homepage/user5.jpg",
	"../img/homepage/user6.jpg",
	"../img/homepage/user7.jpg"
	];

	// $("#gallery-user1 img").attr("src",sttImage[0]);
	// $("#gallery-user2 img").attr("src",sttImage[1]);
	// $("#gallery-user3 img").attr("src",sttImage[2]);
	// $("#gallery-user4 img").attr("src",sttImage[3]);
	// $("#gallery-user5 img").attr("src",sttImage[4]);
	// $("#gallery-user6 img").attr("src",sttImage[5]);
	// $("#gallery-user7 img").attr("src",sttImage[6]);

	jQuery.each(sttImage, function(index, item) {
		var galleryUser = '#gallery-user' + (index + 1) + ' img';
		$(galleryUser).attr('src', item);
	});


	$('.review-previous').click(function(){
		sttImage.unshift(sttImage[6]);
		sttImage.pop();
		jQuery.each(sttImage, function(index, item) {
			var galleryUser = '#gallery-user' + (index + 1) + ' img';
			$(galleryUser).attr('src', item);
		});
	});

	$('.review-next').click(function(){
		sttImage.push(sttImage[0]);
		sttImage.shift();
		jQuery.each(sttImage, function(index, item) {
			var galleryUser = '#gallery-user' + (index + 1) + ' img';
			$(galleryUser).attr('src', item);
		});
	});

});

//Smoothie Scrool 
$(document).ready(function(){
  // Add smooth scrolling to all links
  $("a").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
      	scrollTop: $(hash).offset().top
      }, 1000, function(){

        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
    });
    } // End if
});
});


//// Register

function registerUser() {
	var email = $("#register-email").val();
	var password = $("#register-password").val();
	var password_confirm = $("#register-password-confirm").val();

	if (email=="") {
		$.alert({
			title: '<span class="text-danger">Lỗi !</span>',
			content: 'Vui lòng điền email của bạn !',
			type: 'red',
			typeAnimated: true,
		});
	}else{
		if (email && email !="") {
			if(!isEmail(email)){
				$.alert({
					title: '<span class="text-danger">Lỗi !</span>',
					content: 'Email không hợp lệ !</span>',
					type: 'red',
					typeAnimated: true,
				});
			}else{
				if (password=="") {
					$.alert({
						title: '<span class="text-danger">Lỗi !</span>',
						content: 'Vui lòng điền mật khẩu !',
						type: 'red',
						typeAnimated: true,
					});
				}else{
					if (password !=password_confirm) {
						$.alert({
							title: '<span class="text-danger">Lỗi !</span>',
							content: 'Mật khẩu không trùng khớp !',
							type: 'red',
							typeAnimated: true,
						});
					}else{
						$.ajax({
							url: '/user/create',
							type: 'POST',
							dataType: 'json',
							data: {
								email: email,
								password : password,
								password_confirm : password_confirm,
								_csrf: "<%= _csrf %>"
							}
						}).done(function(result){
							if (!result.status) {
								if (result.errors && result.errors.length) {
									$.alert({
										title: '<span class="text-danger">Lỗi !</span>',
										content: ''+result.errors[0].msg+'',
										type: 'red',
										typeAnimated: true,
									});
								}
							}else{
								$.alert({
									title: '<span class="text-success">Thành Công !</span>',
									content: 'Đăng kí thành công',
									type: 'green',
									typeAnimated: true,
								});
							}
						})
					}
				}
			}
		}
	}
}

function isEmail(email) {
	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}
