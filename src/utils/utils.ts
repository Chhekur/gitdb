import GitHub = require("./GitHub.bundle") ;

class utils{
    
    public auth(details:Object){
        //console.log(GitHub);
        return new GitHub(details);
    }

    public getRepository(username: String, repository: String, gitdb_connection:any){
        return gitdb_connection.getRepo(username, repository);
    }

    public setBranch(branchname){
        return global.gitdb.repository.listBranches()
        .then(function(branches){
            // console.log(branches);
            let exist = branches.data.find(branch => branchname === branch.name);
            if(!exist){
                // console.log('not exist');
                return global.gitdb.repository.createBranch('master', branchname)
                .then(function(){
                    global.gitdb.branch = branchname;
                })
                .catch(function(error){
                    throw error;
                })
            }else{
                // console.log('exist');
                global.gitdb.branch = branchname;
            }
        })
        .catch(function(error){
            throw error;
        });
    }

    public getCurrentCommitSHA(callback){
        console.log(global.gitdb.branch);
        console.log(`heads/${global.gitdb.branch}`);
        return global.gitdb.repository.getRef(`heads/${global.gitdb.branch}`)
        .then(function(ref){
            callback(ref.data.object.sha);
        })
        .catch(function(error){
            throw error;
        });
    }

    public getTreeSHA(commitSHA, callback){
        return global.gitdb.repository.getCommit(commitSHA)
        .then(function(commit){
            callback(commit.data.tree.sha);
        })
        .catch(function(error){
            throw error;
        })
    }

    public readTree(sha, callback){
        return global.gitdb.repository.getTree(sha)
        .then(function(res){
            callback(res);
        }).catch(function(error){
            throw error;
        })
    }

    public establishConnection(){
        if(global.gitdb.details == null){
            throw ("make the connection first");
        }
        else if(global.gitdb.connection == null){
            return new Promise(function(resolve, reject){
                try{
                    global.gitdb.connection = this.auth(global.gitdb.details);
                    // console.log(global);
                    resolve();
                }catch(error){
                    reject(error);
                }
            }.bind(this))
            .then(function(){
                return new Promise(function(resolve, reject){
                    this.setRepository(global.gitdb.details['username'], global.gitdb.details['repository'])
                    .then(function(){
                        this.setBranch(global.gitdb.details['branch'])
                        .then(function(){
                            resolve();
                        })
                        .catch(function(error){
                            reject(error);
                        })
                    }.bind(this))
                    .catch(function(error){
                        reject(error)
                    })
                }.bind(this))
                .catch(function(error){
                    throw error;
                })
            }.bind(this))
            .catch(function(error){
                console.error(error);
            });
        }
    }

    private setRepository(username, repository){
        return new Promise(function(resolve, reject){
            try{
                global.gitdb.repository = this.getRepository(username, repository, global.gitdb.connection);
                resolve();
            }catch(error){
                reject(error);
            }
        }.bind(this));
    }

    public createFile(fileInfo){
        return new Promise(function(resolve, reject){
            global.gitdb.repository.createBlob(fileInfo.content)
            .then(function(blob){
                resolve(blob);
            })
            .catch(function(error){
                reject(error);
            });
        }.bind(this));
    }

    public createTree(files: Array<any>){
        return new Promise(function(resolve, reject){
            this.getCurrentCommitSHA(function(ref){
                this.getTreeSHA(ref, function(treeSHA){
                    global.gitdb.repository.createTree(files, treeSHA)
                    .then(function(tree){
                        resolve(tree);
                    })
                    .catch(function(error){
                        reject(error);
                    })
                }).catch(function(error){
                    reject(error);
                });
            }.bind(this)).catch(function(error){
                reject(error);
            });
        }.bind(this));
    }

    public commit(treeSHA:any, message: String){
        return new Promise(function(resolve, reject){
            this.getCurrentCommitSHA(function(ref){
                global.gitdb.repository.commit(ref, treeSHA, message)
                .then(function(commit){
                    resolve(commit);
                })
                .catch(function(error){
                    reject(error);
                })
            }).catch(function(error){
                reject(error);
            });
        }.bind(this));
    }

    public updateHead(commitSHA: any){
        return new Promise(function(resolve, reject){
            global.gitdb.repository.updateHead(`heads/${global.gitdb.branch}`, commitSHA)
            .then(function(){
                resolve();
            })
            .catch(function(error){
                reject(error);
            });
        });
    }
}

export = new utils();