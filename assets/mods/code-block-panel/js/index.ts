import Panel from './panel';

(() => {
    'use strict'

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('pre code').forEach((code) => {
            (new Panel(code as HTMLElement)).init()
        })
    })

})()
