async function droppable(element: HTMLElement, callback: CallableFunction) {
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
        let form: HTMLFormElement|null = element.querySelector('form');

        const urls: Set<string> = new Set();

        for (let i = 0; i < transfer.items.length; i++) {
            if (['text/uri-list', 'text/plain'].includes(transfer.items[i].type)) {
                urls.add(transfer.getData('URL'));

                continue;
            }
        }

        if (urls.size > 0) {
            if (! form) {
                return;
            }

            tap(form, (form: HTMLFormElement) => {
                form.children.item(0)?.children.namedItem('clip')
                    ?.setAttribute('value', urls.values().next().value);
            }).submit();
        }
    });
})(document);

function tap<T extends HTMLElement>(element: T, callback: CallableFunction): T {
    callback(element);

    return element;
}
