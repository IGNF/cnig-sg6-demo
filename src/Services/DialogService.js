import { Subject } from 'rxjs';

class DialogService {

    selector;

    constructor() {
        if (DialogService.instance) {
            return DialogService.instance;
        }
        DialogService.instance = this;
    }

    open(component) {
        if (!component.getElement || !component.registerEvents) {
            console.error('[DialogService] must open component');
        }
        const node = document.createElement('div');
        node.classList.add('app-dialog');

        node.appendChild(component.getElement());

        const container = document.querySelector('#container');
        container.appendChild(node);

        component.registerEvents();
    }

    close() {
        const dialogs = document.querySelectorAll('#container > .app-dialog');
        const container = document.querySelector('#container');

        dialogs.forEach((dialog) => {
            container.removeChild(dialog);
        });
    }


}

export default DialogService;
