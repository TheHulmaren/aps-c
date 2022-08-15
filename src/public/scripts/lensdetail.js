var nPerPage = 10;
var pageButtonRange = 8;
var pageIndex = 1;
var articleCount;

function appendArticle(target, poster, text, date, atBeginning) {
  var divId = $("<div></div>").addClass("d-flex flex-row");

  var pId;
  if (poster == "Anonymous") {
    pId = $("<p></p>").html("ID: Anonymous").addClass("m-1 text-secondary");
  } else {
    pId = $("<p></p>").html(`ID: ${poster}`).addClass("m-1 text-dark");
  }

  divId.append(pId);

  var divText = $("<div></div>")
    .addClass("m-1 ms-2 d-flex flex-row")
    .append($("<p></p>").addClass("m-0").html(text));

  var time = $("<p></p>").html(date).addClass("fs-6 text-secondary m-0 ms-2 mb-2");

  var div = $("<div></div>").append(divId, divText, time);

  if (atBeginning) {
    target.prepend(div);
  } else {
    target.append(div);
  }
}

function fetchArticles(nPerPage, pageIndex, lensId, cb) {
  var data = {
    nPerPage: nPerPage,
    pageNum: pageIndex,
    lensId: lensId,
  };
  $.ajax({
    method: "GET",
    url: "/fetch/articles",
    data: data,
  })
    .done((result) => {
      console.log(result.message);
      cb(null, result.articles);
    })
    .fail((xhr, textStatus, errorThrown) => {
      console.log(result.message);
      cb(errorThrown);
    });
}

function DisplayArticles(articles) {
  var target = $("#articlesSection").empty();

  for (var i = 0; i < articles.length; i++) {
    appendArticle(
      target,
      articles[i].poster,
      articles[i].text,
      articles[i].date
    );
  }
}

function initArticles() {
  fetchArticles(nPerPage, pageIndex, getLensId(), (err, result) => {
    if (err) return console.log(err);
    DisplayArticles(result);
  });
}

function appendButton(target, index) {
  var pageItem = $("<li></li>").addClass("page-item");
  var pageLink = $("<p></p>")
    .addClass("btn page-link pageButton")
    .attr("data-index", index)
    .html(index);
  pageItem.append(pageLink);

  target.append(pageItem);
}

function updateButtons(currentIndex, articleCount) {
  var buttonsCount = Math.ceil(articleCount / nPerPage);
  var displayedCount;
  if (
    Math.floor(currentIndex / pageButtonRange) <
    Math.floor(buttonsCount / pageButtonRange)
  ) {
    displayedCount = pageButtonRange;
  } else {
    displayedCount = buttonsCount % pageButtonRange;
  }
  var from = Math.floor(currentIndex / pageButtonRange) * pageButtonRange;
  var target = $("#pageButtonsSection").empty();

  var prevButton = $("<li></li>").addClass("page-item");
  var pPrev = $("<p></p>")
    .addClass("btn page-link prevButton")
    .html("Previous");
  prevButton.append(pPrev);
  target.append(prevButton);

  for (var i = 0; i < displayedCount; i++) {
    appendButton(target, from + i + 1);
    console.log(from + i + 1);
  }

  var nextButton = $("<li></li>").addClass("page-item");
  var pNext = $("<p></p>").addClass("btn page-link nextButton").html("Next");
  nextButton.append(pNext);
  target.append(nextButton);
}
