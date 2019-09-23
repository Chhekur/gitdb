import utils = require('../utils/utils');

export class model {
    private schema : Object;
    private name : String;

    constructor(name : String, schema: Object){
        this.name = name;
        this.schema = schema;
    }

    public insert(object: Object){
        // let verifiedData = this.verifyData(object);
        return new Promise(function(resolve, reject){
            this.isExist()
            .then(function(){
                resolve();
            })
            .catch(function(error){
                reject(error);
            })
        }.bind(this));
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

    private isInfoExist(){
        return new Promise(function(resolve, reject){
            global.gitdb.repository.getContents(global.gitdb.branch, "info/1.json", true)
            .then(function(res){
                resolve();
            })
            .catch(function(error){
                if(error.toString().split(' ')[1] == "404"){
                    utils.createFile({
                        content: "{}",
                        path: "info/1.json"
                    })
                    .then(function(blob){
                        utils.createTree([
                            {
                                sha: blob['data'].sha,
                                path: "info/1.json",
                                mode: "100644",
                                type: 'blob'
                            }
                        ])
                        .then(function(tree){
                            utils.commit(tree['data'].sha, `creating models info file/dir`)
                            .then(function(commit){
                                utils.updateHead(commit['data'].sha)
                                .then(function(){
                                    resolve();
                                })
                                .catch(function(error){
                                    reject(error);
                                })
                            })
                            .catch(function(error){
                                reject(error);
                            })
                        })
                        .catch(function(error){
                            reject(error);
                        });
                    })
                    .catch(function(error){
                        reject(error);
                    })
                }
            })
        })
    }

    private isExist(){
        if(global.gitdb.connection == null){
            return new Promise(function(resolve, reject){
                utils.establishConnection()
                .then(function(){
                    utils.getCurrentCommitSHA(function(ref){
                        utils.getTreeSHA(ref, function(treesha){
                            console.log(treesha);
                            // need to complete
                            this.isInfoExist()
                            .then(function(){
                                console.log("file is created or already exist");
                                resolve();
                            })
                            .catch(function(error){
                                reject(error);
                            })
                            
                        }.bind(this)).catch(function(error){
                            reject(error);
                        })
                    }.bind(this)).catch(function(error){
                        reject(error);
                    })
                }.bind(this)).catch(function(error){
                    reject(error);
                })
            }.bind(this))
        }else{

        }
    }
}
