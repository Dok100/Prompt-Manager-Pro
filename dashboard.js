document.addEventListener('DOMContentLoaded', () => {
    const prompts = JSON.parse(localStorage.getItem('prompts')) || [];
    const categories = JSON.parse(localStorage.getItem('categories')) || [];

    const counts = {};
    categories.forEach(cat => {
        counts[cat.id] = 0;
    });

    prompts.forEach(prompt => {
        if (counts[prompt.category] !== undefined) {
            counts[prompt.category]++;
        } else {
            counts[prompt.category] = 1;
        }
    });

    const metrics = document.getElementById('metrics');
    const total = prompts.length;
    let html = `<p><strong>Gesamtanzahl Prompts:</strong> ${total}</p>`;
    html += '<ul>';
    Object.keys(counts).forEach(id => {
        const category = categories.find(c => c.id === id);
        const name = category ? category.name : id;
        html += `<li>${name}: ${counts[id]}</li>`;
    });
    html += '</ul>';
    metrics.innerHTML = html;
});
