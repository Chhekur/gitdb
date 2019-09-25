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
            }else{
                throw(`Syntax error ^ ${attr} : ${JSON.stringify(model[attr])}`);
            }
        }
    }

    public validate(model){
        this.verifyAttributes(model);
        // console.log(this.hasPrimary(model));
        if(!this.hasPrimary(model)) throw (`Primary key not found ^ ${JSON.stringify(model)}`);
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