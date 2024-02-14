function compile() {
    const language = document.getElementById('language').value;
    const code = document.getElementById('code').value;

    fetch('/compile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, language })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('output-screen').textContent = data.output;
    })
    .catch(error => console.error('Error:', error));
}
