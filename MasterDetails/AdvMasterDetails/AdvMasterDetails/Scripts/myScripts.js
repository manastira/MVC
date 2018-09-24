var Categories = []
//fetch categories from database
function Loadcategory(element) {
    if (Categories.length > 0) {
        //ajax function for fetch data
        $.ajax({
            type: "GET",
            url: '/home/getProductCategories',
            success: function (data) {
                Categories = data;
                //render category
                renderCategory(element);
            }
        })
    }
    else {
        //render category to the element
        renderCategory(element);

    }


}
function renderCategory(element) {
    var $ele = $(element);
    $ele.empty();
    $ele.append($('<option/>').val('0').text('select'));
    $.each(Categories, function (i, val) {
        $ele.append($('<option/>').val(val.CategoryID).text(val.CategoryNames));
    })
}

//fetch products

function LoadProduct(categoryDD) {
    $.ajax({
        type: "GET",
        url: "/home/getProducts",
        data: { 'categoryID': $(categoryDD).val() },
        success: function (data) {
            //render products appropriate dropdown
            renderProducts($(categoryDD).parents('.mycontainer').find('select.product'), data);
        },
        error: function (error) {
            console.log(error);
        }
    })
}

function renderProducts(element, data) {
    //render product
    var $ele = $(element);
    $ele.empty();
    $ele.append($('<option/>').val('0').text('select'));
    $.each(data, function (i, val) {
        $ele.append($('<option/>').val(val.ProductID).text(val.ProductName));
    })

}

$(document).ready(function () {
    //Add button click event
    $('#add').click(function () {
        //validation and add order items
        var isAllValid = true;
        if ($('#productCategory').val() == '0') {
            isAllValid = false;
            $('#productCategory').siblings('span.error').css('visibillity', 'visible');
        }
        else {
            $('#productCategory').siblings('span.error').css('visibillity', 'visible');

        }

        if ($('#product').val() == '0') {
            isAllValid = false;
            $('#product').siblings('span.error').css('visibillity', 'visible');
        }
        else {
            $('#product').siblings('span.error').css('visibillity', 'visible');

        }

        if (!($('#quantity').val().trim() != '' && (parseInt($('#quantuty').val()) || 0))) {
            isAllValid = false;
            $('#quantity').siblings('span.error').css('visibillity', 'visible');
        }
        else {
            $('#quantity').siblings('span.error').css('visibillity', 'visible');

        }

        if (!($('#rate').val().trim() != '' && !isNaN($('#rate').val().trim()))) {
            isAllValid = false;
            $('#rate').siblings('span.error').css('visibillity', 'visible');
        }
        else {
            $('#rate').siblings('span.error').css('visibillity', 'visible');

        }

        if (isAllValid) {
            var $newRow = $('#mainrow').clone().removeAttr('id');
            $('.pc', $newRow).val($('#productCategoty').val());
            $('.product', $newRow).val($('#product').val());

            //replace add button with remove button
            $('#add', $newRow).addClass('remove').val('Remove').removeClass('btn-seccess').addClass('btn-danger');

            //remove id attribute from new clone row
            $('#productCategory, #product, #quantuty, #rate, #add', $newRow).removeAttr('id');
            $('span.error', $newRow).remove();
            //append new row
            $('#orderdetailsItems').append($newRow);

            //clear select data
            $('#productCategoty,#product').val('0');
            $('#quantity,#rate').val('');
            $('#orderItemError').empty();

        }
    })

    //remove button click event
    $('#orderdetailsItems').on('click', '.remove', function () {
        $(this).parents('tr').remove();
    });

    $('#submit').click(function () {
        var isAllValid = true;
        //valide order items
        $('#orderItemsError').text('');
        var list = [];
        var errorItemsCount = 0;
        $('#orderdetailsItems tbody tr').each(function (index, ele) {
            if (
                $('select.product', this).val() == "0" || (parseInt($('.quantuty', this).val()) == 0) ||
                $('.rate', this).val() == "" ||
                isNaN($('.rate', this).val())
            ) {
                errorItemsCount++
                $(this).addClass('error');

            }
            elese
            {
                var orderItem = {
                    ProductID: $('select.product', this).val(),
                    Quantuty: parseInt($('.quantuty', this).val()),
                    Rate: parseFloat($('.rate', this).val())
                }
                list.push(orderItem);
            }
        })

        if (errorItemsCount > 0) {
            $('#orderItemError').text(errorItemsCount + 'invalid entry in order item list');
            isAllValid = false;
        }

        if (list.length == 0) {
            $('#orderItemError').text('Atleast 1 order item required');
        }

        if ($('orderNo').val().trim() == '') {
            $('#orderNo').siblings('span.error').css('visibilitty', 'visible');
            isAllValid = false;
        }
        else {
            $('#orderNo').siblings('span.error').css('visibilitty', 'hidden');

        }

        if ($('orderDate').val().trim() == '') {
            $('#orderDate').siblings('span.error').css('visibilitty', 'visible');
            isAllValid = false;
        }
        else {
            $('#orderDate').siblings('span.error').css('visibilitty', 'hidden');

        }

        if (isAllValid) {
            var data = {
                OrderNo: $('#orderNo').val().trim(),
                OrderDate: $('#orderDate').val().trim(),
                Description: $('#description').val().trim(),
                OrderDetails: list
            }

            $(this).val('Please wait...');

            $.ajax({

                type: 'POST',
                url: '/home/save',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (data) {
                    if (data.status) {
                        alert('Successfully saved');
                        //here we will clear the form
                        list = [];
                        $('#orderNo,#orderDate,#description').val('');
                        $('#orderdetailsItems').empty();
                    }
                    else {
                        alert('Error');
                    }
                    $('#submit').text('Save');
                },
                error: function (error) {
                    console.log(error);
                    $('#submit').text('Save');

                }

            });
        }
    });
});

Loadcategory($('#productCategory'));
