

module.exports = app => {

    class Base extends app.Service {

        _formatTableValue(tableObj, paramObj) {

            // used to store the table attributes
            const obj = {};

            // parameter paramObj is not an object or cann't convert to object
            if (!paramObj) {
                return obj;
            }

            // filer attributes just releated to database
            Object.entries(tableObj).map(tableAttri => {

                // table object's attribute exists in parameter object and the value of parameter object exists
                if (paramObj[tableAttri[0]]) {
                    obj[tableAttri[0]] = paramObj[tableAttri[0]];
                    return;
                }

                // table object's attribute exists in parameter object and the value of parameter object equal to false
                if (paramObj[tableAttri[0]] === false) {
                    obj[tableAttri[0]] = paramObj[tableAttri[0]];
                    return;
                }

                // table object's attribute exists in parameter object and the value of parameter object equal to 0
                if (paramObj[tableAttri[0]] === 0) {
                    obj[tableAttri[0]] = paramObj[tableAttri[0]];
                    return;
                }
            });
            return obj;
        }


        _formatQueryAttributes(tableObj, paramAttri) {

            // the attributes queried is just include '*'
            if (paramAttri.length === 1 && paramAttri[0] === '*') {
                return paramAttri;
            }

            // the attributes queried is just include 'max()'
            if (paramAttri.length === 1 && paramAttri[0].includes('max')) {
                return paramAttri;
            }

            // the attributes queried is just include 'min()'
            if (paramAttri.length === 1 && paramAttri[0].includes('min')) {
                return paramAttri;
            }

            // the attribute queried include more than one attribute
            const attributes = [];
            const tableAttri = Object.keys(tableObj);
            paramAttri.map(ele => {
                if (tableAttri.includes(ele)) {
                    attributes.push(ele);
                }
            });

            if (attributes.length !== 0) {
                return attributes;
            }

            return ['*'];
        }


        _parameterExists(param) {

            // parameter doesn't exist
            if (param === '' || param === null || param == undefined) {
                return false;
            }

            // parameter exists
            return true;
        }


        _judge(entry) {
            if (entry[1] === false) {
                return true;
            } else if (entry[1] === 0) {
                return true;
            } else if (entry[1]) {
                return true;
            } else {
                return false;
            }
        }
    
    
        async _query(tableName, attributes, wheres) {
            const _this = this;
    
            // generate query str and values
            const values = [];
            let str = 'select ';
            for (const attribute of attributes) {
                str = str + attribute + ', ';
            }
            str = str.substr(0, str.length - 2);
            str = str + ' from ' + tableName;
    
            // when query without where condition(wheres is a {})
            if (JSON.stringify(wheres) === '{}') {
                const result = await this.app.db.query(str, values);
                // console.log(str);
                // console.log(values);
                return result;
            }
    
            // where query with where condition (wheres is not a {})
            str = str + ' where ';
    
            // change object to array
            const entries = Object.entries(wheres).filter(entry => _this._judge(entry));
            if (entries.length === 0) {
                str = str.substr(0, str.length - 7);
                const result = await this.app.db.query(str, values);
                // console.log(str);
                // console.log(values);
                return result;
            }
    
            for (let i = 0; i < entries.length; i++) {
                str = str + entries[i][0] + ' = $' + (i + 1) + ' and ';
                values.push(entries[i][1]);
            }
            str = str.substr(0, str.length - 5);
    
            // console.log(str);
            // console.log(values);
            const result = await this.app.db.query(str, values);
            return result;
        }
    
    
        async _count(tableName, attribute, wheres) {
            attribute = 'count(' + attribute +')';
            let count = await this._query(tableName, [attribute], wheres);
            count = count[0] && +count[0].count || -1;
            return count;
        }
    
    
        async _update(tableName, obj, wheres) {
            const _this = this;
    
            // generate query str and values
            const values = [];
            let str = 'update ' + tableName + ' set ';
    
            // change object to array
            let entries = Object.entries(obj).filter(entry => _this._judge(entry));
            let i = 0;
            for (; i < entries.length; i++) {
                str = str + entries[i][0] + ' = $' + (i + 1) + ', ';
                values.push(entries[i][1]);
            }
            str = str.substr(0, str.length - 2);
    
            if(JSON.stringify(wheres) === '{}') {
                console.log(str);
                console.log(values);
                await this.app.db.query(str, values);
                return;
            }
    
            str = str + ' where ';
            entries = Object.entries(wheres).filter(entry => _this._judge(entry));
            for (let j = 0; j < entries.length; j++) {
                str = str + entries[j][0] + ' = $' + (j + i + 1) + ' and ';
                values.push(entries[j][1]);
            }
            str = str.substr(0, str.length - 5);
            console.log(str);
            console.log(values);
            await this.app.db.query(str, values);
        }
    
    
        async _insert(tableName, obj) {
            const _this = this;
    
            // generate query str and values
            const values = [];
            let str = 'insert into ' + tableName + '(';
            let temp = '(';
    
            // change object to array
            const entries = Object.entries(obj).filter(entry => _this._judge(entry));
            for (let i = 0; i < entries.length; i++) {
                str = str + entries[i][0] + ', ';
                temp = temp + '$' + (i + 1) + ', ';
                values.push(entries[i][1]);
            }
            str = str.substr(0, str.length - 2) + ')';
            temp = temp.substr(0, temp.length - 2) + ')';
            str = str + ' values ' + temp;
    
            // console.log(str);
            // console.log(values);
            await this.app.db.query(str, values);
        }
    
    
        async _delete(tableName, wheres) {
            const _this = this;
    
            const values = [];
            let str = 'delete from ' + tableName;
            if (JSON.stringify(wheres) === '{}') {
                await this.app.db.query(str, values);
                return;
            }
            str = str + ' where ';
            const entries = Object.entries(wheres).filter(entry => _this._judge(entry));
            for (let i = 0; i < entries.length; i++) {
                str = str + entries[i][0] + ' = $' + (i + 1) + ' and ';
                values.push(entries[i][1]);
            }
            str = str.substr(0, str.length - 5);
    
            await this.app.db.query(str, values);
        }
    
    }

    return Base;
}