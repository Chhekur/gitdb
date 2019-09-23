
class model {
    private schema : Object;
    private name : String;

    public model(name : String, schema: Object){
        this.name = name;
        this.schema = schema;
    }

    public insert(object: Object){
        let verifiedData = this.verifyData(object);

    }

    private verifyData(object: Object){
        let temp: Object;
        for (var attr in this.schema){
            if(object[attr]){
                temp[attr] = object[attr];
            }
        }
        return temp;
    }

    private isModelExist(){
        if(global.gitdb.connection == null){
            
        }else{

        }
    }
}