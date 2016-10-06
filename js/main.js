// ToDo List
(function() {

if (localStorage.allItems) {
  var allItems = JSON.parse(localStorage.allItems);
} else {
  var allItems = [];
}
if (localStorage.incomplete) {
  var incomplete = JSON.parse(localStorage.incomplete);
} else {
  var incomplete = [];
}
if (localStorage.complete) {
  var complete = JSON.parse(localStorage.complete);
} else {
  var complete = [];
}
console.log(localStorage, allItems);

allItems.forEach(function(item) {
  addListItem(item);
});

//Add a new item using the Handlebars template when user enters one
function addListItem(newListItem) {
  var source   = $("#list-item-template").html();
  var template = Handlebars.compile(source);
  var context = {listText: newListItem};
  var html    = template(context);
  $('.items').prepend(html);
  if (allItems.indexOf(newListItem) > -1) {
    console.log("already in list!");
    $('.incomplete-items').html(allItems.length);
  } else {
    allItems.push(newListItem);
    localStorage.allItems = JSON.stringify(allItems);
    $('.incomplete-items').html(allItems.length);
  }
}


/* Event handlers below */
// Add an outline when hovering over input field
$('.new-todo').hover(function() {
  $(this).css({
    outline: '1px solid blue'
  });
}, function() {
  $(this).css({
    outline: '0'
  });
});

// Allow editing when a list item is clicked
$('.items').on({
  click: function() {
    var $listItem = $(this);
    var $listInput = $(this).siblings('input');
    var listText = $listItem.html();
    $listItem.hide();
    $listInput.val(listText).css({
      'display': 'block',
      'box-shadow': '0 0 7px inset'
    });
    $listInput.focus();
    $listInput.blur(function() {
      $listItem.html($(this).val());
      $(this).hide();
      $listItem.show().appendTo($(this).parents('article'));
    });
    $listInput.keypress(function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        $listItem.html($(this).val());
        $(this).hide();
        $listItem.show().appendTo($(this).parents('article'));
      }
    });
  }
}, 'p');
// Add hover effect for list items
$('p').hover(function(){
    $(this).css('outline','1px solid gray');
  }, function(){
    $(this).css('outline-style','none');
});

// Display the delete button when list items are hovered over
$('.items').on({
  mouseenter: function() {
    $(this).find('.delete').show();
  },
  mouseleave: function() {
    $(this).find('.delete').hide();
  }
}, 'li');

//When the delete button is clicked, delete the list item.
$('.items').on('click', '.delete', function() {
  $(this).parents('li').remove();
  var item = $(this).siblings('p').text();
  var index = allItems.indexOf(item);
  allItems.splice(index,1);
  localStorage.allItems = JSON.stringify(allItems);
  $('.incomplete-items').html(allItems.length);
  console.log(allItems);
});

//When the checkbox is clicked, add the green checkmark and strikeout the text
$('.items').on('click', '.check', function() {
  console.log("Complete");
  $(this).toggleClass('complete');
  $(this).siblings('p').toggleClass('complete');
  $(this).siblings('input').blur();
});
// Add hover effect for check boxes
$('.check').hover(function(){
    $(this).css('border','2px solid green');
  }, function(){
    $(this).css('border','1px solid #ccc');
});

//Add on an outline to the butons in the footer when hovering
$('footer').find('button').hover(function() {
  $(this).css({
    outline: '1px solid gray'
  });
}, function() {
  $(this).css({
    outline: '0'
  });
});

// When the user presses enter in the input field, add a new list item
$('.new-todo').keypress(function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    addListItem($(this).val());
    $(this).val('');
  }
});

})();
