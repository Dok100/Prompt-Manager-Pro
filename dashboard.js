document.addEventListener('DOMContentLoaded', () => {
    const prompts = JSON.parse(localStorage.getItem('prompts')) || [];
    const categories = JSON.parse(localStorage.getItem('categories')) || [];

    const categoryCounts = {};
    categories.forEach(cat => {
        categoryCounts[cat.name] = 0;
    });

    const tagCounts = {};

    prompts.forEach(prompt => {
        const cat = categories.find(c => c.id === prompt.category);
        const name = cat ? cat.name : prompt.category;
        categoryCounts[name] = (categoryCounts[name] || 0) + 1;

        (prompt.tags || []).forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });

    document.getElementById('categoryOverview').innerHTML = `
        <h2>Kategorien</h2>
        <ul>${Object.keys(categoryCounts).map(name => `<li>${name}: ${categoryCounts[name]}</li>`).join('')}</ul>
    `;

    const topPrompts = prompts
        .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
        .slice(0, 5);
    document.getElementById('topPrompts').innerHTML = `
        <h2>Meistgenutzte Prompts</h2>
        <ul>${topPrompts.map(p => `<li>${p.title} (${p.usageCount || 0}×)</li>`).join('')}</ul>
    `;

    const favoritePrompts = prompts.filter(p => p.favorite).slice(0, 10);
    document.getElementById('favoritePrompts').innerHTML = `
        <h2>Favoriten</h2>
        <ul>${favoritePrompts.map(p => `<li>${p.title}</li>`).join('')}</ul>
    `;

    const metrics = document.getElementById('metrics');
    const total = prompts.length;
    metrics.innerHTML = `<p><strong>Gesamtanzahl Prompts:</strong> ${total}</p>`;

    // Chart: Prompts per category
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    new Chart(categoryCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(categoryCounts),
            datasets: [{
                label: 'Prompts pro Kategorie',
                data: Object.values(categoryCounts),
                backgroundColor: 'rgba(0, 122, 255, 0.5)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            }
        }
    });

    // Chart: Tag distribution
    const tagCtx = document.getElementById('tagChart').getContext('2d');
    new Chart(tagCtx, {
        type: 'pie',
        data: {
            labels: Object.keys(tagCounts),
            datasets: [{
                label: 'Tag Verteilung',
                data: Object.values(tagCounts),
                backgroundColor: Object.keys(tagCounts).map((_, i) => `hsl(${i * 50},70%,70%)`)
            }]
        },
        options: {
            responsive: true
        }
    });
});
