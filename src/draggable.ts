function intercept<T extends HTMLElement>(element: T, event: string, callback: CallableFunction|null = null): T {
    element.addEventListener(event, async <T extends Event>(event: T) => {
        event.stopPropagation();
        event.preventDefault();

        if (callback) {
            await callback(element, event);
        }
    });

    return element;
}

function tap<T extends HTMLElement>(element: T, callback: CallableFunction): T {
    callback(element);

    return element;
}

function droppable(element: HTMLElement, callback: CallableFunction) {
    const classes: string[] = ['border-8', 'border-dashed', 'border-blue-500'];

    intercept(element, 'dragenter', (element: HTMLElement) => {
        element.classList.add(...classes);
    });

    intercept(element, 'dragleave', (element: HTMLElement) => {
        element.classList.remove(...classes);
    });

    intercept(element, 'dragover');

    intercept(element, 'drop', (element: HTMLElement, event: DragEvent) => {
        if (event.dataTransfer?.files) {
            callback(element, event.dataTransfer);
        }

        element.classList.remove(...classes);
    });
}

((document: Document) => {
    const form: HTMLFormElement|null = document.querySelector('form');
    const input: HTMLInputElement|null = document.querySelector('input#link');

    const paragraph: HTMLParagraphElement|null = document.querySelector('p');

    if (! form || ! input || ! paragraph) {
        alert('Element(s) are missing for this demo to work correctly.');

        return;
    }

    intercept(form, 'submit', async (form: HTMLFormElement) => {
        let response = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form)
        });

        let result = await response.json();

        input.setAttribute('value', '');

        if (result.status !== 201) {
            paragraph.innerText = result.message;
        }

        const url = new URL(window.location.toString());

        paragraph.innerText = `${url.origin}/${result.data.shortened_url}`;
    });

    droppable(document.body, async (element: HTMLElement , transfer: DataTransfer) => {
        const urls: Set<string> = new Set();

        for (let i = 0; i < transfer.items.length; i++) {
            if (['text/uri-list', 'text/plain'].includes(transfer.items[i].type)) {
                urls.add(transfer.getData('URL'));

                continue;
            }
        }

        if (urls.size > 0) {
            tap(form, () => input.setAttribute('value', urls.values().next().value))
                .dispatchEvent(new Event('submit'));
        }
    });
})(document);
