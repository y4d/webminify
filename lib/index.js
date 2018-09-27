const fs = require('fs');
const path = require('path');

const combine = require('./combine');
const compressjs = require('./compressjs')
const lessToCss = require('./plugins/less');
const compresscss = require('./compresscss');



class Webminify {


    registry(fn) {

        var next = this.__next = new Webminify();

        if (this.__data)
        {
            fn.call(this, next, this.__data);
            this.__data = null;
        }
        else
        {
            this.__fn = fn;
        }

        return next;
    }


    resolve(data) {

        var next = this.__next;

        if (next)
        {
            this.__fn(next, data);
        }
        else
        {
            this.__data = data;
        }
    }


    load(base, files) {

        return this.registry((next, data) => {

            if (!files)
            {
                files = base;
                base = '';
            }
    
            if (typeof files === 'string')
            {
                files = [files];
            }

            if (typeof data === 'string')
            {
                combine(data = [data], base, files);
            }
            else
            {
                combine(data, base, files);
            }

            next.resolve(data);
        });
    }


    push(text) {

        return this.registry((next, data) => {

            if (text)
            {
                if (typeof data === 'string')
                {
                    data = [data, text];
                }
                else
                {
                    data.push(text);
                }
            }

            next.resolve(data);
        });
    }


    combine(seperator) {

        return this.registry((next, data) => {

            data = data.join(seperator || '\r\n');
            next.resolve(data);
        });
    }


    lessToCss(options) {

        return this.registry((next, data) => {

            if (typeof data !== 'string')
            {
                data = data.join('\r\n');
            }

            lessToCss(data, options).then(output => {
              
                next.resolve(output.css);
            });
        });
    }


    compresscss(options) {

        return this.registry((next, data) => {

            if (typeof data !== 'string')
            {
                data = data.join('\r\n');
            }

            data = compresscss(data, options);
            next.resolve(data);
        });
    }


    compressjs(options) {

        return this.registry((next, data) => {

            if (typeof data !== 'string')
            {
                data = data.join('\r\n');
            }

            data = compressjs(data, options);
            next.resolve(data);
        });
    }


    output(file) {

        return this.registry((next, data) => {

            if (typeof data !== 'string')
            {
                data = data.join('\r\n');
            }

            fs.writeFileSync(path.join(process.cwd(), file), data, 'utf8');
            next.resolve(data);
        });
    }

}


module.exports = function () {

    var webminify = new Webminify();

    webminify.__data = [];
    return webminify;
}
