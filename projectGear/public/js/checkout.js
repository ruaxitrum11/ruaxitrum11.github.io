
//checkout-input-minus-plus

jQuery(document).ready(function(){
    // This button will increment the value
    $('.qtyplus').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        fieldName = $(this).attr('field');
        // Get its current value
        var currentVal = parseInt($('input[name='+fieldName+']').val());
        // If is not undefined
        if (!isNaN(currentVal)) {
            // Increment
            $('input[name='+fieldName+']').val(currentVal + 1);
        } else {
            // Otherwise put a 0 there
            $('input[name='+fieldName+']').val(1);
        }
    });
    // This button will decrement the value till 0
    $(".qtyminus").click(function(e) {
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        fieldName = $(this).attr('field');
        // Get its current value
        var currentVal = parseInt($('input[name='+fieldName+']').val());
        // If it isn't undefined or its greater than 0
        if (!isNaN(currentVal) && currentVal > 1) {
            // Decrement one
            $('input[name='+fieldName+']').val(currentVal - 1);
        } else {
            // Otherwise put a 0 there
            $('input[name='+fieldName+']').val(1);
        }
    });
});

//remove item checkout 
$('.remove-product-1').click(function(){
    $('.checkout-item-1').attr('style',"display:none");
});
$('.remove-product-2').click(function(){
    $('.checkout-item-2').attr('style',"display:none");
});

$(document).ready(function(){
    if($('.item-block').css('display') === 'none')
        {$('.item-none').addClass('item-none-show');};
    if($('.item-block').css('display') === 'block')
        {$('.item-none').removeClass('item-none-show');}
});