//CLUM = Client URL Manager
'use strict';
const pattern = /[\?\=0-9a-z]/ig;
var params = {},
link,
variables,
noUrl,
counter = 0,
linkAux = null;//This variable is used to remove the url without variables

class CLUM {

    constructor () {
        link = encodeURI(location.href);        
    }

    load (url) {
        location.href = url;
    }

    reload () {
        location.reload();
    }

    get (prop) {
        let handle, data;

        if (linkAux !== null) link = linkAux;
        if (link.match(pattern)) {
            noUrl = link.split(/\?|\&/);
            noUrl.shift();
            noUrl.forEach( (param) => {
                handle = param.split(/\=/)[0];
                data = param.split(/\=/)[1];
                Object.defineProperty(params, handle, {value: data, writable: true});
            });            
            return Object.getOwnPropertyDescriptor(params, prop).value;
        }

        return false;
    }

    getAll () {
        let handle, data;        

        if (linkAux !== null) link = linkAux;
        if (link.match(pattern)) {
            noUrl = link.split(/\?|\&/);
            noUrl.shift();
            noUrl.forEach( (param) => {
                handle = param.split(/\=/)[0];
                data = param.split(/\=/)[1];
                Object.defineProperty(params, handle, {value: data, writable: true});
            });
            return params;
        }

        return false;
    }

    set (var_name, value, replace = false) {
        let pos, data = '', symbol;

        if (this.getEmpty()) {
            history.pushState('', document.title, link + `?${var_name}=${value}`);
            linkAux = link + `\?${var_name}=${value}`;
            counter++;
        } else if (!this.varExists(var_name)) {
            history.pushState('', document.title, link + `&${var_name}=${value}`);
            linkAux = link + `\&${var_name}=${value}`;      
        }
        
        if (this.varExists(var_name) && replace) {
            if (link.indexOf(`\?${var_name}=`) > 0) {
                pos = link.indexOf(`\?${var_name}=`);
            } else
                pos = link.indexOf(`\&${var_name}=`);

            while (link[pos] != undefined) {                
                data += link[pos];
                pos++;
                if (link[pos] == '&') {
                    break;
                }
            }

            symbol = link[link.indexOf(`${var_name}=`) - 1];

            if (symbol == '\?') {
                history.pushState('', document.title, link.replace(data, `\?${var_name}=${value}`));
                linkAux = link.replace(data, `\?${var_name}=${value}`);
            } else if (symbol == '\&') {
                history.pushState('', document.title, link.replace(data, `\&${var_name}=${value}`));
                linkAux = link.replace(data, `\&${var_name}=${value}`);
            }            

            return true;
        }

        this.getAll();
        
        return false;
    }

    update (link) {
        history.replaceState('', document.title, linkAux);
    }

    getEmpty () {
        if (link.match(/\?[a-z0-9]/g)) {
            return false;
        }

        return true;
    }

    varExists (var_name) {
        if (link.match(`[\?]${var_name}=`) || link.match(`\&${var_name}=`)) {
            return true;
        }
        
        return false;
    }

    varsQuantity () {
        let aux, remove;

        if (counter == 1) {
            return counter;
        } else {
            aux = linkAux != null ? linkAux : link;
            if (aux.match(pattern)) {
                remove = link.split(/\?|\&/);
                remove.shift();

                return remove.length + 1;
            }
        }        
    }
}