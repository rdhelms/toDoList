// ToDo List
(function() {

// List to keep track of incomplete, complete, and all item objects
var incomplete = [];
var complete = [];
var allItems = [];
allItems[0] = new ToDoItem('testing');
allItems.forEach(function(itemObj) {
  $('.items').prepend(itemObj.elem);
});
console.log(allItems[0]);

// If the last session had items in the list, grab those list items
if (localStorage.allItems) {
  allItems = JSON.parse(localStorage.allItems);
  // For all the items that were previously in lists, display them again.
  allItems.forEach(function(itemObj) {
    $('.items').prepend(itemObj.elem);
  });
}
if (localStorage.incomplete) {
  incomplete = JSON.parse(localStorage.incomplete);
}
if (localStorage.complete) {
  complete = JSON.parse(localStorage.complete);
}

console.log(allItems, incomplete, complete);


//Add a new item using the Handlebars template when user enters one
function ToDoItem(newItemText) {
  this.text = newItemText;
  this.index = allItems.length;
  var source = $("#list-item-template").html();
  var template = Handlebars.compile(source);
  var context = {
    itemNumber: this.index,
    listText: newItemText
  };
  var html = template(context);
  this.elem = html;
  this.complete = false;
  this.addToList = function() {
    if (allItems.indexOf(this) > -1) {
      console.log("already in list!");
    } else {
      this.index = allItems.length;
      allItems.push(this);
      localStorage.allItems = JSON.stringify(allItems);
      $('.incomplete-items').html(allItems.length);
    }
    $('.items').prepend(html);
  };
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
    console.log(this);
    var $listItem = $(this);  // HTML element for paragraph
    var $listInput = $(this).siblings('input'); // HTML element for input field
    var listText = $listItem.html(); // Text from paragraph
    $listItem.hide(); // Remove the paragraph element from view
    $listInput.val(listText).css({
      'box-shadow': '0 0 7px inset'
    }).show(); // Assign the old text to the input field and bring the input field to view
    $listInput.focus(); // Give focus to the input field
    $listInput.blur(function() { // When the input field loses focus (user clicks away), assign the input text to the paragraph element and replace the input with the paragraph
      $listItem.html($listInput.val());
      $listInput.hide();
      $listItem.show().appendTo($listInput.parents('article'));
    });
    $listInput.keypress(function(event) { // When the user presses enter after editing a list item, assign the input text to the paragraph element and replace the input with the paragraph
      if (event.keyCode === 13) {
        event.preventDefault();
        $listItem.html($listInput.val());
        $listInput.hide();
        $listItem.show().appendTo($listInput.parents('article'));
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
