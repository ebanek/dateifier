document.addEventListener('DOMContentLoaded', function() {
  browser.tabs.query({ active: true, currentWindow: true })
    .then(tabs => {
      const currentUrl = tabs[0].url;
      const encodedUrl = encodeURIComponent(currentUrl);
      const apiUrl = `https://web.archive.org/cdx/search/cdx?url=${encodedUrl}&output=json`;

      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          const archiveDates = data.slice(1).map(s => s[1]);

          archiveDates.forEach(dateString => {
	    const year = dateString.slice(0, 4);
            const month = dateString.slice(4, 6);
            const day = dateString.slice(6, 8);
            const hour = dateString.slice(8, 10);
            const minute = dateString.slice(10, 12);
            const second = dateString.slice(12, 14);
            const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `https://web.archive.org/web/${dateString}/${currentUrl}`;
            link.target = '_blank';
            link.textContent = date.toLocaleString();
            listItem.appendChild(link);
	    document.getElementById('archiveDates').appendChild(listItem);
          });
        })
        .catch(error => {
          console.error('Error fetching archival dates:', error);
        });
    })
    .catch(error => {
      console.error('Error retrieving current tab:', error);
    });
});
