---
layout: page
title: Archive
sidebar: true
---

<!-- ## Blog Posts -->

{% for post in site.posts %}

- <span id='datet' style="display: none">{{ post.date | date_to_string }}</span> [ {{ post.title }} ]({{ post.url }})
  {% endfor %}

<style>
  #datet {
    color: #9a9a9aa1;
  }  
</style>
<!-- <ul>
  {% for post in site.posts %}
  <li>
    <a href="{{post.url}}">{{post.title}}</a
    ><span class="post-date">{{ post.date | date_to_string }}</span>
  </li>
  {% endfor %}
</ul> -->
