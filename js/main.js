// ToDo List
(function() {

var allItems = [];
var listStatus = 'all';

// Constructor for ToDo list item
// ToDo object should keep track of html element, list text, index in allItems array, and complete status
function ToDoItem(newItemText) {
  this.elem = null;
  this.text = newItemText;
  this.complete = false;
  // If the item text is already in the allItems list, don't add another item. Otherwise, go ahead.
  this.addToList = function() {
    var alreadyHave = false;
    allItems.forEach(function(item) {
      if (item.text === newItemText) {
        alreadyHave = true;
        alert("That item is already on the list!");
      }
    });
    if (!alreadyHave) {
      allItems.push(this);
      localStorage.allItems = JSON.stringify(allItems);
      this.createElement();
    }
  };
  // Create the toDo html item using the handlebar template
  this.createElement = function() {
    var source = $("#list-item-template").html();
    var template = Handlebars.compile(source);
    var context = {
      listText: newItemText
    };
    var html = template(context);
    this.elem = $(html);
    $('.items').prepend(this.elem);
  };
  // Update the complete and incomplete lists, along with the count of incomplete items.
  this.updateLists = function() {
    incomplete = [];
    complete = [];
    allItems.forEach(function(item) {
      if (item.complete) {
        complete.push(item);
      } else {
        incomplete.push(item);
      }
    });
    localStorage.allItems = JSON.stringify(allItems);
    $('.incomplete-items').html(incomplete.length);
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

// Turn the text into an input field when user selects the list item.
var oldText = '';
$('.items').on({
  click: function() {
    oldText = $(this).text();
    $(this).hide();
    $(this).siblings('input').val(oldText).show().focus();
  }
}, 'p');

// Turn the input field back into text when user submits it.
$('.items').on({
  blur: function() {
    var self = this;
    var newText = $(this).val();
    var alreadyExisting = false;
    // Check to see if typed text is already in list of ToDo items
    allItems.forEach(function(item) {
      // If the text matches (but is not itself), then show notice that item already exists.
      if (newText === item.text && item.text !== oldText) {
        alreadyExisting = true;
        alert("Item is already in list!");
        $(self).val(oldText).hide();
        $(self).siblings('p').text(oldText).show();
      }
    });
    if (!alreadyExisting) {
      allItems.forEach(function(item) {
        if (item.text === oldText) {
          item.text = newText;
        }
      });
      localStorage.allItems = JSON.stringify(allItems);
      $(self).hide();
      $(self).siblings('p').text(newText).show();
    }
  }
}, 'input');

// Add hover effect for list items
$('.items').on({
  mouseenter: function(){
    $(this).css('outline','1px solid gray');
  },
  mouseleave: function(){
    $(this).css('outline-style','none');
  }
}, 'p');

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
  var currentItemText = $(this).siblings('p').text();
  // Loop through the existing items to find the one that needs to be deleted, and remove it.
  allItems.forEach(function(item, index) {
    if (item.text === currentItemText) {
      allItems.splice(index, 1);
      item.updateLists();
    }
  });
});

// Add hover effect for check boxes
$('.check').hover(function(){
    $(this).css('border','2px solid green');
  }, function(){
    $(this).css('border','1px solid #ccc');
});

//When the checkbox is clicked, add the green checkmark and strikeout the text, and change the complete status of the item clicked.
$('.items').on('click', '.check', function() {
  var itemText = $(this).siblings('p').text();
  allItems.forEach(function(item) {
    if (item.text === itemText) {
      item.complete = !item.complete;
      item.updateLists();
    }
  });
  $(this).toggleClass('complete');
  $(this).siblings('p').toggleClass('complete');
});

//Add an outline to the buttons in the footer when hovering
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
    if ($(this).val().trim() !== '') {
      var newItemText = $(this).val();
      $(this).val('');
      var newItemObj = new ToDoItem(newItemText);
      newItemObj.addToList();
      newItemObj.updateLists();
    }
  }
});

// When the user clicks the all button, all items are shown.
$('.show-all').click(function() {
  listStatus = 'all';
  $('.items').html('');
  $(this).addClass('active');
  $('.show-active').removeClass('active');
  $('.show-completed').removeClass('active');
  allItems.forEach(function(item) {
      item.createElement();
      if (item.complete) {
        item.elem.find('p').addClass('complete');
        item.elem.find('.check').addClass('complete');
      }
  });
})

// When the user clicks the active button, only the incomplete items are shown.
$('.show-active').click(function() {
  listStatus = 'active';
  $('.items').html('');
  $(this).addClass('active');
  $('.show-all').removeClass('active');
  $('.show-completed').removeClass('active');
  allItems.forEach(function(item) {
    if (!item.complete) {
      item.createElement();
    }
  });
})

// When the user clicks the completed button, only the complete items are shown.
$('.show-completed').click(function() {
  listStatus = 'completed';
  $('.items').html('');
  $(this).addClass('active');
  $('.show-all').removeClass('active');
  $('.show-active').removeClass('active');
  allItems.forEach(function(item) {
    if (item.complete) {
      item.createElement();
      item.elem.find('p').addClass('complete');
      item.elem.find('.check').addClass('complete');
    }
  });
})

// When the user clicks the Clear Completed button, the completed items are deleted.
$('.clear').click(function() {
  if (confirm("Are you sure you want to delete all completed items from this list? This cannot be undone.")) {
    var newAllItems = [];
    allItems.forEach(function(item, index) {
      if (!item.complete) {
        newAllItems.push(item);
      }
    });
    allItems = newAllItems;
    localStorage.allItems = JSON.stringify(allItems);
    $('.show-' + listStatus).trigger('click');
  }
})


//Initialize by checking the last session's localStorage.
if (localStorage.allItems) {
  allItemsOld = JSON.parse(localStorage.allItems);
  allItemsOld.forEach(function(item) {
    newItem = new ToDoItem(item.text);
    newItem.elem = item.elem;
    newItem.complete = item.complete;
    newItem.addToList();
    newItem.updateLists();
    if (newItem.complete) {
      newItem.elem.find('p').addClass('complete');
      newItem.elem.find('.check').addClass('complete');
    }
  });
}


})();
