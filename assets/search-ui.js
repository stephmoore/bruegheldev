// Methods and jQuery UI for Wax search box
function excerptedString(str) {
  str = str || ''; // handle null > string
  if (str.length < 40) {
    return str;
  }
  else {
    return `${str.substring(0, 40)} ...`;
  }
}

function getThumbnail(item, url) {
  if ('thumbnail' in item) {
    return `<img class='sq-thumb-sm' src='${url}/${item.thumbnail}'/>&nbsp;&nbsp;&nbsp;`
  }
  else {
    return '';
  }
}

function displayResult(item, fields, url) {
  var pid   = item.pid;
  var label = item.label || 'Untitled';
  var link  = item.permalink;
  var thumb = getThumbnail(item, url);
  var meta  = []
  
  var date = item.realdate || 'n.d.';
  var width = item.width_cm;
  var height = item.height_cm;
  var diameter = item.diameter_cm;
  var support = item.support; 
  var location = item.location_collection;
  var dimensions;

  if (width) {
    dimensions = width + " cm x " + height + " cm";
  } else if (diameter) {
    dimensions = diameter + " cm";
  }

  meta.push(`${date}`);
  if (dimensions) {
    meta.push(`${dimensions}`);
  }
  if (support) {
    meta.push(`${support}`);
  }
  if (location) {
    meta.push(`${location}`);
  }
  
  return `<div class="result"><a href="${url}${link}">${thumb}<p><span class="title">${item.label}</span><br><span>${meta.join(' <br /> ')}</span></p></a></div>`;
}

function startSearchUI(fields, indexFile, url) {
  $.getJSON(indexFile, function(store) {
    var index  = new elasticlunr.Index;

    index.saveDocument(false);
    index.setRef('lunr_id');

    for (i in fields) { index.addField(fields[i]); }
    for (i in store)  { index.addDoc(store[i]); }

    function run_search(terms) {
      var results_div = $('#results');
      var query       = terms
      var results     = index.search(query, { boolean: 'AND', expand: true });

      results_div.empty();
      results_div.append(`<p class="results-info">Displaying ${results.length} results</p>`);

      for (var r in results) {
        var ref    = results[r].ref;
        var item   = store[ref];
        var result = displayResult(item, fields, url);

        results_div.append(result);
      }
    }
    if (location.search) {
      var arg = decodeURIComponent(location.search);
      var search = arg.replace("?search=", "");
      $('input#search').val(search) // Is this how you assign in jquery?
      run_search(search);
    }
    $('input#search').on('keyup', function() {
      var query       = $(this).val();
      run_search(query);
    });
  });
}
