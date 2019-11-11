---
layout: default
title: Blog
---

<div class="archive">
  
  {% for post in site.posts %}
  {% assign currentDate = post.date | date: "%Y" %}
  {% if currentDate != myDate %}
      {% unless forloop.first %}</ul>{% endunless %}
      <h2>{{ currentDate }}</h2>
      <ul class="archive-els">
      {% assign myDate = currentDate %}
  {% endif %}
  <!-- <li><a href="{{ post.url }}"><span>{{ post.date | date: "%B %-d, %Y" }}</span> - {{ post.title }}</a></li> -->
  <li class="archive-link"><a href="{{ post.url }}">{{ post.title }}</a> <span class="archive-date">{{ post.date | date: "%B %-d, %Y" }}</span></li>
  
  
  
  {% if forloop.last %}</ul>{% endif %}
{% endfor %}
  </div>
