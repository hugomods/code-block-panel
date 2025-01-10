import { default as params } from '@params';
import snackbar from 'mods/snackbar/js/index.ts';
import i18n from './i18n';

export default class Panel {
    private highlight: HTMLElement

    private pre: HTMLElement

    private wrapper: HTMLElement

    private ele: HTMLElement

    constructor(private code: HTMLElement) {
    }

    init() {
        if (!params.line_nos) {
            this.code.classList.add('code-no-ln')
        }
        if (params.wrap) {
            this.code.classList.add('code-wrap')
        }

        this.pre = this.code.parentElement as HTMLElement
        this.highlight = this.pre.parentElement as HTMLElement

        this.ele = document.createElement('div')
        this.ele.className = 'code-block-panel'

        this.wrapper = document.createElement('div')
        this.wrapper.className = 'code-block-panel-wrapper'
        this.wrapper.appendChild(this.ele)

        this.maxLines()
        this.title()
        this.lineNoButton()
        this.wrapButton()
        this.expandButton()
        this.copyButton()

        this.pre.appendChild(this.wrapper)
    }

    // Returns the lines of code block.
    private lines(): Array<HTMLElement> {
        return Array.from(this.code.querySelectorAll(':scope > span'))
    }

    private maxHeight

    private maxLines() {
        const lines = this.lines()
        const maxLines = this.code.closest('.highlight')?.getAttribute('data-max-lines') ?? params.max_lines
        if (maxLines > 0 && lines.length > maxLines) {
            const offsetTop = lines[maxLines].offsetTop
            if (offsetTop > 0) {
                this.pre.style.maxHeight = this.maxHeight = offsetTop + 'px'
            }
        }
    }

    // Display the title
    private title() {
        const title = this.highlight.getAttribute('title')
        if (title === null) {
            return
        }

        this.code.setAttribute('title', title)
    }

    private button(name: string, callback: CallableFunction): HTMLButtonElement {
        const btn = document.createElement('button')
        btn.className = 'code-block-action code-block-action-' + name
        btn.innerHTML = params.icons[name]
        btn.addEventListener('click', () => {
            callback()
        })
        return btn
    }

    private copyButton() {
        const btn = this.button('copy', () => {
            this.copy()
        })
        this.ele.appendChild(btn)
    }

    private copy() {
        const clone = this.code.cloneNode(true) as HTMLElement;
        // remove line numbers.
        clone.querySelectorAll('.ln, :scope > span > span:first-child').forEach((ln) => {
            ln.remove();
        });
        navigator.clipboard.writeText(clone.innerText).then(() => {
            snackbar.add(i18n.translate('copied', null, 'Copied!'))
        }).catch((err) => {
            snackbar.add(i18n.translate('copy_failed', null, 'Copy failed.'))
            console.error(err)
        })
    }

    private wrapButton() {
        const btn = this.button('wrap', () => {
            this.toggleClass('code-wrap')
        })
        this.ele.appendChild(btn)
    }

    private toggleClass(className: string) {

        if (this.code.classList.contains(className)) {
            this.code.classList.remove(className)
            return
        }

        this.code.classList.add(className)
    }

    private lineNoButton() {
        const btn = this.button('ln', () => {
            this.toggleClass('code-no-ln')
        })
        this.ele.appendChild(btn)
    }

    private expandButton() {
        const btn = this.button('expand', () => {
            this.expand()
        })
        this.ele.appendChild(btn)
    }

    private expand() {
        if (!this.pre.style.maxHeight && !this.maxHeight) {
            return
        }

        if (this.pre.style.maxHeight) {
            this.pre.style.maxHeight = ''
            return
        }

        this.pre.style.maxHeight = this.maxHeight
    }
}
