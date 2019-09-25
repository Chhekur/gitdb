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

        return new Promise(function(resolve, reject){
            if(this.schema == undefined) reject();
            let serializedData = this.serialize(data);
            if(global.gitdb.connection == null){
                utils.establishConnection()
                .then(function(){
                    this.insertHelper(serializedData)
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
            }else{
                this.insertHelper(serializedData)
                .then(function(res){
                    resolve(res);
                })
                .catch(function(error){
                    reject(error);
                })
            }
        }.bind(this));
    }

    private insertHelper(data){
        return new Promise(function(resolve, reject){
            utils.createFile(data, `${this.name}/${data[parser.getPrimaryKey(this.schema)]}`, `inserting data into ${this.name} model`)
            .then(function(res){
                resolve(res);
            })
            .catch(function(error){
                reject(error);
            })
        }.bind(this));
    }

    public find(pattern: Object){

        return new Promise(function(resolve, reject){
            if(this.schema == undefined) reject();
            // console.log('Hello', JSON.stringify(pattern) == "{}");
            let serializedData = this.serialize(pattern);
            if(global.gitdb.connection == null){
                utils.establishConnection()
                .then(function(){
                    this.findHelper(serializedData)
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
            }else{
                this.findHelper(serializedData)
                .then(function(res){
                    resolve(res);
                })
                .catch(function(error){
                    reject(error);
                })
            }
        }.bind(this));
    }

    private findHelper(pattern: Object){
        return new Promise(function(resolve, reject){
            let primaryKey = parser.getPrimaryKey(this.schema);
            if(primaryKey in pattern){
                utils.getFile(`${this.name}/${pattern[primaryKey]}`)
                .then(function(content){
                    resolve([content]);
                })
                .catch(function(error){
                    if(error.toString().split(' ')[1] == "404"){
                        resolve([{}]);
                    }else reject(error);
                })
            }else{
                // console.log("primary key not found");
                global.gitdb.repository.getContents(global.gitdb.branch, `${this.name}`, true)
                .then(function(res){
                    let results = [];
                    res.data.forEach(function(element) {
                        utils.getBlob(element.sha)
                        .then(function(blob){
                            let flag: Boolean = true;
                            for(let pat in pattern){
                                if(JSON.stringify(blob['data'][pat]) != JSON.stringify(pattern[pat])){
                                    flag = false;
                                    // console.log(blob['data'][pat], pattern[pat]);
                                }
                            }
                            if(flag) results.push(blob['data']);
                        })
                        .catch(function(error){
                            reject(error);
                        })
                    });
                    resolve(results);
                })
                .catch(function(error){
                    if(error.toString().split(' ')[1] == "404"){
                        resolve([{}]);
                    }else reject(error);
                })
            }
        }.bind(this));
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
