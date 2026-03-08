
    const issueContainer = document.getElementById('issue-container');
    const totalCount = document.getElementById('total-count');
    const modal = document.getElementById('issue_modal');
    const modalBody = document.getElementById('modal-body');
    let allIssues = [];

    
    async function fetchAllIssues() {
        console.log("fetchAllIssues"); 
        issueContainer.innerHTML = '<div class="col-span-full flex justify-center py-20"><span class="loading loading-spinner loading-lg text-primary"></span></div>';
        
        try {
            const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
            const result = await res.json();
            console.log( result.data); 
            
            allIssues = result.data;
            renderCards(allIssues);
        } catch (err) {
            console.error( err);
            issueContainer.innerHTML = '<p class="text-red-500 col-span-full text-center">Failed to load data.</p>';
        }
    }

    
    function renderCards(issues) {
        issueContainer.innerHTML = '';
        totalCount.innerText = `${issues.length} Issues`;

        issues.forEach(issue => {
            const isClosed = issue.status === 'closed';
            const borderClass = isClosed ? 'border-closed' : 'border-open';
            const statusIcon = isClosed ? 'fa-circle-check text-purple-500' : 'fa-circle-dot text-green-500';

            
            let labelsHTML = '';
            if (issue.labels && Array.isArray(issue.labels)) {
                issue.labels.forEach(label => {
                    const name = label.toLowerCase();
                    let style = 'bg-gray-100 text-gray-500';
                    let icon = 'fa-tag';

                    if (name === 'bug') { style = 'label-bug'; icon = 'fa-bug'; }
                    else if (name === 'help wanted') { style = 'label-help'; icon = 'fa-circle-question'; }
                    else if (name === 'enhancement') { style = 'label-enhancement'; icon = 'fa-wand-magic-sparkles'; }

                    labelsHTML += `<span class="text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1 ${style}">
                        <i class="fa-solid ${icon} text-[8px]"></i> ${label.toUpperCase()}
                    </span>`;
                });
            }

            const card = document.createElement('div');
            card.className = `bg-white p-5 rounded-xl border border-gray-100 ${borderClass} shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition-all`;
            card.onclick = () => showIssueDetails(issue.id);

            card.innerHTML = `
                <div>
                    <div class="flex justify-between items-start mb-3">
                        <i class="fa-solid ${statusIcon} text-lg"></i>
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded uppercase priority-${issue.priority.toLowerCase()}">
                            ${issue.priority}
                        </span>
                    </div>
                    <h3 class="font-bold text-[15px] mb-2 text-gray-800 leading-snug line-clamp-2">${issue.title}</h3>
                    <p class="text-[11px] text-gray-500 line-clamp-2 mb-4 leading-relaxed">${issue.description}</p>
                    <div class="flex flex-wrap gap-2 mb-4">${labelsHTML}</div>
                </div>
                <div class="border-t pt-3 mt-auto">
                    <p class="text-[11px] text-gray-400 font-medium italic">#${issue.id} by ${issue.author}</p>
                    <p class="text-[11px] text-gray-400 mt-1">${new Date(issue.createdAt).toLocaleDateString()}</p>
                </div>`;
            issueContainer.appendChild(card);
        });
    }

    
    function filterIssues(status, btn) {
        console.log( status);
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('btn-active-tab'));
        btn.classList.add('btn-active-tab');

        if (status === 'all') {
            renderCards(allIssues);
        } else {
            const filtered = allIssues.filter(i => i.status === status);
            renderCards(filtered);
        }
    }

    
    async function showIssueDetails(id) {
        console.log( id);
        modalBody.innerHTML = '<div class="flex justify-center p-10"><span class="loading loading-dots loading-lg text-primary"></span></div>';
        modal.showModal();
        
        try {
            const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
            const { data } = await res.json();
            console.log("data") ;

            let modalLabels = '';
            if (data.labels) {
                data.labels.forEach(l => {
                    const style = l.toLowerCase() === 'bug' ? 'label-bug' : (l.toLowerCase() === 'help wanted' ? 'label-help' : 'label-enhancement');
                    modalLabels += `<span class="text-[10px] font-bold px-2 py-1 rounded-full ${style}">${l.toUpperCase()}</span>`;
                });
            }

            modalBody.innerHTML = `
                <div class="p-2">
                    <h2 class="text-2xl font-extrabold text-gray-900 mb-2 leading-tight">${data.title}</h2>
                    <div class="flex items-center gap-2 mb-4">
                        <span class="${data.status === 'open' ? 'modal-badge-opened' : 'modal-badge-closed'}">
                            ${data.status === 'open' ? 'Opened' : 'Closed'}
                        </span>
                        <span class="text-gray-500 text-sm italic">• Opened by ${data.author} • ${new Date(data.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div class="flex gap-2 mb-6">${modalLabels}</div>
                    <div class="text-gray-600 text-[15px] leading-relaxed mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        ${data.description}
                    </div>
                    <div class="grid grid-cols-2 gap-10 border-t border-gray-100 pt-6">
                        <div>
                            <p class="text-xs text-gray-400 font-bold uppercase mb-1">Assignee</p>
                            <p class="font-bold text-gray-800">${data.author}</p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-400 font-bold uppercase mb-1">Priority</p>
                            <span class="px-3 py-1 rounded text-[10px] font-bold uppercase priority-${data.priority.toLowerCase()}">${data.priority}</span>
                        </div>
                    </div>
                </div>`;
        } catch (e) { console.error( e); }
    }


    document.getElementById('search-box').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        console.log(term);
        const filtered = allIssues.filter(i => i.title.toLowerCase().includes(term));
        renderCards(filtered);
    });

    fetchAllIssues();
