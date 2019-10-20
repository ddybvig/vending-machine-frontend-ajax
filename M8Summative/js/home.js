var itemSelection = "";
var moneyInput = 0;
$(document).ready(function() {
  loadItems();
  $('#moneyInput').val("0.00");
  $('#itemSelection').val("");
  $('#messageInput').val("");
  $('#changeInput').val("");
  var numQuarters = 0;
  var numDimes = 0;
  var numNickels = 0;
  $('#addDollar').click(function(){
    numQuarters +=4;
    moneyInput +=1;
    $('#moneyInput').val(parseFloat(moneyInput).toFixed(2));
  });
  $('#addQuarter').click(function(){
    numQuarters ++;
    moneyInput+=0.25;
    $('#moneyInput').val(parseFloat(moneyInput).toFixed(2));
  });
  $('#addDime').click(function(){
    numDimes++;
    moneyInput+=0.10;
    $('#moneyInput').val(parseFloat(moneyInput).toFixed(2));
  });
  $('#addNickel').click(function(){
    numNickels++;
    moneyInput+=0.05;
    $('#moneyInput').val(parseFloat(moneyInput).toFixed(2));
  });
  $('#purchaseItem').click(function(){
    purchaseItem();
  });
  $('#returnChange').click(function(){
    $('#changeInput').val(numQuarters+' quarters, '+numDimes+' dimes, '+numNickels+' nickels');
    moneyInput = 0;
    $('#moneyInput').val("0.00");
  })
})

function loadItems() {
	$("#displayItems").empty();
	$.ajax({
		type : 'GET',
		url : 'http://tsg-vending.herokuapp.com/items',
		success : function(data) {
			$.each(data, function(index, item) {
        var adjustedIndex = index + 1;
        var itemCard = "<div class='card col-4'>";
        itemCard += adjustedIndex;
				itemCard += "<button class='itemSelection' value='"+item.id+"'>" + item.name + "</button>";
				itemCard += "$" + (item.price).toFixed(2) + " ";
				itemCard += "Quantity Left: " + item.quantity;
				itemCard += "</div>"
				$("#displayItems").append(itemCard);
			});
      $('.itemSelection').click(function(){ //item not defined out here so i need to do something else
        itemSelection = $(this).val();
        $('#itemSelection').val(itemSelection);
      })
		},
		error : function(jqXhr) {
			console.log(jqXhr);
			alert("failure");
		}
	});
}

function purchaseItem() {
  $.ajax({
    type : 'POST',
    url : 'http://tsg-vending.herokuapp.com/money/' + moneyInput + '/item/' + itemSelection,
    success : function(data){
      $('#changeInput').val(data.quarters+' quarters, ' + data.dimes+' dimes, ' + data.nickels+ ' nickels, '+ data.pennies+' pennies');
      $('#messageInput').val("THANK YOU!");
      loadItems();
    },
    error : function(jqXhr) {
			console.log(jqXhr);
      $('#messageInput').val(jqXhr.responseJSON.message);
		}
  });
  $('#returnChange').click(function(){
    $('#moneyInput').val("0.00");
    $('#itemSelection').val("");
    $('#messageInput').val("");
    $('#changeInput').val("");
  })
}
