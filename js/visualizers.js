/**
 * CS Learning Hub - Custom Visualizer Engine
 * Renders interactive visualizations for data structures
 */

class VisualizerEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.speed = 500;
        this.isPlaying = false;
    }

    clear() {
        this.container.innerHTML = '';
    }

    /**
     * Main entry point to render a specific concept
     */
    render(conceptId) {
        this.clear();

        const controlPanel = document.createElement('div');
        controlPanel.className = 'viz-controls';
        this.container.appendChild(controlPanel);

        const canvas = document.createElement('div');
        canvas.className = 'viz-canvas';
        canvas.id = 'viz-canvas';
        this.container.appendChild(canvas);

        switch (conceptId) {
            case 'arrays':
            case 'strings': // Strings are just char arrays
                this.renderArrayViz(controlPanel, canvas);
                break;
            case 'linked-list':
                this.renderLinkedListViz(controlPanel, canvas);
                break;
            case 'stacks':
                this.renderStackViz(controlPanel, canvas);
                break;
            case 'queues':
                this.renderQueueViz(controlPanel, canvas);
                break;
            case 'sorting':
                this.renderSortingViz(controlPanel, canvas);
                break;
            default:
                this.renderComingSoon(canvas);
        }
    }

    // ==========================================
    // ARRAY VISUALIZER
    // ==========================================
    renderArrayViz(controls, canvas) {
        let data = [10, 20, 30, 40, 50];

        const draw = () => {
            canvas.innerHTML = '';
            data.forEach((val, idx) => {
                const box = document.createElement('div');
                box.className = 'viz-box';
                box.innerHTML = `<span class="val">${val}</span><span class="idx">${idx}</span>`;
                canvas.appendChild(box);
            });
        };

        // Controls
        this.addInput(controls, 'Value', 'arr-input', '60');
        this.addInput(controls, 'Index', 'arr-idx', '2');

        this.addButton(controls, 'Insert', () => {
            const val = parseInt(document.getElementById('arr-input').value) || 0;
            const idx = parseInt(document.getElementById('arr-idx').value) || 0;
            if (idx >= 0 && idx <= data.length) {
                data.splice(idx, 0, val);
                draw();
            }
        });

        this.addButton(controls, 'Delete', () => {
            const idx = parseInt(document.getElementById('arr-idx').value) || 0;
            if (idx >= 0 && idx < data.length) {
                data.splice(idx, 1);
                draw();
            }
        });

        this.addButton(controls, 'Access', () => {
            const idx = parseInt(document.getElementById('arr-idx').value) || 0;
            const boxes = canvas.querySelectorAll('.viz-box');
            if (boxes[idx]) {
                boxes[idx].classList.add('highlight');
                setTimeout(() => boxes[idx].classList.remove('highlight'), 1000);
            }
        });

        draw();
    }

    // ==========================================
    // LINKED LIST VISUALIZER
    // ==========================================
    renderLinkedListViz(controls, canvas) {
        let list = [10, 20, 30];

        const draw = () => {
            canvas.innerHTML = '';
            list.forEach((val, idx) => {
                const node = document.createElement('div');
                node.className = 'viz-node';
                node.innerHTML = `
          <div class="viz-node-val">${val}</div>
          <div class="viz-node-next"></div>
        `;
                canvas.appendChild(node);

                if (idx < list.length - 1) {
                    const arrow = document.createElement('div');
                    arrow.className = 'viz-arrow';
                    arrow.innerHTML = '→';
                    canvas.appendChild(arrow);
                } else {
                    const nullPtr = document.createElement('div');
                    nullPtr.className = 'viz-null';
                    nullPtr.innerHTML = 'NULL';
                    canvas.appendChild(nullPtr);
                }
            });
        };

        this.addInput(controls, 'Value', 'll-input', '40');
        this.addButton(controls, 'Push Front', () => {
            const val = parseInt(document.getElementById('ll-input').value) || 0;
            list.unshift(val);
            draw();
        });
        this.addButton(controls, 'Push Back', () => {
            const val = parseInt(document.getElementById('ll-input').value) || 0;
            list.push(val);
            draw();
        });
        this.addButton(controls, 'Pop Front', () => {
            list.shift();
            draw();
        });
        this.addButton(controls, 'Pop Back', () => {
            list.pop();
            draw();
        });

        draw();
    }

    // ==========================================
    // STACK VISUALIZER
    // ==========================================
    renderStackViz(controls, canvas) {
        let stack = [10, 20, 30];

        // Stacks grow upwards visually
        canvas.style.flexDirection = 'column-reverse';
        canvas.style.justifyContent = 'flex-start';

        const draw = () => {
            canvas.innerHTML = '';
            stack.forEach((val) => {
                const box = document.createElement('div');
                box.className = 'viz-box viz-stack-box';
                box.textContent = val;
                canvas.appendChild(box);
            });
        };

        this.addInput(controls, 'Value', 'stack-input', '40');
        this.addButton(controls, 'Push', () => {
            const val = parseInt(document.getElementById('stack-input').value) || 0;
            stack.push(val);
            draw();
        });
        this.addButton(controls, 'Pop', () => {
            stack.pop();
            draw();
        });

        draw();
    }

    // ==========================================
    // QUEUE VISUALIZER
    // ==========================================
    renderQueueViz(controls, canvas) {
        let queue = [10, 20, 30];

        const draw = () => {
            canvas.innerHTML = '';
            queue.forEach((val) => {
                const box = document.createElement('div');
                box.className = 'viz-box';
                box.textContent = val;
                canvas.appendChild(box);
            });
        };

        this.addInput(controls, 'Value', 'q-input', '40');
        this.addButton(controls, 'Enqueue', () => {
            const val = parseInt(document.getElementById('q-input').value) || 0;
            queue.push(val);
            draw();
        });
        this.addButton(controls, 'Dequeue', () => {
            queue.shift();
            draw();
        });

        draw();
    }

    // ==========================================
    // SORT VISUALIZER
    // ==========================================
    renderSortingViz(controls, canvas) {
        let arr = Array.from({ length: 15 }, () => Math.floor(Math.random() * 90) + 10);

        const draw = (highlightIndices = []) => {
            canvas.innerHTML = '';
            canvas.style.alignItems = 'flex-end';
            canvas.style.height = '300px';

            arr.forEach((val, idx) => {
                const bar = document.createElement('div');
                bar.className = 'viz-bar';
                bar.style.height = `${val * 2}px`; // Scale factor
                bar.textContent = val;
                if (highlightIndices.includes(idx)) bar.classList.add('highlight');
                canvas.appendChild(bar);
            });
        };

        const sleep = (ms) => new Promise(r => setTimeout(r, ms));

        this.addButton(controls, 'Generate New', () => {
            arr = Array.from({ length: 15 }, () => Math.floor(Math.random() * 90) + 10);
            draw();
        });

        this.addButton(controls, 'Bubble Sort', async () => {
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr.length - i - 1; j++) {
                    draw([j, j + 1]);
                    await sleep(200);
                    if (arr[j] > arr[j + 1]) {
                        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                        draw([j, j + 1]);
                        await sleep(200);
                    }
                }
            }
            draw([]);
        });

        draw();
    }

    // Helper
    renderComingSoon(canvas) {
        canvas.innerHTML = `<div class="viz-msg">Custom visualizer for this concept is coming soon! <br> Please assume standard behavior or check the text resources.</div>`;
    }

    // UI Helpers
    addButton(parent, text, onClick) {
        const btn = document.createElement('button');
        btn.className = 'viz-btn';
        btn.textContent = text;
        btn.onclick = onClick;
        parent.appendChild(btn);
    }

    addInput(parent, placeholder, id, defaultValue) {
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'viz-input';
        input.id = id;
        if (defaultValue) input.value = defaultValue;
        input.placeholder = placeholder;
        parent.appendChild(input);
    }
}

window.Visualizer = new VisualizerEngine('visualizer-section');
