(function () {
  var nav = document.getElementById('post-toc');
  var content = document.querySelector('.post-content');
  if (!nav || !content) return;

  var headings = content.querySelectorAll('h1, h2, h3, h4');
  if (!headings.length) return;

  var list = document.createElement('ul');
  list.className = 'post-toc-list';

  var links = [];
  headings.forEach(function (heading) {
    if (!heading.id) return;

    var item = document.createElement('li');
    item.className = 'post-toc-item post-toc-item--' + heading.tagName.toLowerCase();

    var link = document.createElement('a');
    link.href = '#' + heading.id;
    link.textContent = heading.textContent;
    link.className = 'post-toc-link';

    item.appendChild(link);
    list.appendChild(item);
    links.push({ heading: heading, link: link });
  });

  if (!links.length) return;
  nav.appendChild(list);

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        var match = links.find(function (l) { return l.heading === entry.target; });
        if (!match) return;
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.link.classList.remove('post-toc-link--active'); });
          match.link.classList.add('post-toc-link--active');
        }
      });
    },
    { rootMargin: '0px 0px -80% 0px' }
  );

  links.forEach(function (l) { observer.observe(l.heading); });
})();
