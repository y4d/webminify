const fs = require('fs');
const path = require('path');

const combine = require('./combine');
const compressjs = require('./compressjs')
const lessToCss = require('./plugins/less');
const compresscss = require('./compresscss');



class Webminify {


    constructor() {

        this.data = [];
        this.scheduler = Promise.resolve();
    }



    async execute(fn, args) {

        await fn.apply(this, args);
        return this;
    }


    load(base, files) {

        if (!files)
        {
            files = base;
            base = '';
        }

        if (typeof files === 'string')
        {
            files = [files];
        }

        this.execute(async function () {

            combine(this.data, base, files);
        });

        return this;
    }


    push(text) {

        this.execute(async function () {

            this.data.push(text);
        });

        return this;
    }


    combine(seperator) {

        this.execute(async function () {

            this.text = this.data.join(seperator || '\r\n');
            this.data.length = 0;
        });
        
        return this;
    }


    lessToCss(options) {

        this.execute(async function () {

            let text = this.text;

            if (text)
            {
                this.text = await lessToCss(text, options);
            }
        });
        
        return this;
    }


    compresscss(options) {

        this.execute(async function () {

            let text = this.text;

            if (text)
            {
                this.text = compresscss(text, options);
            }
        });
        
        return this;
    }


    compressjs(options) {

        this.execute(async function () {

            let text = this.text;

            if (text)
            {
                this.text = compressjs(text, options);
            }
        });
        
        return this;
    }


    output(file) {

        this.execute(async function () {

            let text = this.text;

            if (text)
            {
                fs.writeFileSync(path.join(process.cwd(), file), text, 'utf8');
            }
        });
        
        return this;
    }

}


module.exports = function () {

    return new Webminify();
}
