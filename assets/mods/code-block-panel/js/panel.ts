import { default as params } from '@params';
import snackbar from 'mods/snackbar/js/index.ts';
import i18n from './i18n';

export default class Panel {
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

        this.ele = document.createElement('div')
        this.ele.className = 'code-block-panel'

        this.wrapper = document.createElement('div')
        this.wrapper.className = 'code-block-panel-wrapper'
        this.wrapper.appendChild(this.ele)

        this.maxLines()
        this.language()
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
        if (params.max_lines > 0 && lines.length > params.max_lines) {
            const offsetTop = lines[params.max_lines - 1].offsetTop
            if (offsetTop > 0) {
                this.pre.style.maxHeight = this.maxHeight = offsetTop + 'px'
            }
        }
    }

    // Show the code language.
    private language() {
        const lang = this.code.getAttribute('data-lang')
        if (!lang || lang === 'fallback') {
            return
        }

        const e = document.createElement('span')
        e.className = 'code-block-lang'
        e.innerText = lang
        this.pre.appendChild(e)
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
