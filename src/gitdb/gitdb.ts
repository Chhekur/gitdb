import utils = require("../utils/utils");
class gitdb{
    private gh

    constructor(){
        this.gh = null;
    }

    public connect(details:Object){
        if(this.gh == null){
            return new Promise(function(resolve, reject){
                try{
                    this.gh = utils.auth(details);
                    resolve();
                }catch(error){
                    reject(error);
                }
            }.bind(this));
        }
    }
}

export = new gitdb();