import utils = require('../utils/utils');
import parser = require('../parser/parser');

export class model {
    private schema : Object;
    private name : String;

    constructor(name : String, schema: Object){
        try{
            this.name = name;
            parser.validate(schema);
            this.schema = schema;
        }catch(error){
            console.error(error);
        }
    }

    public insert(data: Object){
        if(this.schema == undefined) return;
        let serializedData = this.serialize(data);
        if(global.gitdb.connection == null){
            return new Promise(function(resolve, reject){
                utils.establishConnection()
                .then(function(){
                    utils.createFile(serializedData, `${this.name}/${serializedData[parser.getPrimaryKey(this.schema)]}`, `inserting data into ${this.name} model`)
                    .then(function(res){
                        resolve(res);
                    })
                    .catch(function(error){
                        reject(error);
                    })
                }.bind(this))
                .catch(function(error){
                    reject(error);
                })
            }.bind(this));
        }
    }

    private serialize (data: Object){
        let temp: Object = {};
        for (var attr in this.schema){
            if(data[attr]){
                temp[attr] = data[attr];
            }
        }
        return temp;
    }

    private deserialize(){

    }

    private isInfoExist(){
        return new Promise(function(resolve, reject){
            global.gitdb.repository.getContents(global.gitdb.branch, "info/info", true)
            .then(function(res){
                resolve();
            })
            .catch(function(error){
                if(error.toString().split(' ')[1] == "404"){
                    utils.createBlob({
                        content: "{}",
                        path: "info/info"
                    })
                    .then(function(blob){
                        utils.createTree([
                            {
                                sha: blob['data'].sha,
                                path: "info/info",
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
                }else{
                    reject(error);
                }
            })
        })
    }

    private isExist(){
        return new Promise(function(resolve, reject){
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
        }.bind(this))
    }
}
