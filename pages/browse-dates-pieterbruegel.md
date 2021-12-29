---
layout: page
title: Dated Works
permalink: /pieterbruegel/browse-dates/
---

{% assign collection = site.pieterbruegel | sort: "numeric_date" %}

<div id="result_count"></div>
<div class="container-fluid d-flex flex-column flex-md-row align-items-start">
  <div id="wax-gallery-date" class="col-12 d-flex flex-wrap">
    {% assign counter = 0 %}
    {% for item in collection %}
      {% if item.realdate %}
        {% include gallery_item.html item=item %}
        {% assign counter = counter | plus: 1 %}
      {% endif %}
    {% endfor %}
  </div>
</div>

<script>
 $( document ).ready(function() {
  $('#result_count').append("Displaying {{ counter }} result{% unless counter == 1 %}s{% endunless %}");
 });
</script>