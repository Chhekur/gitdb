import utils = require("../utils/utils");
import { rejects } from "assert";
class gitdb {

    private details: Object;

    constructor(){
        global.gitdb = {
            connection: null,
            repository: null,
            branch: null,
            details: null
        }
        this.details = null;
    }

    public connect(details:Object){
        if(details == null || details == undefined || details == {}){
            throw ("Please provide valid github credentials")
        }
        if(details['repository'] == undefined || details['branch'] == undefined){
            throw ("object with following attributes is required\n1. Token\n2. Repository\n3. Branch");
        }
        this.details = details;
        global.gitdb.details = details;
    }

    

    // private setBranch(){
    //     return new Promise(function(resolve, reject){
    //         utils.setBranch(this.details['branch'])
    //         .then(function(){
    //             resolve();
    //         })
    //         .catch(function(error){
    //             reject(error);
    //         })
    //     }.bind(this))
    //     .catch(function(error){
    //         throw error;
    //     })
    // }

    // private setRepository(username, repository){
    //     return new Promise(function(resolve, reject){
    //         try{
    //             global.gitdb.repository = utils.getRepository(username, repository, global.gitdb.connection);
    //             resolve();
    //         }catch(error){
    //             reject(error);
    //         }
    //     });
    // }

    public testCommitSHA(){
        if(global.gitdb.connection == null){
            utils.establishConnection()
            .then(function(){
                console.log(global.gitdb);
                utils.getCurrentCommitSHA(function(ref){
                    console.log(ref);
                    utils.getTreeSHA(ref, function(treesha){
                        console.log(treesha);
                    }).catch(function(error){
                        throw error;
                    })
                }).catch(function(error){
                    throw error;
                })
            })
            .catch(function(error){
                console.error(error);
            })
        }else{
            utils.getCurrentCommitSHA(function(ref){
                console.log(ref);
                utils.getTreeSHA(ref, function(treesha){
                    console.log(treesha);
                }).catch(function(error){
                    throw error;
                })
            }).catch(function(error){
                console.error(error);
            })
        }
    }
}

export = new gitdb();