async function droppable(element: HTMLElement, callback: Function) {
    const classes: string[] = ['border-8', 'border-dashed', 'border-blue-500'];

    element.addEventListener('dragenter', (event: DragEvent) => {
        event.stopPropagation();
        event.preventDefault();

        element.classList.add(...classes);
    });

    element.addEventListener('dragleave', (event: DragEvent) => {
        event.stopPropagation();
        event.preventDefault();

        element.classList.remove(...classes);
    });

    element.addEventListener('dragover', (event: DragEvent) => {
        event.stopPropagation();
        event.preventDefault();
    });

    element.addEventListener('drop', (event: DragEvent) => {
        event.stopPropagation();
        event.preventDefault();

        if (event.dataTransfer?.files) {
            callback(element, event.dataTransfer);
        }

        element.classList.remove(...classes);
    });
}

((document: Document) => {
    droppable(document.body, async (element: HTMLElement , transfer: DataTransfer) => {
        const input: HTMLInputElement|null = element.querySelector('#clip');
        const urls: Set<string> = new Set();

        for (let i = 0; i < transfer.items.length; i++) {
            if (['text/uri-list', 'text/plain'].includes(transfer.items[i].type)) {
                urls.add(transfer.getData('URL'));

                continue;
            }
        }

        if (urls.size > 0) {
            if (! input) {
                return;
            }

            input.value = urls.values().next().value;
        }
    });
})(document);
