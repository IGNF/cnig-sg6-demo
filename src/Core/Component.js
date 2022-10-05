
export class Component {

    name;

    getTemplate() { return ''; }

    getElement() {
        const element = document.createElement('div');
        element.innerHTML = this.getTemplate();
        element.classList.add(this.name);
        return element;
    }

    getStyle() { return ''; }

    removeAll() {
        const components = document.getElementsByClassName(this.name);
        Array.from(components).forEach(c => c.remove());
    }

}

export default Component;
