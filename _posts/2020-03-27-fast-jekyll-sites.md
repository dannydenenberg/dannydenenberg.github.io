---
layout: post
title: Speed up your jekyll web site
---

Tips on speeding up your jekyll website.

### #1. Use a CDN

Just do it. It will help **cache your content**, minify your assets, and make your website more accessible from all parts of the world (if you use a good cdn).

I use [cloudflare](https://www.cloudflare.com/). Many other sites do (digital ocean, etc.). It's free to use and you can put many different domains on it. There is literally a tab named "speed" where you can optimize your caching settings, minimization of files, and image compression.

An additional benefit is that DNS configuration is so so easy and updates almost immediately.

### #2. jekyll-include-cache

This gem will automatically cache specified parts of the page that don't need to be reloaded such as sidebars, navigation features, etc.

To use, include it in your `Gemfile` like so:

```ruby
group :jekyll_plugins do
  gem 'jekyll-include-cache'
end
```

And in your `_config.yml` like so:

```yml
plugins:
  # - jekyll-commonmark
  - jekyll-include-cache
```

Run `bundle install` to install everything before using it in your site.

To use the caching feature on an included file, instead of saying `{\% include foo.html \%}`, simply say `{\% include_cached foo.html \%}`.

### #3. jekyll-compress-images

Yes, compressing your images will make an effect on the load time of your website. For me it was one of the factors that took my time to first byte down by around 300 ms.

I believe that the feature on cloudflare that allows image compression is a pay-to-play feature, thus this jekyll gem can do it for free every time a build is made.

Include it in your `Gemfile` like so:

```ruby
group :jekyll_plugins do
  gem 'jekyll-compress-images', :git => 'https://github.com/valerijaspasojevic/jekyll-compress-images.git'
end
```

Include it in your `_config.yml` like so:

```yml
plugins:
  - jekyll-compress-images
```

That's it for Jekyll image compression!

### #4. Use github pages

I have to say that prior to using github pages, I was very skeptical to the idea. I was using [Netlify](https://netlify.com) and it made builds and minimization and custom domains and many many more features easy as clicking a button.

However, I was trying to get my site to be as fast as possible without switching to Gatsbyjs or some other way to make my JAMStack site. So, I tried switching it to github pages. Wow. That did the trick. It brought my TTFB down around 400 ms.

If you are having trouble even after steps #1 through #3 with site speed, try switching to [github pages](https://pages.github.com/). **It will make a change to the speed of your site**.
