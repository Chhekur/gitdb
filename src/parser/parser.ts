import definations = require('./definations');

class parser {

    private hasPrimary(model){
        for(let attr in model){
            for(let value in model[attr]){
                if(value == "primary" && model[attr][value]){
                    return true;
                }
            }
        }
        return false;
    }
    
    private verifyAttributes(model){
        for(let attr in model){
            console.log(typeof model[attr]);
            if(typeof model[attr] == "object"){
                if(definations.type[model[attr].type] == undefined) {
                    console.log(model[attr], attr);
                    throw(`Syntax error ^ ${attr} : ${JSON.stringify(model[attr])}`);
                }
            }else if(model[attr] == ""){
                model[attr] = definations.default;
            }
            else {
                throw(`Syntax error ^ ${attr} : ${JSON.stringify(model[attr])}`);
            }
        }
        return model;
    }

    public validate(model){
        let verifiedModel = this.verifyAttributes(model);
        // console.log(this.hasPrimary(model));
        if(!this.hasPrimary(verifiedModel)) throw (`Primary key not found ^ ${JSON.stringify(model)}`);
        return verifiedModel;
    }

    public getPrimaryKey(model){
        for(let attr in model){
            for(let value in model[attr]){
                if(value == "primary" && model[attr][value]){
                    return attr;
                }
            }
        }
    }
}

export = new parser();